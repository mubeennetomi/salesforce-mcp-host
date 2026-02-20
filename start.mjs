import { spawn } from "node:child_process";

const port = process.env.PORT || "3000";

const args = [
  "--transport", "http",
  "--port", port,
  "--orgs", "DEFAULT_TARGET_ORG",
  "--toolsets", "orgs,metadata,data"
];

const child = spawn("node", ["./node_modules/@salesforce/mcp/bin/run.js", ...args], {
  stdio: "inherit",
  env: process.env
});

child.on("exit", code => process.exit(code ?? 1));
