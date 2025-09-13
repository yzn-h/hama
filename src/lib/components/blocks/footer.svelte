<script module lang="ts">
  import * as v from "valibot";

  export const footerSchema = v.object({
    email: v.optional(v.pipe(v.string(), v.email()), "you@example.com"),
    name: v.optional(v.string(), "Your Name"),
  });

  export type footerProps = v.InferOutput<typeof footerSchema>;
  export const footer = footerSnippet;
</script>

{#snippet footerSnippet({ email, name }: footerProps)}
  <footer class="">
    {email} |
    {name}
  </footer>
{/snippet}