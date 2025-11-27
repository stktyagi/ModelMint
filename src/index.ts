import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generateDashboardHTML } from "./templates/dashboard.js";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  workspace: path.join(__dirname, "..", "workspace"),
  server: {
    port: 3456,
    host: "localhost",
  },
  openscad: {
    colorScheme: "Tomorrow Night",
    imageSize: "1024,768",
    renderFlags: "--viewall --autocenter",
  },
} as const;

// Types
interface DashboardData {
  filename: string;
  scadCode: string;
  hasStl: boolean;
  timestamp: Date;
  versionFolder: string;
}

interface CommandResult {
  success: boolean;
  output?: string;
  error?: string;
}

// Utility Functions
function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${stderr}`);
        return reject(new Error(stderr || error.message));
      }
      resolve(stdout);
    });
  });
}

function generateVersionTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function buildFileUri(absolutePath: string): string {
  return `file:///${absolutePath.replace(/\\/g, "/")}`;
}

// HTTP Server for Dashboards
function startHttpServer(): void {
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = req.url || "/";
      const filePath = path.join(CONFIG.workspace, urlPath);
      
      // Security: Ensure path is within workspace
      const resolvedPath = path.resolve(filePath);
      const workspaceResolved = path.resolve(CONFIG.workspace);
      
      if (!resolvedPath.startsWith(workspaceResolved)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      const stats = await fs.stat(resolvedPath);
      
      if (stats.isDirectory()) {
        const indexPath = path.join(resolvedPath, "index.html");
        const content = await fs.readFile(indexPath, "utf-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      } else {
        const content = await fs.readFile(resolvedPath);
        const ext = path.extname(resolvedPath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "application/javascript",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".scad": "text/plain",
          ".stl": "application/octet-stream",
        };
        
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
        res.end(content);
      }
    } catch (error) {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  server.listen(CONFIG.server.port, CONFIG.server.host, () => {
    console.error(`Dashboard server running at http://${CONFIG.server.host}:${CONFIG.server.port}`);
  });
}

// Core Operations
async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeDashboard(
  versionDir: string,
  data: DashboardData
): Promise<string> {
  const html = generateDashboardHTML(data);
  const dashboardPath = path.join(versionDir, "index.html");
  await fs.writeFile(dashboardPath, html, "utf-8");
  return dashboardPath;
}

async function renderPreview(
  scadPath: string,
  outputPath: string
): Promise<void> {
  const { colorScheme, imageSize, renderFlags } = CONFIG.openscad;
  const command = [
    "openscad",
    `-o "${outputPath}"`,
    renderFlags,
    `--colorscheme="${colorScheme}"`,
    `--imgsize=${imageSize}`,
    `"${scadPath}"`,
  ].join(" ");

  await executeCommand(command);
}

async function exportStl(scadPath: string, stlPath: string): Promise<void> {
  const command = `openscad -o "${stlPath}" "${scadPath}"`;
  await executeCommand(command);
}

async function getVersionFolders(): Promise<string[]> {
  const entries = await fs.readdir(CONFIG.workspace, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("v_"))
    .map((entry) => entry.name)
    .sort()
    .reverse();
}

// MCP Server Setup
const server = new McpServer({
  name: "openscad_designer",
  version: "2.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Tool: Create and Preview Model
server.tool(
  "create_and_preview_model",
  "Generates an OpenSCAD file from code and creates a professional preview with dashboard.",
  {
    filename: z
      .string()
      .describe('Base name without extension (e.g., "gear_assembly")'),
    scad_code: z
      .string()
      .describe("Complete and valid OpenSCAD code"),
  },
  async ({ filename, scad_code }) => {
    try {
      const timestamp = generateVersionTimestamp();
      const versionFolder = `v_${timestamp}`;
      const versionDir = path.join(CONFIG.workspace, versionFolder);
      
      await ensureDirectory(versionDir);

      const scadPath = path.join(versionDir, `${filename}.scad`);
      const previewPath = path.join(versionDir, `${filename}.png`);

      await fs.writeFile(scadPath, scad_code, "utf-8");
      await renderPreview(scadPath, previewPath);

      const dashboardPath = await writeDashboard(versionDir, {
        filename,
        scadCode: scad_code,
        hasStl: false,
        timestamp: new Date(),
        versionFolder,
      });

      const dashboardUrl = `http://${CONFIG.server.host}:${CONFIG.server.port}/${versionFolder}/`;

      const response = [
        `Successfully created ${filename}.scad with preview`,
        ``,
        `Version: ${versionFolder}`,
        `Preview: ${CONFIG.openscad.imageSize}, ${CONFIG.openscad.colorScheme}`,
        `Dashboard: Generated`,
        ``,
        `Open Dashboard: ${dashboardUrl}`,
        ``,
        `Copy and paste the URL above into your browser.`,
      ].join("\n");

      return {
        content: [{ type: "text", text: response }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
      };
    }
  }
);

// Tool: Export to STL
server.tool(
  "export_to_stl",
  "Converts a .scad file to .stl for 3D printing and updates the dashboard.",
  {
    version_folder: z
      .string()
      .describe('Version folder name (e.g., "v_2023-11-28_10-00-00")'),
    filename: z
      .string()
      .describe('Base name of the .scad file (e.g., "gear_assembly")'),
  },
  async ({ version_folder, filename }) => {
    try {
      const versionDir = path.join(CONFIG.workspace, version_folder);
      const scadPath = path.join(versionDir, `${filename}.scad`);
      const stlPath = path.join(versionDir, `${filename}.stl`);

      await exportStl(scadPath, stlPath);

      const scadCode = await fs.readFile(scadPath, "utf-8");
      const dashboardPath = await writeDashboard(versionDir, {
        filename,
        scadCode,
        hasStl: true,
        timestamp: new Date(),
        versionFolder: version_folder,
      });

      const dashboardUrl = `http://${CONFIG.server.host}:${CONFIG.server.port}/${version_folder}/`;

      const response = [
        `Successfully exported ${filename}.stl`,
        ``,
        `Version: ${version_folder}`,
        `Status: Print Ready`,
        `Dashboard: Updated`,
        ``,
        `Open Dashboard: ${dashboardUrl}`,
        ``,
        `Copy and paste the URL above into your browser.`,
      ].join("\n");

      return {
        content: [{ type: "text", text: response }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
      };
    }
  }
);

// Tool: List Versions
server.tool(
  "list_versions",
  "Lists all version folders in the workspace to see design history.",
  {},
  async () => {
    try {
      const versions = await getVersionFolders();

      if (versions.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No versions found. Create your first design to get started.",
            },
          ],
        };
      }

      const versionList = versions
        .map((v, i) => `${i + 1}. ${v}`)
        .join("\n");

      const response = [
        `Design History: ${versions.length} version(s)`,
        ``,
        versionList,
        ``,
        `Use the version folder name with export_to_stl to create STL files.`,
      ].join("\n");

      return {
        content: [{ type: "text", text: response }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
      };
    }
  }
);

// Server Initialization
async function main(): Promise<void> {
  startHttpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OpenSCAD Designer MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});