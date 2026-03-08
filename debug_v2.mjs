
import { QdrantClient } from "@qdrant/js-client-rest";
import fs from "fs";

async function debug() {
    const envPath = ".env.local";
    const envLines = fs.readFileSync(envPath, "utf-8").split("\n");
    const envVars = {};
    envLines.forEach(l => {
        const [k, v] = l.split("=");
        if (k && v) envVars[k.trim()] = v.trim();
    });

    const urlWithPort = envVars["QDRANT_URL"];
    const urlWithoutPort = urlWithPort.replace(":6333", "");

    console.log("Original URL:", urlWithPort);
    console.log("No Port URL:", urlWithoutPort);

    const qdrant1 = new QdrantClient({ url: urlWithPort, apiKey: envVars["QDRANT_API_KEY"] });
    const qdrant2 = new QdrantClient({ url: urlWithoutPort, apiKey: envVars["QDRANT_API_KEY"] });

    try {
        console.log("Testing Original URL...");
        await qdrant1.getCollections();
        console.log("Original URL worked!");
    } catch (e) {
        console.error("Original URL failed:", e.message);
    }

    try {
        console.log("Testing No Port URL...");
        await qdrant2.getCollections();
        console.log("No Port URL worked!");
    } catch (e) {
        console.error("No Port URL failed:", e.message);
    }
}

debug();
