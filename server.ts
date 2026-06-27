/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limit for base64 image uploads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Lazy init of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Using default fallback or blank string.");
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiClient;
}

// 1. Analyze reported issue using Gemini 2.5 Flash
app.post("/api/analyze", async (req, res) => {
  try {
    const { image, mimeType, description, title } = req.body;

    if (!description && !image) {
      return res.status(400).json({ error: "At least a description or an image is required for analysis." });
    }

    const ai = getAIClient();
    const contents: any[] = [];

    // Construct precise prompt instructing Gemini to return valid JSON
    const systemInstruction = `
You are a highly capable Smart City Infrastructure AI assistant.
Your task is to analyze reports submitted by citizens (consisting of a title, description, and an optional image) and classify the issue.

You MUST return a JSON object ONLY matching this TS interface:
{
  "category": "Road Damage" | "Flooding" | "Illegal Dumping" | "Water Leakage" | "Power Outage" | "Broken Streetlight" | "Fire Hazard" | "Fallen Tree" | "Sewage" | "Other",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "confidence": number, // floating point between 0 and 1, indicating your classification confidence
  "summary": string, // brief, professional, 1-2 sentence description summarizing the problem,
  "department": "Roads Department" | "Waste Management" | "Water Company" | "Electricity Company" | "Disaster Management" | "Environmental Protection" | "Municipal Assembly",
  "possibleRisk": string, // detail risks (e.g., accident hazard, public health, property damage),
  "recommendedAction": string // action recommended for dispatchers
}

Follow these strict mapping guidelines:
- If the issue is a pothole, cracked road, missing manhole cover, broken sidewalk -> category "Road Damage", department "Roads Department"
- If water is pooling or flooding streets/basements, clogged drainage -> category "Flooding", department "Disaster Management" or "Roads Department"
- If garbage is thrown in streets/parks, litter, industrial dumping -> category "Illegal Dumping", department "Waste Management"
- If a burst pipe, leaking hydrant, drinking water wastage -> category "Water Leakage", department "Water Company"
- If power lines are down, transformers sparked, widespread blackouts -> category "Power Outage", department "Electricity Company"
- If streetlights are off, flickering at night -> category "Broken Streetlight", department "Electricity Company" or "Municipal Assembly"
- If fire hazard, sparks, flammable accumulation -> category "Fire Hazard", department "Disaster Management"
- If fallen tree, blocked road from a branch -> category "Fallen Tree", department "Municipal Assembly" or "Roads Department"
- If leaking raw sewage, bad smell from manhole -> category "Sewage", department "Water Company" or "Environmental Protection"
- Else -> category "Other", department "Municipal Assembly"

Priority selection:
- Critical: Direct threat to life or immediate safety (e.g., live high-voltage power lines down, major flooding, fire hazard on a building, open manhole on active road).
- High: Major disruption, risk of vehicle damage, or serious health issues (e.g., major pothole on highway, large water leakage flooding a lane, active illegal dumping of chemicals).
- Medium: General community issue causing inconvenience (e.g., broken streetlights in dark alley, blockages on secondary pathways, standard potholes, standard illegal dumping).
- Low: Cosmetic or minor issues (e.g., minor pavement cracking, faint streetlight flicker, small litter).

Provide a realistic 'confidence' score (e.g., 0.85 to 0.99) based on the clarity of description and visual evidence.
`;

    const userPrompt = `
Analyze this citizen report:
Title: "${title || 'Untitled Report'}"
User Description: "${description || 'No description provided'}"
`;

    contents.push({ text: systemInstruction });
    contents.push({ text: userPrompt });

    if (image && mimeType) {
      // Remove data URL scheme if present (e.g., "data:image/jpeg;base64,")
      let cleanBase64 = image;
      if (image.includes(";base64,")) {
        cleanBase64 = image.split(";base64,")[1];
      }
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from Gemini API");
    }

    const resultJson = JSON.parse(responseText.trim());
    return res.json(resultJson);
  } catch (error: any) {
    console.error("Error in AI analysis route:", error);
    return res.status(500).json({
      error: "Failed to analyze report with AI.",
      details: error.message || error,
    });
  }
});

// 2. AI Citizen Chatbot using Gemini 2.5 Flash
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, reportsContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAIClient();

    const systemContext = `
You are CivicEye AI, a professional smart city virtual assistant representing the Municipal Government.
Your role is to help citizens understand reported civic issues, explain how to file reports, and offer advice on public safety and environmental concerns.

Rules:
1. Be helpful, professional, warm, and structured in your responses.
2. Use formatting (bullet points, bold text) for clarity.
3. If the user asks about the status of reports, reference the following current reports context when answering.
4. Encourage reports but explain that emergency services (911/112) should be called directly for active life-threatening emergencies.

${reportsContext ? `Here is the current list of reports related to the user/city for your reference: ${JSON.stringify(reportsContext)}` : ""}
`;

    // Map incoming simplified history to the required content schema
    const formattedContents: any[] = [{ text: systemContext }];

    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          text: `${turn.role === "user" ? "Citizen" : "CivicEye AI"}: ${turn.content}`,
        });
      }
    }

    formattedContents.push({ text: `Citizen: ${message}` });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
    });

    const reply = response.text || "I apologize, but I couldn't formulate a response right now. Please try again.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in Chatbot API route:", error);
    return res.status(500).json({
      error: "Failed to communicate with the chatbot.",
      details: error.message || error,
    });
  }
});

// Configure Vite or production static asset delivery
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicEye Server running on http://localhost:${PORT}`);
  });
}

startServer();
