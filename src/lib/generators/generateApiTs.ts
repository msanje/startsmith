import { NormalizedSchema } from "../types";

/** tiny pluralizer (heuristic, fine for most simple names) */
function pluralize(name: string) {
	const lower = name.toLowerCase();
	if (lower.endsWith("y") && !"aeiou".includes(lower[lower.length - 2] ?? "")) {
		return lower.slice(0, -1) + "ies"; // party -> parties
	}
	if (
		lower.endsWith("s") ||
		lower.endsWith("x") ||
		lower.endsWith("z") ||
		lower.endsWith("ch") ||
		lower.endsWith("sh")
	) {
		return lower + "es";
	}
	return lower + "s";
}

export function generateApiTs(schema: NormalizedSchema): string {
	const name = schema.name; // e.g. "User"
	const typeImport = name;
	const base = pluralize(name); // e.g. "users"
	const route = `/api/${base}`;

	const lines: string[] = [];

	lines.push(`// Example API helpers for ${name}`);
	lines.push(`// Minimal REST helpers — adapt to your backend / auth style.`);
	lines.push("");
	lines.push(`import type { ${typeImport} } from "./schema";`);
	lines.push("");
	lines.push(`const BASE = "${route}";`);
	lines.push("");
	// create
	lines.push(
		`export async function create${name}(data: ${typeImport}): Promise<${typeImport}> {`,
	);
	lines.push(`  const res = await fetch(BASE, {`);
	lines.push(`    method: "POST",`);
	lines.push(`    headers: { "Content-Type": "application/json" },`);
	lines.push(`    body: JSON.stringify(data),`);
	lines.push(`  });`);
	lines.push(
		`  if (!res.ok) throw new Error("Failed to create ${name}: " + res.statusText);`,
	);
	lines.push(`  return res.json() as Promise<${typeImport}>;`);
	lines.push(`}`);
	lines.push("");
	// fetch single
	lines.push(
		`export async function fetch${name}(id: string): Promise<${typeImport}> {`,
	);
	lines.push(`  const res = await fetch(\`\${BASE}/\${id}\`);`);
	lines.push(
		`  if (!res.ok) throw new Error("Failed to fetch ${name}: " + res.statusText);`,
	);
	lines.push(`  return res.json() as Promise<${typeImport}>;`);
	lines.push(`}`);
	lines.push("");
	// list
	lines.push(
		`export async function list${name}s(query?: Record<string,string>): Promise<${typeImport}[]> {`,
	);
	lines.push(
		`  const q = query ? ("?" + new URLSearchParams(query).toString()) : "";`,
	);
	lines.push(`  const res = await fetch(\`\${BASE}\${q}\`);`);
	lines.push(
		`  if (!res.ok) throw new Error("Failed to list ${name}s: " + res.statusText);`,
	);
	lines.push(`  return res.json() as Promise<${typeImport}[]>;`);
	lines.push(`}`);
	lines.push("");
	// update
	lines.push(
		`export async function update${name}(id: string, data: Partial<${typeImport}>): Promise<${typeImport}> {`,
	);
	lines.push(`  const res = await fetch(\`\${BASE}/\${id}\`, {`);
	lines.push(`    method: "PUT",`);
	lines.push(`    headers: { "Content-Type": "application/json" },`);
	lines.push(`    body: JSON.stringify(data),`);
	lines.push(`  });`);
	lines.push(
		`  if (!res.ok) throw new Error("Failed to update ${name}: " + res.statusText);`,
	);
	lines.push(`  return res.json() as Promise<${typeImport}>;`);
	lines.push(`}`);
	lines.push("");
	// remove
	lines.push(
		`export async function remove${name}(id: string): Promise<void> {`,
	);
	lines.push(
		`  const res = await fetch(\`\${BASE}/\${id}\`, { method: "DELETE" });`,
	);
	lines.push(
		`  if (!res.ok) throw new Error("Failed to remove ${name}: " + res.statusText);`,
	);
	lines.push(`  return;`);
	lines.push(`}`);
	lines.push("");

	return lines.join("\n");
}
