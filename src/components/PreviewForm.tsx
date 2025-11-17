"use client"

import { makeZod } from "@/lib/makeZod"
import { useFieldArray, useForm, useFormState } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Field, NormalizedSchema } from "@/lib/types"
import { array, z } from "zod"

interface PreviewFormProps {
  schema: NormalizedSchema
}

export function PreviewForm({ schema }: PreviewFormProps) {
  const zodSchema = makeZod(schema)

  const form = useForm({
    resolver: zodResolver(zodSchema),
    mode: "onBlur",
    defaultValues: {}
  })

  const { handleSubmit, register, control, formState } = form;
  const { errors } = formState; 

  function onSubmit(values: any) {
    console.log("Form submitted: ", values)
  }

  function renderField(field: Field, path: string = "") {
    const fullPath = path ? `${path}.${field.name}` : field.name;

    switch (field.type) {
      case "string":
        return (
          <div key={fullPath} className="mb-4">
            <label
              className="block mb-1 text-sm"
              htmlFor="">{field.name}</label>
            <input
              {...register(fullPath)}
              className="border rounded px-2 py-1 w-full"
            />
            <ErrorMessage path={fullPath} errors={errors} />
          </div>
        )
      
      case "number":
        return (
          <div key={fullPath} className="mb-4">
            <label className="block mb-1 text-sm">
              {field.name}
            </label>
            <input
              type="number"
              {...register(fullPath, { valueAsNumber: true })}
              className="border rounded px-2 py-1 w-full"
            />
            <ErrorMessage path={fullPath} errors={errors} />
          </div>
        );
      
      case "boolean":
        return (
          <div key={fullPath}
            className="mb-4 flex items-center gap-2"
          >
            <input
              type="checkbox"
              {...register(fullPath)}
            />
            <label
              className="text-sm"
            >{field.name}</label>
            <ErrorMessage path={fullPath} errors={errors} />
          </div>
        );
      case "array":
        return (
          <ArrayField
            key={fullPath}
            name={fullPath}
            itemType={field.itemType || "string"}
            form={form}
          /> 
        )
      case "object":
        return (
          <fieldset
            key={fullPath}
            className="border p-3 rounded mb-4"
          >
            <legend
              className="text-sm font-medium"
            >
              {field.name}
            </legend>
            {field.fields?.map((sub) => renderField(sub, fullPath))}
          </fieldset>
        )
      
      default: 
        return null
    }
  }

  return (
    <form
    onSubmit={handleSubmit(onSubmit)} 
    >
      <h2
        className="text-lg font-semibold mb-4"
      >{schema.fields.map((field) => renderField(field))}</h2>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Submit
      </button>
    </form>
  )
}

function ErrorMessage({ path, errors }: any) {
  const parts = path.split(".");
  let curr: any = errors;

  for (const p of parts) {
    if (!curr) return null;
    curr = curr[p];
  }

  if (!curr?.message) return null;

  return <p className="text-xs text-red-600 mt-1">{curr.message}</p>
}

function ArrayField({ name, itemType, form }: any) {
  const { control, register } = form;

  const fa = useFieldArray({ control, name })
  
  return (
    <div className="mb-4">
      <label
        className="block mb-1 text-sm"
      >
        {name} (array)
      </label>

      {fa.fields.map((f: any, index: number) => (
        <div key={f.id} className="flex gap-2 mb-2">
          {itemType === "number" ? (
            <input
              type="number"
              {...register(`${name}.${index}`, { valueAsNumber: true })}
              className="border rounded px-2 py-1 w-full"
            />
          ) : itemType === "boolean" ? (
            <input type="checkbox" {...register(`${name}.${index}`)} />
          ) : (
            <input
              {...register(`${name}.${index}`)}
              className="border rounded px-2 py-1 w-full"
            />
          )}

          <button
            type="button"
            className="border px-2 rounded"
            onClick={() => fa.remove(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        className="border px-3 py-1 rounded"
        onClick={() => 
          fa.append(itemType === "number" ? 0 : itemType === "boolean" ? false : "")
        }
      >
        Add
      </button>
    </div>
  )
} 