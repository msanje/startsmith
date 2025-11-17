export type PrimitiveType = "string" | "number" | "boolean"
export type ItemType = PrimitiveType | "unknown"
export type FieldType = PrimitiveType | "array" | "object" | "unknown"

export interface Field {
  name: string;
  type: FieldType;
  itemType?: ItemType;
  required: boolean;
  fields?: Field[]
}

export interface NormalizedSchema {
  name: string;
  fields: Field[];
  raw?: string;
}
