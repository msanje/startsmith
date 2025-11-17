import { Field, NormalizedSchema } from "../types";

export function generateFormTsx(schema: NormalizedSchema): string {
	const componentName = `${schema.name}Form`;

	const lines: string[] = [];

	// Imports
	lines.push(`import React from "react";`);
	lines.push(`import { useForm, useFieldArray } from "react-hook-form";`);
	lines.push(`import { zodResolver } from "@hookform/resolvers/zod";`);
	lines.push(
		`import { ${schema.name}Schema, ${schema.name} } from "./schema";`,
	);
	lines.push("");

	// Component start
	lines.push(
		`export function ${componentName}({ onSubmit }: { onSubmit: (data: ${schema.name}) => void }) {`,
	);
	lines.push(`  const form = useForm<${schema.name}>({`);
	lines.push(`    resolver: zodResolver(${schema.name}Schema),`);
	lines.push(`    defaultValues: {},`);
	lines.push(`  });`);
	lines.push("");
	lines.push(
		`  const { register, control, handleSubmit, formState: { errors } } = form;`,
	);
	lines.push("");

	// Render helpers
	lines.push("  function renderField(field: any, path = '') {");
	lines.push(
		"    const fullPath = path ? `${path}.${field.name}` : field.name;",
	);
	lines.push("");
	lines.push("    switch (field.type) {");

	// string
	lines.push(`      case "string":`);
	lines.push(`        return (`);
	lines.push(`          <div key={fullPath}>`);
	lines.push(`            <label>{field.name}</label>`);
	lines.push(`            <input {...register(fullPath)} />`);
	lines.push(
		`            {errors?.[field.name] && <p>{errors[field.name]?.message}</p>}`,
	);
	lines.push(`          </div>`);
	lines.push(`        );`);

	// number
	lines.push(`      case "number":`);
	lines.push(`        return (`);
	lines.push(`          <div key={fullPath}>`);
	lines.push(`            <label>{field.name}</label>`);
	lines.push(
		`            <input type="number" {...register(fullPath, { valueAsNumber: true })} />`,
	);
	lines.push(
		`            {errors?.[field.name] && <p>{errors[field.name]?.message}</p>}`,
	);
	lines.push(`          </div>`);
	lines.push(`        );`);

	// boolean
	lines.push(`      case "boolean":`);
	lines.push(`        return (`);
	lines.push(`          <div key={fullPath}>`);
	lines.push(`            <label>{field.name}</label>`);
	lines.push(`            <input type="checkbox" {...register(fullPath)} />`);
	lines.push(
		`            {errors?.[field.name] && <p>{errors[field.name]?.message}</p>}`,
	);
	lines.push(`          </div>`);
	lines.push(`        );`);

	// array
	lines.push(`      case "array":`);
	lines.push(
		`        return <ArrayField key={fullPath} name={fullPath} itemType={field.itemType} form={form} />;`,
	);

	// object
	lines.push(`      case "object":`);
	lines.push(`        return (`);
	lines.push(`          <fieldset key={fullPath}>`);
	lines.push(`            <legend>{field.name}</legend>`);
	lines.push(
		`            {field.fields?.map((inner: any) => renderField(inner, fullPath))}`,
	);
	lines.push(`          </fieldset>`);
	lines.push(`        );`);

	// default
	lines.push("      default:");
	lines.push("        return null;");
	lines.push("    }");
	lines.push("  }");
	lines.push("");

	// Component JSX
	lines.push(`  return (`);
	lines.push(`    <form onSubmit={handleSubmit(onSubmit)}>`);
	lines.push(`      <h2>${componentName}</h2>`);
	lines.push("");
	lines.push(`      {schema.fields.map((f: any) => renderField(f))}`);
	lines.push("");
	lines.push(`      <button type="submit">Submit</button>`);
	lines.push(`    </form>`);
	lines.push(`  );`);
	lines.push("}");
	lines.push("");

	// ArrayField component
	lines.push(`function ArrayField({ name, itemType, form }: any) {`);
	lines.push(`  const { control, register } = form;`);
	lines.push(`  const fa = useFieldArray({ control, name });`);
	lines.push("");
	lines.push(`  return (`);
	lines.push(`    <div>`);
	lines.push(`      <label>{name}</label>`);
	lines.push(`      {fa.fields.map((field, index) => (`);
	lines.push(`        <div key={field.id}>`);
	lines.push(`          <input`);
	lines.push(
		`            {...register(\`\${name}.\${index}\`, itemType === 'number' ? { valueAsNumber: true } : {})}`,
	);
	lines.push(`          />`);
	lines.push(
		`          <button type="button" onClick={() => fa.remove(index)}>Remove</button>`,
	);
	lines.push(`        </div>`);
	lines.push(`      ))}`);
	lines.push(
		`      <button type="button" onClick={() => fa.append(itemType === "number" ? 0 : "")}>Add</button>`,
	);
	lines.push(`    </div>`);
	lines.push(`  );`);
	lines.push(`}`);
	lines.push("");

	return lines.join("\n");
}
