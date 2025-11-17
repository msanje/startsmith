import { Field, NormalizedSchema } from "../types";

export function generateSchemaTs(schema: NormalizedSchema): string {
	const lines: string[] = [];

	lines.push(`import {z} from "zod";`);
	lines.push("");
	const schemaName = `${schema.name}Schema`;
	lines.push(`export const ${schemaName} = z.object({`);

	function fieldToZodExpr(field: Field): string {
		switch (field.type) {
			case "string":
				return `z.string()${field.required ? "" : ".optional()"}`;

			case "number":
				return `z.number()${field.required ? "" : ".optional()"}`;

			case "boolean":
				return `z.number()${field.required ? "" : ".optional()"}`;

			case "array": {
				const item =
					field.itemType === "string"
						? "z.string()"
						: field.itemType === "number"
							? "z.number()"
							: field.itemType === "boolean"
								? "z.boolean()"
								: "z.any()";
				return `z.array(${item})${field.required ? "" : ".optional()"}`;
			}

			case "object": {
				const innerPairs: string[] = [];
				for (const inner of field.fields ?? []) {
					innerPairs.push(`  ${inner.name}: ${fieldToZodExpr(inner)},`);
				}

				const innerBody = innerPairs.length
					? `\n${innerPairs.join("\n")}\n`
					: "";
				return `z.object({${innerBody}})${field.required ? "" : ".optional()"}`;
			}

			default:
				return `z.any()${field.required ? "" : ".optional()"}`;
		}
	}

	for (const f of schema.fields) {
		const expr = fieldToZodExpr(f);
		lines.push(` ${f.name}: ${expr},`);
	}

	lines.push("});");
	lines.push("");
	lines.push(`export type ${schema.name} = z.infer<typeof ${schemaName}>`);

	return lines.join("\n");
}
