<script module lang="ts">
  export const image = imageSnippet;
  export type imageProps = {
    src?: string;
    alt?: string;
  };
</script>

{#snippet imageSnippet({
  src = "https://placehold.co/600x400",
  alt = "Image",
}: imageProps)}
  <img class="" {src} {alt} />
{/snippet}
