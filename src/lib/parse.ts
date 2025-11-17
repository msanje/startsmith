import { Field, NormalizedSchema } from "./types";

// finds the first interface or type block in a TypeScript string, extracts its name and braces, and returns its fields as a normalized schema.
export function parseFirstInterface(input: string): NormalizedSchema {
	const match = input.match(/(interface|type)\s+([A-Za-z0-9_]+)\s*(?:=)?\s*{/);

	if (!match) {
		throw new Error("No interface or type block found.");
	}

	const name = match[2];
	const start = input.indexOf("{", match.index!);
	if (start === -1) {
		throw new Error("Malformed type block: missing '{'.");
	}
	let depth = 0;
	let end = -1;

	for (let i = start; i < input.length; i++) {
		const ch = input[i];
		if (ch === "{") depth++;
		else if (ch === "}") {
			depth--;
			if (depth === 0) {
				end = i;
				break;
			}
		}
	}

	if (end === -1) {
		throw new Error("Malformed type block: unbalanced braces.");
	}

	const body = input.slice(start + 1, end).trim();
	const fields = parseFieldsFromBlock(body);

	return { name, fields, raw: body };
}

// walks through the contents of a type/interface body and converts each property into a structured field description, including nested objects and arrays.
export function parseFieldsFromBlock(block: string): Field[] {
	const fields: Field[] = [];
	let i = 0;

	while (i < block.length) {
		while (i < block.length && /\s/.test(block[i])) i++;
		if (i >= block.length) break;

		const nameMatch = block.slice(i).match(/^([A-Za-z0-9_]+)\s*(\?)?\s*:/);
		if (!nameMatch) {
			const next = block.indexOf("\n", i);
			if (next === -1) break;
			i = next + 1;
			continue;
		}

		const name = nameMatch[1];
		const optional = !!nameMatch[2];

		const colonIndex = block.indexOf(":", i);
		i = colonIndex + 1;

		while (i < block.length && /\s/.test(block[i])) i++;

		if (block[i] === "{") {
			let depth = 0;
			let j = i;

			for (; j < block.length; j++) {
				if (block[j] === "{") depth++;
				else if (block[j] === "}") {
					depth--;
					if (depth === 0) break;
				}
			}

			const inner = block.slice(i + 1, j);
			const nestedFields = parseFieldsFromBlock(inner);

			fields.push({
				name,
				required: !optional,
				type: "object",
				fields: nestedFields,
			});

			i = j + 1;
			continue;
		}

		// Otherwise read until ; or newline
		let j = i;
		let token = "";
		while (j < block.length && block[j] !== ";" && block[j] !== "\n") {
			token += block[j];
			j++;
		}
		i = j + 1;

		token = token.trim();

		// Match primitives and arrays
		if (token === "string") {
			fields.push({ name, type: "string", required: !optional });
		} else if (token === "number") {
			fields.push({ name, type: "number", required: !optional });
		} else if (token === "boolean") {
			fields.push({ name, type: "boolean", required: !optional });
		} else if (token === "string[]") {
			fields.push({
				name,
				type: "array",
				itemType: "string",
				required: !optional,
			});
		} else if (token === "number[]") {
			fields.push({
				name,
				type: "array",
				itemType: "number",
				required: !optional,
			});
		} else if (token === "boolean[]") {
			fields.push({
				name,
				type: "array",
				itemType: "boolean",
				required: !optional,
			});
		} else {
			fields.push({ name, type: "unknown", required: !optional });
		}
	}

	return fields;
}
