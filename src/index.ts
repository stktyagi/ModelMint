import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { SCAD_LIBRARY } from "./scad_lib.js"; 

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY; 

const __filename = fileURLToPath(import.meta.url);
const WORKSPACE_DIR = path.join(process.cwd(), "workspace");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const SESSIONS = new Map<string, any[]>();

async function generateScad(filename: string, aiCode: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, "");
  await fs.mkdir(WORKSPACE_DIR, { recursive: true });
  
  const scadPath = path.join(WORKSPACE_DIR, `${safeName}.scad`);
  const pngPath = path.join(WORKSPACE_DIR, `${safeName}.png`);
  const stlPath = path.join(WORKSPACE_DIR, `${safeName}.stl`);

  const fullCode = `${SCAD_LIBRARY}\n\n// --- AI GENERATED CODE ---\n${aiCode}`;

  await fs.writeFile(scadPath, fullCode);

  const pngCommand = `openscad -o "${pngPath}" --viewall --autocenter --imgsize=800,800 --colorscheme="Cornfield" "${scadPath}"`;
  await new Promise((resolve, reject) => {
    exec(pngCommand, { maxBuffer: 1024 * 5000 }, (err, stdout, stderr) => {
      if (err) reject(stderr || err.message);
      else resolve(stdout);
    });
  });

  const stlCommand = `openscad -o "${stlPath}" "${scadPath}"`;
  await new Promise((resolve, reject) => {
    exec(stlCommand, { maxBuffer: 1024 * 5000 }, (err, stdout, stderr) => {
      if (err) reject(stderr || err.message);
      else resolve(stdout);
    });
  });

  return { safeName };
}

const server = new McpServer({ name: "modelmint", version: "2.1.0" });

const createToolSchema = {
  name: "create_model",
  description: "Generates 3D geometry. Output MUST be valid OpenSCAD code utilizing the Standard Library.",
  input_schema: {
    type: "object" as const, 
    properties: {
      filename: { type: "string" },
      code: { type: "string", description: "The OpenSCAD logic calling Standard Library modules." }
    },
    required: ["filename", "code"]
  }
};

server.tool("create_model", createToolSchema.description, 
  { filename: z.string(), code: z.string() },
  async ({ filename, code }) => {
    return { content: [{ type: "text", text: "Processing..." }] }; 
  }
);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.static(PUBLIC_DIR)); 
app.use('/images', express.static(WORKSPACE_DIR)); 

app.post("/chat", async (req, res) => {
  const { message: userPrompt, image: userImage, sessionId } = req.body;
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  if (!SESSIONS.has(sessionId)) SESSIONS.set(sessionId, []);
  let history = SESSIONS.get(sessionId)!;

  if (history.length > 0) {
      const lastMsg = history[history.length - 1];
      if (lastMsg.role === "assistant" && lastMsg.content.some((c:any) => c.type === "tool_use")) {
          const toolUse = lastMsg.content.find((c:any) => c.type === "tool_use");
          console.log("⚠️ Repairing broken conversation history...");
          history.push({
              role: "user",
              content: [{
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content: "Error: Previous generation was interrupted. Please retry."
              }]
          });
      }
  }

  try {
    const contentPayload: any[] = [];
    if (userImage) {
         const matches = userImage.match(/^data:((?:image\/(?:png|jpeg|webp|gif)));base64,(.*)$/);
         if(matches) contentPayload.push({ type: "image", source: { type: "base64", media_type: matches[1] as any, data: matches[2] }});
    }
    if (userPrompt) contentPayload.push({ type: "text", text: userPrompt });

    history.push({ role: "user", content: contentPayload });

    const SYSTEM_PROMPT = `
You are an expert 3D Architect.
You do NOT write raw geometry math. You use the provided **STANDARD LIBRARY**.

### THE STANDARD LIBRARY (Already included):
1. **Tube(height, radius, wall)** - Hollow pipe/cup.
2. **ArcHandle(mug_radius, handle_radius, thickness, z_center)** - Torus handle.
3. **SoftBox(size_vector, corner_radius)** - Rounded case.

### RULES:
- Use 'union()' to combine parts.
- If the user asks to "increase hollow area", reduce the wall thickness or increase the radius in your code.
- Always output the FULL code for the part.
`;

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: history,
      tools: [createToolSchema]
    });

    history.push({ role: "assistant", content: msg.content });
    
    SESSIONS.set(sessionId, history);

    const toolUse = msg.content.find(c => c.type === "tool_use");

    if (toolUse) {
      const { filename, code } = toolUse.input as any;
      
      try {
        const { safeName } = await generateScad(filename, code);
        
        history.push({
            role: "user",
            content: [{
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: `Success. Generated ${safeName}.png`
            }]
        });
        
        res.json({ 
            text: `I've updated the model for "${filename}".`,
            image: `/images/${safeName}.png`, 
            model: `/images/${safeName}.stl`
        });
      } catch (err) {
        history.push({
            role: "user",
            content: [{
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: `Error generating model: ${err}`
            }]
        });
        
        res.status(500).json({ text: "Generation failed, but I saved the error log. Try again?" });
      }
      
      SESSIONS.set(sessionId, history);
      
    } else {
      res.json({ text: msg.content.find(c => c.type === "text")?.text || "Error", image: null });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "API Error: " + (error as Error).message });
  }
});

app.listen(3000, () => console.log("Engine running on port 3000"));