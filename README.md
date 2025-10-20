# ModelMint

This project is a Model Context Protocol (MCP) server that acts as a bridge between the **Claude Desktop** application and the **OpenSCAD** 3D modeling software. It allows you to design, refine, and export 3D-printable models using simple, natural language conversations.

Instead of writing code, you just describe the object you want to build, and this server handles the file creation, previews, and final export for you.



---
## Features
* **Conversational 3D Modeling:** Design complex objects through an iterative, step-by-step conversation.
* **Live Previews:** Generates a `.png` preview image of your model every time you make a change.
* **Code Generation:** Automatically writes and saves the `.scad` source files for your models.
* **STL Export:** Converts your final design into a `.stl` file, ready for any 3D printer slicer software.

---
## Prerequisites
Before you begin, ensure you have the following software installed on your Windows machine:

1.  **Claude Desktop:** The application used to interact with the server.
2.  **Node.js:** The runtime environment for the server. The LTS (Long-Term Support) version is recommended.
3.  **OpenSCAD:** The 3D modeling software. **Crucially, its installation folder must be added to your system's PATH variable.**

---
## Setup and Installation
Follow these steps to get the server running.

1.  **Install Dependencies:**
    Open a terminal in the project directory and run:
    ```bash
    npm install
    ```

2.  **Compile the Code:**
    This project uses TypeScript. You must compile the source code into JavaScript by running:
    ```bash
    npm run build
    ```
    This command creates a `build` folder containing the `index.js` file that Claude will run.

3.  **Configure Claude Desktop:**
    You need to tell Claude how to find and run your server.
    * Navigate to `%APPDATA%\Claude\` in your File Explorer.
    * Create or edit the file `claude_desktop_config.json`.
    * Add the following configuration, ensuring the `args` path is the **absolute path** to your compiled `index.js` file.

    ```json
    {
      "mcpServers": {
        "openscad_designer": {
          "command": "node",
          "args": [
            "path_to_built_index.js"
          ]
        }
      }
    }
    ```

4.  **Restart Claude:**
    For the changes to take effect, you must **completely quit and restart** the Claude Desktop app. Right-click its icon in the system tray (bottom-right of your screen) and select "Quit."

---
## How to Use
Once set up, a "tools" icon will appear in your Claude chat input bar.

1.  **Start a new conversation.**
2.  **Begin designing with a simple prompt:**
    > "Let's create a 3D model. Make a simple box that is 50mm wide, 30mm deep, and 20mm tall. Name it `my_box`."
3.  **Check your `workspace` folder:** You will see `my_box.scad` and `my_box.png` appear.
4.  **Continue refining the design:**
    > "Now, cut a circular hole through the center of the box."
5.  **Export the final model:**
    > "This looks great. Export `my_box` to STL."
    You will now find `my_box.stl` in the `workspace` folder, ready for printing.

---
## Troubleshooting

Claude runs on the last cache created even if you close the window so you don't get latest changes right away. To avoid this make sure to close claude destop via task manager.
