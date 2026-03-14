const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1482494734328139827/LULYIUZ3sklH_FgDDSAV01JEhr6Gp2FRieqfIMb5VlaYxk4BOfalUk2AiOu2WDSfojeg";

async function getGeoData() {
  // Try primary API
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        isp: data.org,
      };
    }
  } catch { /* fall through */ }

  // Fallback API
  try {
    const res = await fetch("https://ip-api.com/json/?fields=query,city,regionName,country,isp");
    if (res.ok) {
      const data = await res.json();
      return {
        ip: data.query,
        city: data.city,
        region: data.regionName,
        country: data.country,
        isp: data.isp,
      };
    }
  } catch { /* fall through */ }

  return null;
}

export async function trackVisitor() {
  // Don't track in development
  if (window.location.hostname === "localhost") return;

  // Don't track the same session twice
  if (sessionStorage.getItem("tracked")) return;

  try {
    const geo = await getGeoData();

    const fields = geo
      ? [
          { name: "IP", value: geo.ip || "Unknown", inline: true },
          { name: "Location", value: `${geo.city || "?"}, ${geo.region || "?"}, ${geo.country || "?"}`, inline: true },
          { name: "ISP", value: geo.isp || "Unknown", inline: false },
        ]
      : [{ name: "IP", value: "Could not resolve", inline: false }];

    fields.push(
      { name: "Page", value: window.location.href, inline: true },
      { name: "Referrer", value: document.referrer || "Direct", inline: true },
      { name: "Device", value: navigator.userAgent.slice(0, 200), inline: false },
    );

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "New Visitor",
            color: 0x2ba283,
            fields,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    // Only mark tracked if the webhook actually succeeded
    if (res.ok) {
      sessionStorage.setItem("tracked", "1");
    }
  } catch {
    // Silently fail — don't break the site
  }
}
