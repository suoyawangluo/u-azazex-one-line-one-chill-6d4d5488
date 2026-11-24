// One Line, One Chill — make.fun entry
// Writes a single sentence of horror (1-200 chars) to /output/entry.txt.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Gate: the sealed scorer requires /output/entry.txt to be UTF-8 text of
// 1 to 200 characters, not only white space. Enforce it here before writing.
function checkGate(text: string): void {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 200) {
    throw new Error(`gate: entry is ${codePoints} code points, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only white space");
  }
  if (text.includes("\n")) {
    throw new Error("gate: entry must be a single line");
  }
}

const LINE =
  "The smart lock logged my fingerprint opening the front door at 2 a.m., and I was asleep in the next room.";

checkGate(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, LINE + "\n", "utf8");

// Read back and verify: the file on disk must be exactly the gated line.
const written = readFileSync(outPath, "utf8").replace(/\n$/, "");
if (written !== LINE) {
  throw new Error("read-back mismatch: entry.txt does not match the gated line");
}
checkGate(written);
const codePoints = [...written].length;
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(
  `wrote ${outPath} (${codePoints} code points, sha256 ${sha256}), verified: ${JSON.stringify(written)}`,
);
