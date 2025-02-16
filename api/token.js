require("dotenv").config();
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { channelName, uid } = req.query;
    if (!channelName) {
        return res.status(400).json({ error: "Channel name is required" });
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const expirationTimeInSeconds = 3600;
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTime + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        parseInt(uid) || 0,
        RtcRole.PUBLISHER,
        privilegeExpiredTs
    );

    res.json({ token });
};
