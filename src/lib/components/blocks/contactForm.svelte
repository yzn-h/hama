<script module lang="ts">
  import * as v from "valibot";

  export const contactFormSchema = v.object({
    email: v.optional(v.pipe(v.string(), v.email()), "company@example.com"),
  });

  export type contactFormProps = v.InferOutput<typeof contactFormSchema>;
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