require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Generate Token Route
app.get("/getToken", (req, res) => {
    const { channelName, uid } = req.query;
    if (!channelName) {
        return res.status(400).json({ error: "Channel name is required" });
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const expirationTimeInSeconds = 3600; // 1 hour
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
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
