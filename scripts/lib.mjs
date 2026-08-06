/** 检查脚本共用工具(零依赖) */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function walk(dir, ext, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, ext, files);
    else if (!ext || p.endsWith(ext)) files.push(p);
  }
  return files;
}

export function read(p) {
  return readFileSync(p, 'utf8');
}

/** dist 内 HTML 文件路径 → 站内 URL 路径 */
export function htmlToUrl(distRoot, file) {
  let rel = file.slice(distRoot.length).replaceAll('\\', '/');
  if (rel.endsWith('/index.html')) rel = rel.slice(0, -'index.html'.length);
  return rel;
}

export class Reporter {
  constructor(name) {
    this.name = name;
    this.errors = [];
    this.warnings = [];
  }
  error(msg) {
    this.errors.push(msg);
  }
  warn(msg) {
    this.warnings.push(msg);
  }
  finish() {
    for (const w of this.warnings) console.log(`  [warn] ${w}`);
    for (const e of this.errors) console.log(`  [FAIL] ${e}`);
    console.log(
      `\n${this.name}: ${this.errors.length} 个错误, ${this.warnings.length} 个警告`
    );
    if (this.errors.length > 0) process.exit(1);
    console.log(`${this.name} 通过 ✓`);
  }
}
