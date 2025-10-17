import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_DIR = path.join(__dirname, "..", "workspace");

function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command Error: ${stderr}`); // log to stderr
        return reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
}

const server = new McpServer({
  name: "openscad_designer",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "create_and_preview_model",
  "Generates an OpenSCAD file from code and creates a preview image.",
  {
    filename: z.string().describe('The base name of the file without extension (e.g., "my_model").'),
    scad_code: z.string().describe("The complete and valid OpenSCAD code to be saved."),
  },
  async ({ filename, scad_code }) => {
    try {
      await fs.mkdir(WORKSPACE_DIR, { recursive: true });
      const scadFilePath = path.join(WORKSPACE_DIR, `${filename}.scad`);
      const pngPreviewPath = path.join(WORKSPACE_DIR, `${filename}.png`);

      await fs.writeFile(scadFilePath, scad_code);
      const command = `openscad -o "${pngPreviewPath}" --viewall --autocenter --imgsize=800,600 "${scadFilePath}"`;
      await runCommand(command);

      const successMessage = `Successfully created ${filename}.scad and generated a preview.`;
      return { content: [{ type: "text", text: successMessage }] };
    } catch (error) {
      const errorMessage = `Error: ${(error as Error).message}`;
      return { content: [{ type: "text", text: errorMessage }] };
    }
  }
);

server.tool(
  "export_to_stl",
  "Converts a .scad file to a .stl file for 3D printing.",
  {
    filename: z.string().describe('The base name of the .scad file to convert (e.g., "my_model").'),
  },
  async ({ filename }) => {
    try {
      const scadFilePath = path.join(WORKSPACE_DIR, `${filename}.scad`);
      const stlFilePath = path.join(WORKSPACE_DIR, `${filename}.stl`);

      const command = `openscad -o "${stlFilePath}" "${scadFilePath}"`;
      await runCommand(command);

      const successMessage = `Success! Exported ${filename}.stl to the workspace. It is ready for printing.`;
      return { content: [{ type: "text", text: successMessage }] };
    } catch (error) {
      const errorMessage = `Error: ${(error as Error).message}`;
      return { content: [{ type: "text", text: errorMessage }] };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OpenSCAD Designer MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});