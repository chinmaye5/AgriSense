
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

async function debug() {
    const envPath = ".env.local";
    const envLines = fs.readFileSync(envPath, "utf-8").split("\n");
    const envVars = {};
    envLines.forEach(l => {
        const [k, v] = l.split("=");
        if (k && v) envVars[k.trim()] = v.trim();
    });

    console.log("Checking Env Vars...");
    console.log("OPENAI_API_KEY exists:", !!envVars["OPENAI_API_KEY"]);
    console.log("QDRANT_URL:", envVars["QDRANT_URL"]);
    console.log("QDRANT_API_KEY exists:", !!envVars["QDRANT_API_KEY"]);

    const openai = new OpenAI({ apiKey: envVars["OPENAI_API_KEY"] });
    const qdrant = new QdrantClient({
        url: envVars["QDRANT_URL"],
        apiKey: envVars["QDRANT_API_KEY"],
    });

    try {
        console.log("Testing OpenAI Embedding...");
        const resp = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: "test",
        });
        console.log("OpenAI Embedding Success!");
    } catch (e) {
        console.error("OpenAI Embedding Failed:", (e.response ? e.response.status : e.message), (e.response ? JSON.stringify(e.response.data) : ""));
    }

    try {
        console.log("Testing Qdrant Connection...");
        const collections = await qdrant.getCollections();
        console.log("Qdrant Collections:", collections.collections.map(c => c.name));
    } catch (e) {
        console.error("Qdrant Connection Failed:", e.message);
    }
}

debug();
