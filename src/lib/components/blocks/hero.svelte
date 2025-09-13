<script module lang="ts">
  import { z } from "zod";

  export const heroSchema = z.object({
    title: z.string().default("Hello"),
  });

  export type heroProps = z.infer<typeof heroSchema>;
  export const hero = heroSnippet;
</script>

{#snippet heroSnippet({ title = "Hello" }: heroProps)}
  <h2
    class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  >
    {title}
  </h2>
{/snippet}
