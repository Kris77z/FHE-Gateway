import fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";

type ExampleMeta = {
  name: string;
  title: string;
  category: string;
  description: string;
};

async function main() {
  const baseDir = path.resolve(__dirname, "..");
  const examplesDir = path.join(baseDir, "examples");
  const output = path.join(baseDir, "EXAMPLES.md");

  if (!existsSync(examplesDir)) {
    throw new Error("examples 目录不存在，请先运行 create-example 生成示例。");
  }

  const entries = await fs.readdir(examplesDir, { withFileTypes: true });
  const metas: ExampleMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const readmePath = path.join(examplesDir, entry.name, "README.md");
    if (!existsSync(readmePath)) continue;
    const meta = parseReadme(readmePath);
    metas.push({ ...meta, name: entry.name });
  }

  if (metas.length === 0) {
    throw new Error("未找到任何示例 README，无法生成目录。");
  }

  const lines = [
    "# FHEVM 示例索引",
    "",
    "| Name | Title | Category | Description |",
    "| --- | --- | --- | --- |",
    ...metas.map(
      (m) => `| ${m.name} | ${m.title} | ${m.category} | ${m.description.replace(/\|/g, "\\|")} |`,
    ),
    "",
    "> 说明：示例均依赖本地 FHEVM Hardhat 节点，参见各 README。"
  ];

  await fs.writeFile(output, lines.join("\n") + "\n", "utf-8");
  console.log(`文档已生成：${output}`);
}

function parseReadme(readmePath: string): Omit<ExampleMeta, "name"> {
  const content = readFileSync(readmePath, "utf-8").split("\n");
  const titleLine = content.find((l) => l.startsWith("#")) ?? "# Example";
  const title = titleLine.replace(/^#\s*/, "").trim();
  const categoryLine = content.find((l) => l.toLowerCase().startsWith("- category"));
  const descLine = content.find((l) => l.toLowerCase().startsWith("- description"));
  return {
    title,
    category: categoryLine ? categoryLine.split(":").slice(1).join(":").trim() : "unknown",
    description: descLine ? descLine.split(":").slice(1).join(":").trim() : "No description",
  };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



