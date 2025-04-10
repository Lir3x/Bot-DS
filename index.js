// server-check-bot/index.js

const fetch = require("node-fetch");
const mc = require("minecraft-server-util");

const SERVER_IP = process.env.SERVER_IP || "bigvanill.falixsrv.me";
const PORT = parseInt(process.env.PORT) || 25565;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
let lastStatus = null;

const sendDiscordAlert = async (message) => {
  if (!DISCORD_WEBHOOK) return;
  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
};

const checkServer = async () => {
  try {
    const result = await mc.status(SERVER_IP, PORT, { timeout: 5000 });
    if (lastStatus !== "online") {
      console.log("🟢 Server attivo");
      sendDiscordAlert(`🟢 Server **online**! IP: \`${SERVER_IP}:${PORT}\``);
    }
    lastStatus = "online";
  } catch (err) {
    if (lastStatus !== "offline") {
      console.log("🔴 Server offline");
      sendDiscordAlert(`🔴 Server **offline**! Impossibile raggiungere \`${SERVER_IP}:${PORT}\``);
    }
    lastStatus = "offline";
  }
};

// Loop ogni 5 minuti
setInterval(checkServer, 5 * 60 * 1000);
checkServer(); // prima esecuzione subito
