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
  <footer class="border-t border-gray-200 mt-12 pt-8 pb-6">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
        <a href="mailto:{email}" class="hover:text-gray-900 transition-colors font-medium">
          {email}
        </a>
        <span class="hidden sm:inline text-gray-400">•</span>
        <span class="font-medium">{name}</span>
      </div>
    </div>
  </footer>
{/snippet}