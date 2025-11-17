import { z } from "zod"; import { Field, NormalizedSchema } from "./types";

export function makeZod(schema: NormalizedSchema) {
  const shape: Record<string, z.ZodType> = {};

  for (const field of schema.fields) {
    shape[field.name] = fieldToZod(field);
  }

  return z.object(shape);
}

function fieldToZod(field: Field): z.ZodType {
 switch (field.type) {
    case "string": {
      const base = z.string();
      return field.required ? base : base.optional();
    }

    case "number": {
      const base = z.number();
      return field.required ? base : base.optional();
    }

    case "boolean": {
      const base = z.boolean();
      return field.required ? base : base.optional();
    }

    case "array": {
      const item =
        field.itemType === "string"
          ? z.string()
          : field.itemType === "number"
          ? z.number()
          : field.itemType === "boolean"
          ? z.boolean()
          : z.any();

      const arr = z.array(item);
      return field.required ? arr : arr.optional();
    }

    case "object": {
      const nestedShape: Record<string, z.ZodType> = {};

      for (const inner of field.fields ?? []) {
        nestedShape[inner.name] = fieldToZod(inner);
      }

      const obj = z.object(nestedShape);
      return field.required ? obj : obj.optional();
    }

    default:
      return z.any();
  } 
}