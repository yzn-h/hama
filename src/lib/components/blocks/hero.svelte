<script module lang="ts">
  export const hero = heroSnippet;
  export type heroProps = {
    title?: string;
  };
</script>

{#snippet heroSnippet({ title = "Hello" }: heroProps)}
  <h2
    class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  >
    {title}
  </h2>
{/snippet}
