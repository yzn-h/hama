<script module lang="ts">
  import * as v from "valibot";

  export const imageSchema = v.object({
    src: v.optional(v.pipe(v.string(), v.url()), "https://placehold.co/600x400"),
    alt: v.optional(v.string(), "Image"),
  });

  export type imageProps = v.InferOutput<typeof imageSchema>;
  export const image = imageSnippet;
</script>

{#snippet imageSnippet({
  src = "https://placehold.co/600x400",
  alt = "Image",
}: imageProps)}
  <img class="" {src} {alt} />
{/snippet}