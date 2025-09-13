<script module lang="ts">
  import * as v from "valibot";

  export const paragraphSchema = v.object({
    text: v.optional(v.string(), "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."),
  });

  export type paragraphProps = v.InferOutput<typeof paragraphSchema>;
  export const paragraph = paragraphSnippet;
</script>

{#snippet paragraphSnippet({
  text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
}: paragraphProps)}
  <p class="">{text}</p>
{/snippet}