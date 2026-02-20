import { spawn } from "node:child_process";

const port = process.env.PORT || "3000";

// Try common CLI entrypoints for the package.
// This avoids relying on a global binary name like `salesforce-mcp`.
const candidates = [
  ["node", ["./node_modules/@salesforce/mcp/bin/run.js"]],
  ["node", ["./node_modules/@salesforce/mcp/dist/cli.js"]],
  ["node", ["./node_modules/@salesforce/mcp/cli.js"]],
  // Fallback (slower, but works if the package structure changes)
  ["npx", ["-y", "@salesforce/mcp@latest"]]
];

const baseArgs = [
  "--transport", "http",
  "--port", port,
  "--orgs", "DEFAULT_TARGET_ORG",
  "--toolsets", "orgs,metadata,data"
];

function trySpawn(i) {
  if (i >= candidates.length) {
    console.error("Could not find an executable entrypoint for @salesforce/mcp.");
    process.exit(1);
  }

  const [cmd, cmdArgs] = candidates[i];
  const child = spawn(cmd, [...cmdArgs, ...baseArgs], {
    stdio: "inherit",
    env: process.env
  });

  child.on("error", () => trySpawn(i + 1));
  child.on("exit", (code) => {
    // If it exited immediately with "module not found" style issues, try next candidate
    if (code === 0) process.exit(0);
    trySpawn(i + 1);
  });
}

trySpawn(0);
