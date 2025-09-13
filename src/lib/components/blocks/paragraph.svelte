<script module lang="ts">
  import { z } from "zod";

  export const paragraphSchema = z.object({
    text: z.string().default("Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."),
  });

  export type paragraphProps = z.infer<typeof paragraphSchema>;
  export const paragraph = paragraphSnippet;
</script>

{#snippet paragraphSnippet({
  text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
}: paragraphProps)}
  <p class="">{text}</p>
{/snippet}
