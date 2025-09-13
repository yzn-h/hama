<script module lang="ts">
  import * as v from "valibot";

  export const heroSchema = v.object({
    title: v.optional(v.string(), "Hello"),
  });

  export type heroProps = v.InferOutput<typeof heroSchema>;
  export const hero = heroSnippet;
</script>

{#snippet heroSnippet({ title = "Hello" }: heroProps)}
  <div class="text-center py-16 px-6">
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
      {title}
    </h1>
  </div>
{/snippet}