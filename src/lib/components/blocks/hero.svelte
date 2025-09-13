<script module lang="ts">
  import * as v from "valibot";

  export const heroSchema = v.object({
    title: v.optional(v.string(), "Hello"),
  });

  export type heroProps = v.InferOutput<typeof heroSchema>;
  export const hero = heroSnippet;
</script>

{#snippet heroSnippet({ title = "Hello" }: heroProps)}
  <h2
    class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  >
    {title}
  </h2>
{/snippet}