
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

let API_KEY = "";
try {
    const env = fs.readFileSync('.env', 'utf8');
    const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match) API_KEY = match[1].trim();
} catch (e) {
    console.error("COULD NOT READ .env FILE");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
  console.log("TESTING MODEL: gemini-3.1-flash-lite-preview");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
    const prompt = "Dịch từ 'Hello' sang tiếng Việt";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("SUCCESS TEXT:", response.text());
  } catch (error) {
    console.error("--- ERROR DETAILS ---");
    console.error("STATUS:", error.status);
    console.error("MESSAGE:", error.message);
    if (error.response) {
      try {
        console.error("RESPONSE BODY:", JSON.stringify(await error.response.json(), null, 2));
      } catch (e) {}
    }
    console.error("--- END ERROR DETAILS ---");
  }
}

test();
