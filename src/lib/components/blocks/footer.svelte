<script module lang="ts">
  export const footer = footerSnippet;

  export const footerProps = {
    email: "you@example.com",
    name: "Your Name",
  } as {
    email?: string;
    name?: string;
  };
</script>

{#snippet footerSnippet({ email, name }: typeof footerProps)}
  <footer class="">
    {email} |
    {name}
  </footer>
{/snippet}
