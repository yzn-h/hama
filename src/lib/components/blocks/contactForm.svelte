<script module lang="ts">
  import { z } from "zod";

  export const contactFormSchema = z.object({
    email: z.string().email().default("company@example.com"),
  });

  export type contactFormProps = z.infer<typeof contactFormSchema>;
  export const contactForm = contactFormSnippet;
</script>

{#snippet contactFormSnippet({ email }: contactFormProps)}
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
