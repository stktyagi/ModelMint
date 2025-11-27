// interface DashboardData {
//   filename: string;
//   scadCode: string;
//   hasStl: boolean;
//   timestamp: Date;
//   versionFolder: string;
// }

// function escapeHtml(text: string): string {
//   return text
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

// function formatTimestamp(date: Date): string {
//   return date.toLocaleString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });
// }

// export function generateDashboardHTML(data: DashboardData): string {
//   const { filename, scadCode, hasStl, timestamp, versionFolder } = data;
//   const escapedCode = escapeHtml(scadCode);
//   const formattedDate = formatTimestamp(timestamp);
//   const fileCount = hasStl ? 3 : 2;
//   const status = hasStl ? "Print Ready" : "Design Phase";

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${filename} - OpenSCAD Design Dashboard</title>
//   <style>
//     ${getStyles()}
//   </style>
// </head>
// <body>
//   <div class="container">
//     <header class="header">
//       <h1 class="header__title">${filename}</h1>
//       <p class="header__subtitle">Generated ${formattedDate}</p>
//     </header>

//     <div class="grid">
//       <div class="card">
//         <h2 class="card__title">Preview</h2>
//         <div class="preview">
//           <img src="${filename}.png" alt="${filename} preview" class="preview__image" />
//         </div>
//         <div class="stat">
//           <div class="stat__label">Resolution</div>
//           <div class="stat__value">1024×768</div>
//         </div>
//       </div>

//       <div class="card card--split">
//         <div class="split-section">
//           <h2 class="card__title">Files</h2>
//           <div class="actions">
//             <a href="${filename}.scad" download class="btn btn--primary">Download .scad</a>
//             <a href="${filename}.png" download class="btn btn--secondary">Download .png</a>
//             ${hasStl ? `<a href="${filename}.stl" download class="btn btn--primary">Download .stl <span class="badge">Ready</span></a>` : ""}
//           </div>
//           <div class="stats">
//             <div class="stat">
//               <div class="stat__label">Available</div>
//               <div class="stat__value">${fileCount} files</div>
//             </div>
//             <div class="stat">
//               <div class="stat__label">Status</div>
//               <div class="stat__value">${status}</div>
//             </div>
//           </div>
//         </div>

//         <div class="split-section split-section--bottom">
//           <h2 class="card__title">Source</h2>
//           <div class="code">
//             <pre class="code__content">${escapedCode}</pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </body>
// </html>`;
// }

// function getStyles(): string {
//   return `
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }

//     body {
//       font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
//       background: #000000;
//       color: #ffffff;
//       padding: 0;
//       height: 100vh;
//       line-height: 1.4;
//       letter-spacing: -0.01em;
//       overflow: hidden;
//     }

//     .container {
//       max-width: 1280px;
//       margin: 0 auto;
//       padding: 2rem 1.5rem;
//       height: 100vh;
//       display: flex;
//       flex-direction: column;
//     }

//     .header {
//       margin-bottom: 1.5rem;
//       padding-bottom: 1rem;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//       flex-shrink: 0;
//     }

//     .header__title {
//       font-size: 2rem;
//       font-weight: 600;
//       color: #ffffff;
//       margin-bottom: 0.25rem;
//       letter-spacing: -0.02em;
//     }

//     .header__subtitle {
//       font-size: 0.875rem;
//       color: #86868b;
//       font-weight: 400;
//     }

//     .grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//       flex: 1;
//       min-height: 0;
//     }

//     @media (max-width: 1024px) {
//       .grid {
//         grid-template-columns: 1fr;
//       }
      
//       .header__title {
//         font-size: 1.75rem;
//       }
//     }

//     .card {
//       background: #1d1d1f;
//       border-radius: 12px;
//       padding: 1.5rem;
//       border: 1px solid rgba(255, 255, 255, 0.06);
//       display: flex;
//       flex-direction: column;
//       min-height: 0;
//     }

//     .card--split {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     .split-section {
//       flex: 1;
//       min-height: 0;
//       display: flex;
//       flex-direction: column;
//     }

//     .split-section--bottom {
//       border-top: 1px solid rgba(255, 255, 255, 0.06);
//       padding-top: 1rem;
//     }

//     .card__title {
//       font-size: 1rem;
//       font-weight: 600;
//       margin-bottom: 1rem;
//       color: #ffffff;
//       letter-spacing: -0.01em;
//       flex-shrink: 0;
//     }

//     .preview {
//       background: #000000;
//       border-radius: 8px;
//       padding: 1rem;
//       text-align: center;
//       margin-bottom: 1rem;
//       border: 1px solid rgba(255, 255, 255, 0.06);
//       flex-shrink: 0;
//     }

//     .preview__image {
//       max-width: 100%;
//       height: auto;
//       border-radius: 4px;
//     }

//     .code {
//       background: #000000;
//       border-radius: 8px;
//       padding: 1.25rem;
//       overflow-x: auto;
//       overflow-y: auto;
//       border: 1px solid rgba(255, 255, 255, 0.06);
//       flex: 1;
//       min-height: 0;
//     }

//     .code__content {
//       margin: 0;
//       font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
//       font-size: 0.8125rem;
//       line-height: 1.6;
//       color: #f5f5f7;
//     }

//     .actions {
//       display: flex;
//       gap: 0.625rem;
//       flex-wrap: wrap;
//       margin-bottom: 1rem;
//       flex-shrink: 0;
//     }

//     .btn {
//       padding: 0.5rem 1rem;
//       border: none;
//       border-radius: 980px;
//       font-size: 0.8125rem;
//       font-weight: 400;
//       cursor: pointer;
//       transition: all 0.15s ease;
//       text-decoration: none;
//       display: inline-flex;
//       align-items: center;
//       gap: 0.375rem;
//       letter-spacing: -0.005em;
//     }

//     .btn--primary {
//       background: #ffffff;
//       color: #000000;
//     }

//     .btn--primary:hover {
//       background: #f5f5f7;
//     }

//     .btn--secondary {
//       background: transparent;
//       color: #ffffff;
//       border: 1px solid rgba(255, 255, 255, 0.2);
//     }

//     .btn--secondary:hover {
//       border-color: rgba(255, 255, 255, 0.35);
//     }

//     .stats {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 0.75rem;
//       flex-shrink: 0;
//     }

//     .stat {
//       background: #000000;
//       padding: 0.875rem;
//       border-radius: 8px;
//       border: 1px solid rgba(255, 255, 255, 0.06);
//     }

//     .stat__label {
//       color: #86868b;
//       font-size: 0.75rem;
//       margin-bottom: 0.25rem;
//       font-weight: 400;
//     }

//     .stat__value {
//       color: #f5f5f7;
//       font-size: 0.9375rem;
//       font-weight: 600;
//       letter-spacing: -0.01em;
//     }

//     .badge {
//       display: inline-block;
//       padding: 0.25rem 0.625rem;
//       background: rgba(255, 255, 255, 0.1);
//       color: #ffffff;
//       border-radius: 980px;
//       font-size: 0.6875rem;
//       font-weight: 500;
//       margin-left: 0.375rem;
//       letter-spacing: 0.01em;
//       text-transform: uppercase;
//     }

//     ::-webkit-scrollbar {
//       width: 8px;
//       height: 8px;
//     }

//     ::-webkit-scrollbar-track {
//       background: transparent;
//     }

//     ::-webkit-scrollbar-thumb {
//       background: rgba(255, 255, 255, 0.2);
//       border-radius: 4px;
//     }

//     ::-webkit-scrollbar-thumb:hover {
//       background: rgba(255, 255, 255, 0.3);
//     }
//   `;
// }

interface DashboardData {
  filename: string;
  scadCode: string;
  hasStl: boolean;
  timestamp: Date;
  versionFolder: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function generateDashboardHTML(data: DashboardData): string {
  const { filename, scadCode, hasStl, timestamp, versionFolder } = data;
  const escapedCode = escapeHtml(scadCode);
  const formattedDate = formatTimestamp(timestamp);
  const fileCount = hasStl ? 3 : 2;
  const status = hasStl ? "Print Ready" : "Design Phase";

  const folderLink = `<a href="${versionFolder}" class="link">${versionFolder}</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename} - OpenSCAD Dashboard</title>
  <style>
    ${getStyles()}
  </style>
</head>
<body>
  <div class="container">

    <!-- HEADER -->
    <header class="header">
      <div>
        <h1 class="header__title">
          <a href="${filename}.scad" class="link">${filename}</a>
        </h1>
        <p class="header__subtitle">Generated ${formattedDate}</p>
        <p class="header__subtitle">Folder: ${folderLink}</p>
      </div>

      <div class="resolution-box">
        <span class="res-label">Resolution</span>
        <span class="res-value">1024×768</span>
      </div>
    </header>

    <!-- GRID -->
    <div class="grid">

      <!-- LEFT COLUMN PREVIEW -->
      <div class="card preview-card">
        <h2 class="card__title">Preview</h2>
        <div class="preview">
          <img src="${filename}.png" class="preview__image">
        </div>
      </div>

      <!-- RIGHT COLUMN (SPLIT 50/50) -->
      <div class="right-col">

        <!-- FILES TOP HALF -->
        <div class="card split-card">
          <h2 class="card__title">Files</h2>

          <div class="actions">
            <a href="${filename}.scad" download class="btn btn--primary link">Download .scad</a>
            <a href="${filename}.png" download class="btn btn--secondary link">Download .png</a>
            ${hasStl ? `<a href="${filename}.stl" download class="btn btn--primary link">Download .stl</a>` : ""}
          </div>

          <div class="info-row">
            <div><strong>Available:</strong> ${fileCount} files</div>
            <div><strong>Status:</strong> ${status}</div>
          </div>
        </div>

        <!-- SOURCE BOTTOM HALF -->
        <div class="card split-card">
          <h2 class="card__title">Source</h2>
          <div class="code">
            <pre class="code__content">${escapedCode}</pre>
          </div>
        </div>

      </div>
    </div>
  </div>
</body>
</html>`;
}

function getStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
      height: 100vh;
      overflow: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .header__title { font-size: 2rem; font-weight: 600; }
    .header__subtitle { font-size: 0.9rem; color: #8a8a8a; }

    /* Resolution top-right */
    .resolution-box {
      text-align: right;
    }
    .res-label {
      display: block;
      color: #777;
      font-size: 0.8rem;
    }
    .res-value {
      display: block;
      font-size: 1rem;
      font-weight: 600;
    }

    /* Clickable links */
    .link {
      color: #4da3ff;
      text-decoration: none;
      transition: 0.15s ease;
    }
    .link:hover { color: #82c4ff; text-decoration: underline; }

    /* GRID */
    .grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 1rem;
      min-height: 0;
    }

    .right-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* CARDS */
    .card {
      background: #1d1d1f;
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid rgba(255,255,255,0.1);
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .preview-card {
      display: flex;
      flex-direction: column;
    }

    .preview {
      background: #000;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
      border: 1px solid rgba(255,255,255,0.06);
      flex: 1;
    }

    .preview__image {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }

    /* Right side top/bottom split */
    .split-card {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .info-row {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .btn {
      padding: 0.45rem 1rem;
      border-radius: 999px;
      font-size: 0.8rem;
      text-decoration: none;
      cursor: pointer;
    }

    .btn--primary { background: #fff; color: #000; }
    .btn--secondary {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .code {
      background: #000;
      border-radius: 8px;
      padding: 1rem;
      overflow: auto;
      border: 1px solid rgba(255,255,255,0.06);
      flex: 1;
    }

    .code__content {
      font-family: SF Mono, Consolas, monospace;
      font-size: 0.82rem;
      color: #f5f5f7;
      white-space: pre;
    }
  `;
}
