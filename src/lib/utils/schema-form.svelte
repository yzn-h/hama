<script lang="ts">
  import { z } from "zod";
  import type {
    ZodSchema,
    ZodTypeAny,
    ZodType,
    ZodObject,
    ZodNullable,
    ZodOptional,
    ZodArray,
  } from "zod";

  interface Props {
    schema: ZodSchema;
    values: Record<string, any>;
  }

  let { schema, values = $bindable() }: Props = $props();

  function getInputType(fieldSchema: any): string {
    if (fieldSchema instanceof z.ZodString) {
      const checks = fieldSchema._def.checks || [];

      for (const check of checks) {
        if (check.kind === "email") return "email";
        if (check.kind === "url") return "url";
      }

      return "text";
    }

    if (fieldSchema instanceof z.ZodNumber) {
      return "number";
    }

    if (fieldSchema instanceof z.ZodBoolean) {
      return "checkbox";
    }

    if (fieldSchema instanceof z.ZodEnum) {
      return "select";
    }

    return "text";
  }

  function getOptions(fieldSchema: any): string[] | null {
    if (fieldSchema instanceof z.ZodEnum) {
      return fieldSchema._def.values;
    }
    return null;
  }

  function getDefaultValue(fieldSchema: any): any {
    if (fieldSchema._def.defaultValue) {
      return fieldSchema._def.defaultValue();
    }
    return "";
  }

  // get zod object keys recursively
  const zodKeys = <T extends z.ZodTypeAny>(schema: T): string[] => {
    // make sure schema is not null or undefined
    if (schema === null || schema === undefined) return [];
    // check if schema is nullable or optional
    if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
      return zodKeys(schema.unwrap());
    // check if schema is an array
    if (schema instanceof z.ZodArray) return zodKeys(schema.element);
    // check if schema is an object
    if (schema instanceof z.ZodObject) {
      // get key/value pairs from schema
      const entries = Object.entries(schema.shape);
      // loop through key/value pairs
      return entries.flatMap(([key, value]) => {
        // get nested keys
        const nested =
          value instanceof z.ZodType
            ? zodKeys(value).map((subKey) => `${key}.${subKey}`)
            : [];
        // return nested keys
        return nested.length ? nested : key;
      });
    }
    // return empty array
    return [];
  };

  const getSchemaField = (schema: any, fieldName: string) => {
    if (schema instanceof z.ZodObject) {
      return schema.shape[fieldName];
    }
    return null;
  };

  const fieldNames = zodKeys(schema);
  const fields = fieldNames.map((fieldName) => [
    fieldName,
    getSchemaField(schema, fieldName),
  ]);

  // Initialize values with defaults if not provided
  for (const [fieldName, fieldSchema] of fields) {
    if (fieldSchema && values[fieldName] === undefined) {
      values[fieldName] = getDefaultValue(fieldSchema);
    }
  }
</script>

<div class="space-y-4">
  {#each fields as [fieldName, fieldSchema]}
    {@const inputType = getInputType(fieldSchema)}
    {@const options = getOptions(fieldSchema)}

    <div class="space-y-2">
      <label for={fieldName} class="text-sm font-medium capitalize">
        {fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}
      </label>

      {#if inputType === "select" && options}
        <select
          id={fieldName}
          bind:value={values[fieldName]}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {#each options as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      {:else if inputType === "checkbox"}
        <input
          id={fieldName}
          type="checkbox"
          bind:checked={values[fieldName]}
          class="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      {:else}
        <input
          id={fieldName}
          type={inputType}
          bind:value={values[fieldName]}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      {/if}
    </div>
  {/each}
</div>
