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
  <div class="max-w-3xl mx-auto px-6 my-6">
    <p class="text-lg leading-relaxed text-gray-700">{text}</p>
  </div>
{/snippet}