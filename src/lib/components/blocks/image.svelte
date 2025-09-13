<script module lang="ts">
  import { z } from "zod";

  export const imageSchema = z.object({
    src: z.string().url().default("https://placehold.co/600x400"),
    alt: z.string().default("Image"),
  });

  export type imageProps = z.infer<typeof imageSchema>;
  export const image = imageSnippet;
</script>

{#snippet imageSnippet({
  src = "https://placehold.co/600x400",
  alt = "Image",
}: imageProps)}
  <img class="" {src} {alt} />
{/snippet}
