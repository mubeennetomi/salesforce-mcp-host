import { spawn } from "child_process";

const port = process.env.PORT || "3000";

const child = spawn(
  "npx",
  [
    "-y",
    "@salesforce/mcp@latest",
    "--transport",
    "http",
    "--port",
    port,
    "--orgs",
    "DEFAULT_TARGET_ORG",
    "--toolsets",
    "orgs,metadata,data"
  ],
  { stdio: "inherit" }
);

child.on("exit", code => {
  console.log("MCP exited:", code);
});
