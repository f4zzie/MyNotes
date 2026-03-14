const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1482494734328139827/LULYIUZ3sklH_FgDDSAV01JEhr6Gp2FRieqfIMb5VlaYxk4BOfalUk2AiOu2WDSfojeg";

export async function trackVisitor() {
  // Don't track in development
  if (window.location.hostname === "localhost") return;

  // Don't track the same session twice
  if (sessionStorage.getItem("tracked")) return;
  sessionStorage.setItem("tracked", "1");

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return;
    const geo = await res.json();

    const embed = {
      title: "New Visitor",
      color: 0x2ba283,
      fields: [
        { name: "IP", value: geo.ip || "Unknown", inline: true },
        { name: "Location", value: `${geo.city || "?"}, ${geo.region || "?"}, ${geo.country_name || "?"}`, inline: true },
        { name: "ISP", value: geo.org || "Unknown", inline: false },
        { name: "Page", value: window.location.href, inline: true },
        { name: "Referrer", value: document.referrer || "Direct", inline: true },
        { name: "Device", value: navigator.userAgent.slice(0, 200), inline: false },
      ],
      timestamp: new Date().toISOString(),
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch {
    // Silently fail — don't break the site for a tracking error
  }
}
