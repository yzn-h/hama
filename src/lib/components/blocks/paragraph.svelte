<script module lang="ts">
  export const paragraph = paragraphSnippet;
  export type paragraphProps = {
    text?: string;
  };
</script>

{#snippet paragraphSnippet({
  text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
}: paragraphProps)}
  <p class="">{text}</p>
{/snippet}
