import { spawn } from "node:child_process";
import path from "node:path";

const forwarded = process.argv.slice(2);
const nextArgs = ["dev"];

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index];

  if (argument === "--host") {
    nextArgs.push("--hostname", forwarded[index + 1]);
    index += 1;
    continue;
  }

  if (argument === "--strictPort") continue;
  nextArgs.push(argument);
}

const nextBinary = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBinary, ...nextArgs], { stdio: "inherit" });

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => process.exit(code ?? 0));
