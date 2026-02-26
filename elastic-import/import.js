import fs from "fs";
import readline from "readline";
import dotenv from "dotenv";
import { Client } from "@elastic/elasticsearch";

dotenv.config();

const client = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY
  }
});

const BATCH_SIZE = 50000;
const FILE_PATH = "C:/Users/ausxt/Downloads/Brazzers.txt"; // rename to your txt filename

async function run() {
  const stream = fs.createReadStream(FILE_PATH);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  let batch = [];
  let count = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;

    const parts = line.split(":");
    if (parts.length < 3) continue;

    const [email, username, password] = parts;

    batch.push({ index: { _index: "breaches" } });
    batch.push({
      email,
      username,
      password
    });

    if (batch.length >= BATCH_SIZE * 2) {
      await client.bulk({ refresh: false, body: batch });
      count += BATCH_SIZE;
      console.log(`Indexed ${count} records...`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await client.bulk({ refresh: true, body: batch });
    console.log("Final batch indexed.");
  }

  console.log("Import complete.");
}

run().catch(console.error);
