<script module lang="ts">
  import { z } from "zod";

  export const footerSchema = z.object({
    email: z.string().email().default("you@example.com"),
    name: z.string().default("Your Name"),
  });

  export type footerProps = z.infer<typeof footerSchema>;
  export const footer = footerSnippet;
</script>

{#snippet footerSnippet({ email, name }: footerProps)}
  <footer class="">
    {email} |
    {name}
  </footer>
{/snippet}
