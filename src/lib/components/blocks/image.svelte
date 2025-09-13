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
  <div class="my-8 mx-auto max-w-4xl px-6">
    <img 
      class="w-full h-auto rounded-lg shadow-sm" 
      {src} 
      {alt}
      loading="lazy"
    />
  </div>
{/snippet}