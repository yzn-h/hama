<script module lang="ts">
  import * as v from "valibot";

  export const separatorSchema = v.object({});

  export type separatorProps = v.InferOutput<typeof separatorSchema>;
  export const separator = separatorSnippet;
</script>

{#snippet separatorSnippet()}
  <div class="max-w-3xl mx-auto px-6 my-8">
    <hr class="w-full border-0 h-0.5 bg-gray-400" />
  </div>
{/snippet}
