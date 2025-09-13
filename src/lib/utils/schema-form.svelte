<script lang="ts">
  import * as v from "valibot";
  import type {
    BaseSchema,
    ObjectSchema,
    ArraySchema,
    PicklistSchema,
    OptionalSchema,
    NullableSchema
  } from "valibot";

  interface Props {
    schema: BaseSchema<unknown, unknown, any>;
    values: Record<string, any>;
  }

  let { schema, values = $bindable() }: Props = $props();

  function getInputType(fieldSchema: BaseSchema<unknown, unknown, any>): string {
    // Check schema type using Valibot's type property
    if (!fieldSchema || typeof fieldSchema !== 'object' || !fieldSchema.type) {
      return "text";
    }
    const schemaType = fieldSchema.type;
    
    if (schemaType === "string") {
      // For now, return text - email/url detection would require examining the pipe
      return "text";
    }
    
    if (schemaType === "number") {
      return "number";
    }
    
    if (schemaType === "boolean") {
      return "checkbox";
    }
    
    if (schemaType === "picklist") {
      return "select";
    }
    
    return "text";
  }

  function getOptions(fieldSchema: BaseSchema<unknown, unknown, any>): string[] | null {
    if (!fieldSchema || typeof fieldSchema !== 'object' || !fieldSchema.type) {
      return null;
    }
    if (fieldSchema.type === "picklist") {
      const picklistSchema = fieldSchema as PicklistSchema<any, any>;
      if (picklistSchema.options) {
        return picklistSchema.options as string[];
      }
    }
    return null;
  }

  function getDefaultValue(fieldSchema: BaseSchema<unknown, unknown, any>): any {
    if (!fieldSchema || typeof fieldSchema !== 'object' || !fieldSchema.type) {
      return "";
    }
    
    // Valibot doesn't expose default values the same way
    // Try to parse undefined to see if there's a default
    try {
      const result = v.safeParse(fieldSchema, undefined);
      if (result.success) {
        return result.output;
      }
    } catch {}
    
    // Return appropriate default based on type
    const schemaType = fieldSchema.type;
    if (schemaType === "string") return "";
    if (schemaType === "number") return 0;
    if (schemaType === "boolean") return false;
    return "";
  }

  // get valibot object keys recursively
  const valibotKeys = (schema: BaseSchema<unknown, unknown, any>): string[] => {
    // make sure schema is not null or undefined and has a type property
    if (!schema || typeof schema !== 'object' || !schema.type) return [];
    
    // check if schema is nullable or optional
    if (schema.type === "nullable") {
      const nullableSchema = schema as NullableSchema<any, any>;
      if (nullableSchema.wrapped) {
        return valibotKeys(nullableSchema.wrapped);
      }
    }
    if (schema.type === "optional") {
      const optionalSchema = schema as OptionalSchema<any, any>;
      if (optionalSchema.wrapped) {
        return valibotKeys(optionalSchema.wrapped);
      }
    }
    
    // check if schema is an array
    if (schema.type === "array") {
      const arraySchema = schema as ArraySchema<any, any>;
      if (arraySchema.item) {
        return valibotKeys(arraySchema.item);
      }
    }
    
    // check if schema is an object
    if (schema.type === "object") {
      const objectSchema = schema as ObjectSchema<any, any>;
      if (!objectSchema.entries) {
        return [];
      }
      const entries = Object.entries(objectSchema.entries);
      // loop through key/value pairs
      return entries.flatMap(([key, value]) => {
        // get nested keys
        try {
          const nested = valibotKeys(value as BaseSchema<unknown, unknown, any>)
            .map((subKey) => `${key}.${subKey}`);
          return nested.length ? nested : [key];
        } catch {
          return [key];
        }
      });
    }
    
    // return empty array
    return [];
  };

  const getSchemaField = (schema: BaseSchema<unknown, unknown, any>, fieldName: string): BaseSchema<unknown, unknown, any> | null => {
    if (!schema || typeof schema !== 'object' || !schema.type) {
      return null;
    }
    if (schema.type === "object") {
      const objectSchema = schema as ObjectSchema<any, any>;
      if (!objectSchema.entries) {
        return null;
      }
      return (objectSchema.entries[fieldName] as BaseSchema<unknown, unknown, any>) || null;
    }
    return null;
  };

  const fieldNames = valibotKeys(schema);
  const fields = fieldNames.map((fieldName) => ({
    name: fieldName,
    schema: getSchemaField(schema, fieldName),
  }));

  // Initialize values with defaults if not provided
  for (const field of fields) {
    if (field.schema && values[field.name] === undefined) {
      values[field.name] = getDefaultValue(field.schema);
    }
  }
</script>

<div class="space-y-4">
  {#each fields as field}
    {#if field.schema}
      {@const inputType = getInputType(field.schema)}
      {@const options = getOptions(field.schema)}

      <div class="space-y-2">
        <label for={field.name} class="text-sm font-medium capitalize">
          {field.name.replace(/([A-Z])/g, " $1").toLowerCase()}
        </label>

        {#if inputType === "select" && options}
          <select
            id={field.name}
            bind:value={values[field.name]}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each options as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        {:else if inputType === "checkbox"}
          <input
            id={field.name}
            type="checkbox"
            bind:checked={values[field.name]}
            class="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        {:else}
          <input
            id={field.name}
            type={inputType}
            bind:value={values[field.name]}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        {/if}
      </div>
    {/if}
  {/each}
</div>