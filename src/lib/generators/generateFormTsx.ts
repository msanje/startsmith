import { Field, NormalizedSchema } from "../types";

export function generateFormTsx(schema: NormalizedSchema): string {
	const name = schema.name;
	const componentName = `${name}Form`;
	const lines: string[] = [];

	// Header / imports
	lines.push(`import React from "react";`);
	lines.push(`import { useForm, useFieldArray } from "react-hook-form";`);
	lines.push(`import { zodResolver } from "@hookform/resolvers/zod";`);
	lines.push(`import { ${name}Schema, ${name} } from "./schema";`);
	lines.push("");
	lines.push(
		`export function ${componentName}({ onSubmit }: { onSubmit: (data: ${name}) => void }) {`,
	);
	lines.push(
		`  const { register, control, handleSubmit, formState: { errors } } = useForm<${name}>({`,
	);
	lines.push(`    resolver: zodResolver(${name}Schema),`);
	lines.push(`    defaultValues: {},`);
	lines.push(`  });`);
	lines.push("");

	// Helper: function to safely access nested errors in generated code
	lines.push(`  function getError(path: string) {`);
	lines.push(`    const parts = path.split(".");`);
	lines.push(`    let cur: any = errors as any;`);
	lines.push(`    for (const p of parts) {`);
	lines.push(`      if (!cur) return undefined;`);
	lines.push(`      cur = cur[p];`);
	lines.push(`    }`);
	lines.push(`    return cur;`);
	lines.push(`  }`);
	lines.push("");

	// Start JSX return
	lines.push(`  return (`);
	lines.push(`    <form onSubmit={handleSubmit(onSubmit)}>`);
	lines.push(`      <h2 style={{ marginBottom: 12 }}>${name} Form</h2>`);
	lines.push("");

	// Render each top-level field (expanded at generation-time)
	for (const f of schema.fields) {
		pushFieldLines(lines, f, []);
	}

	lines.push("");
	lines.push(`      <button type="submit">Submit</button>`);
	lines.push(`    </form>`);
	lines.push(`  );`);
	lines.push(`}`);
	lines.push("");

	// Emit helper components for arrays (primitive arrays + object arrays)
	// We'll detect which helpers are needed by scanning fields
	const neededPrimitiveArrayHelpers = new Set<string>();
	const neededObjectArrayHelpers = new Set<string>();
	collectArrayHelpers(
		schema.fields,
		[],
		neededPrimitiveArrayHelpers,
		neededObjectArrayHelpers,
	);

	// Primitive array helper (single generic used for any primitive itemType)
	if (neededPrimitiveArrayHelpers.size > 0) {
		lines.push(
			`function PrimitiveArrayField({ name, itemType, control, register }: any) {`,
		);
		lines.push(`  const fa = useFieldArray({ control, name });`);
		lines.push(`  return (`);
		lines.push(`    <div style={{ marginBottom: 12 }}>`);
		lines.push(`      {fa.fields.map((f: any, idx: number) => (`);
		lines.push(
			`        <div key={f.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>`,
		);
		lines.push(`          {itemType === "number" ? (`);
		lines.push(
			`            <input type="number" {...register(\`\${name}.\${idx}\`, { valueAsNumber: true })} />`,
		);
		lines.push(`          ) : itemType === "boolean" ? (`);
		lines.push(
			`            <input type="checkbox" {...register(\`\${name}.\${idx}\`)} />`,
		);
		lines.push(`          ) : (`);
		lines.push(`            <input {...register(\`\${name}.\${idx}\`)} />`);
		lines.push(`          )}`);
		lines.push(
			`          <button type="button" onClick={() => fa.remove(idx)}>Remove</button>`,
		);
		lines.push(`        </div>`);
		lines.push(`      ))}`);
		lines.push(
			`      <button type="button" onClick={() => fa.append(itemType === "number" ? 0 : (itemType === "boolean" ? false : ""))}>Add</button>`,
		);
		lines.push(`    </div>`);
		lines.push(`  );`);
		lines.push(`}`);
		lines.push("");
	}

	// Object array helper (generic: emits inputs for each property of the object items)
	if (neededObjectArrayHelpers.size > 0) {
		lines.push(
			`function ObjectArrayField({ name, fields, control, register }: any) {`,
		);
		lines.push(`  const fa = useFieldArray({ control, name });`);
		lines.push(`  return (`);
		lines.push(`    <div style={{ marginBottom: 12 }}>`);
		lines.push(`      {fa.fields.map((f: any, idx: number) => (`);
		lines.push(
			`        <fieldset key={f.id} style={{ padding: 8, marginBottom: 8, border: "1px solid #eee" }}>`,
		);
		lines.push(`          {fields.map((sub: any) => {`);
		lines.push(`            const path = \`\${name}.\${idx}.\${sub.name}\`;`);
		lines.push(
			`            if (sub.type === "string") return (<div key={path}><label>{sub.name}</label><input {...register(path)} /></div>);`,
		);
		lines.push(
			`            if (sub.type === "number") return (<div key={path}><label>{sub.name}</label><input type="number" {...register(path, { valueAsNumber: true })} /></div>);`,
		);
		lines.push(
			`            if (sub.type === "boolean") return (<div key={path}><label><input type="checkbox" {...register(path)} /> {sub.name}</label></div>);`,
		);
		lines.push(
			`            return (<div key={path}><label>{sub.name}</label><input {...register(path)} /></div>);`,
		);
		lines.push(`          })}`);
		lines.push(
			`          <button type="button" onClick={() => fa.remove(idx)}>Remove</button>`,
		);
		lines.push(`        </fieldset>`);
		lines.push(`      ))}`);
		lines.push(
			`      <button type="button" onClick={() => fa.append({})}>Add</button>`,
		);
		lines.push(`    </div>`);
		lines.push(`  );`);
		lines.push(`}`);
		lines.push("");
	}

	return lines.join("\n");
}

/* ---------- helpers used by the generator (not emitted to runtime) ---------- */

function pushFieldLines(lines: string[], field: Field, path: string[]) {
	const fullPath = path.length ? `${path.join(".")}.${field.name}` : field.name;
	const key = fullPath.replace(/\./g, "_");

	switch (field.type) {
		case "string":
			lines.push(`      {/* ${fullPath} (string) */}`);
			lines.push(`      <div style={{ marginBottom: 12 }} key="${key}">`);
			lines.push(
				`        <label style={{ display: "block", marginBottom: 4 }}>${field.name}</label>`,
			);
			lines.push(`        <input {...register("${fullPath}")} />`);
			lines.push(
				`        {getError("${fullPath}") && <p style={{ color: "red" }}>{getError("${fullPath}").message}</p>}`,
			);
			lines.push(`      </div>`);
			break;

		case "number":
			lines.push(`      {/* ${fullPath} (number) */}`);
			lines.push(`      <div style={{ marginBottom: 12 }} key="${key}">`);
			lines.push(
				`        <label style={{ display: "block", marginBottom: 4 }}>${field.name}</label>`,
			);
			lines.push(
				`        <input type="number" {...register("${fullPath}", { valueAsNumber: true })} />`,
			);
			lines.push(
				`        {getError("${fullPath}") && <p style={{ color: "red" }}>{getError("${fullPath}").message}</p>}`,
			);
			lines.push(`      </div>`);
			break;

		case "boolean":
			lines.push(`      {/* ${fullPath} (boolean) */}`);
			lines.push(`      <div style={{ marginBottom: 12 }} key="${key}">`);
			lines.push(
				`        <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>`,
			);
			lines.push(
				`          <input type="checkbox" {...register("${fullPath}")} />`,
			);
			lines.push(`          <span>${field.name}</span>`);
			lines.push(`        </label>`);
			lines.push(
				`        {getError("${fullPath}") && <p style={{ color: "red" }}>{getError("${fullPath}").message}</p>}`,
			);
			lines.push(`      </div>`);
			break;

		case "array": {
			// primitive array
			if (
				field.itemType &&
				(field.itemType === "string" ||
					field.itemType === "number" ||
					field.itemType === "boolean")
			) {
				lines.push(`      {/* ${fullPath} (array of ${field.itemType}) */}`);
				lines.push(`      <div style={{ marginBottom: 12 }} key="${key}">`);
				lines.push(
					`        <label style={{ display: "block", marginBottom: 4 }}>${field.name}</label>`,
				);
				lines.push(
					`        <PrimitiveArrayField name="${fullPath}" itemType="${field.itemType}" control={control} register={register} />`,
				);
				lines.push(`      </div>`);
			} else if (field.fields && field.fields.length > 0) {
				// array of objects
				lines.push(`      {/* ${fullPath} (array of objects) */}`);
				lines.push(`      <div style={{ marginBottom: 12 }} key="${key}">`);
				lines.push(
					`        <label style={{ display: "block", marginBottom: 4 }}>${field.name}</label>`,
				);
				lines.push(
					`        <ObjectArrayField name="${fullPath}" fields={${JSON.stringify(field.fields)}} control={control} register={register} />`,
				);
				lines.push(`      </div>`);
			} else {
				// unknown array: fallback to primitive string array
				lines.push(
					`      {/* ${fullPath} (array unknown -> treated as string[]) */}`,
				);
				lines.push(`      <div style={{ marginBottom: 12 }} key="${key}">`);
				lines.push(
					`        <label style={{ display: "block", marginBottom: 4 }}>${field.name}</label>`,
				);
				lines.push(
					`        <PrimitiveArrayField name="${fullPath}" itemType="string" control={control} register={register} />`,
				);
				lines.push(`      </div>`);
			}
			break;
		}

		case "object":
			lines.push(`      {/* ${fullPath} (object) */}`);
			lines.push(
				`      <fieldset key="${key}" style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>`,
			);
			lines.push(
				`        <legend style={{ fontWeight: 600, marginBottom: 8 }}>${field.name}</legend>`,
			);
			for (const sub of field.fields ?? []) {
				pushFieldLines(lines, sub, [...path, field.name]);
			}
			lines.push(`      </fieldset>`);
			break;

		default:
			lines.push(`      {/* ${fullPath} (unknown) */}`);
			lines.push(`      <div style={{ marginBottom: 12 }} key="${key}">`);
			lines.push(
				`        <label style={{ display: "block", marginBottom: 4 }}>${field.name}</label>`,
			);
			lines.push(`        <input {...register("${fullPath}")} />`);
			lines.push(`      </div>`);
	}
}

function collectArrayHelpers(
	fields: Field[],
	path: string[],
	primSet: Set<string>,
	objSet: Set<string>,
) {
	for (const f of fields) {
		if (f.type === "array") {
			if (
				f.itemType &&
				(f.itemType === "string" ||
					f.itemType === "number" ||
					f.itemType === "boolean")
			) {
				primSet.add("PrimitiveArrayField");
			} else if (f.fields && f.fields.length > 0) {
				objSet.add("ObjectArrayField");
			} else {
				primSet.add("PrimitiveArrayField");
			}
		} else if (f.type === "object") {
			collectArrayHelpers(f.fields ?? [], [...path, f.name], primSet, objSet);
		}
	}
}
