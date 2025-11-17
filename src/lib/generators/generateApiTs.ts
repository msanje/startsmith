import { NormalizedSchema } from "../types";

export function generateApiTs(schema: NormalizedSchema): string {
	const name = schema.name;
	const lc = name.charAt(0).toLowerCase() + name.slice(1);
	const lines: string[] = [];

	lines.push(`// Example API helpers for ${name}`);
	lines.push(
		`// These are minimal examples — adapt them to your backend or framework.`,
	);
	lines.push("");
	lines.push(`import type { ${name} } from "./schema";`);
	lines.push("");
	// create function
	lines.push(`export async function create${name}(data: ${name}) {`);
	lines.push(`  const res = await fetch("/api/${lc}", {`);
	lines.push(`    method: "POST",`);
	lines.push(`    headers: { "Content-Type": "application/json" },`);
	lines.push(`    body: JSON.stringify(data),`);
	lines.push(`  });`);
	lines.push("");
	lines.push(`  if (!res.ok) {`);
	lines.push(
		`    throw new Error("Failed to create ${name}: " + res.statusText);`,
	);
	lines.push(`  }`);
	lines.push("");
	lines.push(`  return res.json();`);
	lines.push(`}`);
	lines.push("");
	// fetch single
	lines.push(`export async function fetch${name}(id: string) {`);
	lines.push(`  const res = await fetch(\`/api/${lc}/\${id}\`);`);
	lines.push(`  if (!res.ok) throw new Error("Failed to fetch ${name}");`);
	lines.push(`  return res.json() as Promise<${name}>;`);
	lines.push(`}`);
	lines.push("");
	// fetch list
	lines.push(`export async function list${name}s() {`);
	lines.push(`  const res = await fetch("/api/${lc}");`);
	lines.push(`  if (!res.ok) throw new Error("Failed to list ${name}s");`);
	lines.push(`  return res.json() as Promise<${name}[]>;`);
	lines.push(`}`);
	lines.push("");

	return lines.join("\n");
}
