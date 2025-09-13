<script module lang="ts">
  export const contactForm = contactFormSnippet;

  export const contactFormProps = {
    email: "company@example.com",
  } as {
    email?: string;
  };
</script>

{#snippet contactFormSnippet({ email }: typeof contactFormProps)}
  <form class="">
    <label for="email"
      >Email
      <input type="email" name="email" id="email" />
    </label>
    <label for="name"
      >Name
      <input type="text" name="name" id="name" />
    </label>
    <label for="message"
      >Message
      <textarea name="message" id="message"></textarea>
    </label>
    <button type="submit">Submit</button>
  </form>
{/snippet}
