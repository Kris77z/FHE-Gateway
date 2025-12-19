import fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";

type Args = {
  name: string;
  title: string;
  category: string;
  description: string;
  force: boolean;
};

const DEFAULTS = {
  title: "FHE Example",
  category: "basic",
  description: "FHEVM example generated from base-template.",
};

async function main() {
  const args = parseArgs();
  const baseDir = path.resolve(__dirname, "..");
  const baseTemplateDir = path.join(baseDir, "base-template");
  const examplesDir = path.join(baseDir, "examples");
  const targetDir = path.join(examplesDir, args.name);

  if (!existsSync(baseTemplateDir)) {
    throw new Error(`base-template 不存在：${baseTemplateDir}`);
  }

  if (existsSync(targetDir)) {
    if (!args.force) {
      throw new Error(`目标目录已存在：${targetDir}，如需覆盖请加 --force`);
    }
    await fs.rm(targetDir, { recursive: true, force: true });
  }

  await fs.mkdir(examplesDir, { recursive: true });
  await fs.cp(baseTemplateDir, targetDir, { recursive: true });

  await updatePackageJson(targetDir, args);
  await writeReadme(targetDir, args);

  // 目录瘦身：去掉可能的 artifacts/cache
  await fs.rm(path.join(targetDir, "artifacts"), { recursive: true, force: true });
  await fs.rm(path.join(targetDir, "cache"), { recursive: true, force: true });

  console.log(`示例已生成：${targetDir}`);
  console.log(`下一步：\n  cd ${path.relative(process.cwd(), targetDir)} && npm install`);
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const parsed: Partial<Args> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.replace(/^--/, "");
      const value = argv[i + 1];
      if (key === "force") {
        parsed.force = true;
      } else {
        (parsed as any)[key] = value;
        i++;
      }
    }
  }

  if (!parsed.name) {
    throw new Error("必须提供 --name");
  }

  return {
    name: parsed.name,
    title: parsed.title ?? DEFAULTS.title,
    category: parsed.category ?? DEFAULTS.category,
    description: parsed.description ?? DEFAULTS.description,
    force: parsed.force ?? false,
  };
}

async function updatePackageJson(targetDir: string, args: Args) {
  const pkgPath = path.join(targetDir, "package.json");
  const raw = readFileSync(pkgPath, "utf-8");
  const json = JSON.parse(raw);
  json.name = `fhevm-example-${args.name}`;
  json.description = args.description;
  await fs.writeFile(pkgPath, JSON.stringify(json, null, 2) + "\n", "utf-8");
}

async function writeReadme(targetDir: string, args: Args) {
  const lines = [
    `# ${args.title} (${args.name})`,
    "",
    `- category: ${args.category}`,
    `- description: ${args.description}`,
    "",
    "## 运行步骤",
    "```bash",
    "npm install",
    "npx hardhat node",
    "npx hardhat deploy --network localhost",
    "```",
    "",
    "## 说明",
    "- 本示例基于本地 FHEVM Hardhat 节点，无公共测试网。",
    "- 使用默认助记词生成的本地账户完成部署与调用。",
  ];
  await fs.writeFile(path.join(targetDir, "README.md"), lines.join("\n") + "\n", "utf-8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



