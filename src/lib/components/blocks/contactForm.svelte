<script module lang="ts">
  import * as v from "valibot";

  export const contactFormSchema = v.object({
    email: v.optional(v.pipe(v.string(), v.email()), "company@example.com"),
  });

  export type contactFormProps = v.InferOutput<typeof contactFormSchema>;
  export const contactForm = contactFormSnippet;
</script>

{#snippet contactFormSnippet({ email }: contactFormProps)}
  <form class="max-w-lg mx-auto space-y-6 p-6">
    <div class="space-y-2">
      <label for="email" class="block text-sm font-medium leading-6">
        Email
      </label>
      <input 
        type="email" 
        name="email" 
        id="email" 
        class="block w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6"
        placeholder="Enter your email"
      />
    </div>
    
    <div class="space-y-2">
      <label for="name" class="block text-sm font-medium leading-6">
        Name
      </label>
      <input 
        type="text" 
        name="name" 
        id="name" 
        class="block w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6"
        placeholder="Enter your name"
      />
    </div>
    
    <div class="space-y-2">
      <label for="message" class="block text-sm font-medium leading-6">
        Message
      </label>
      <textarea 
        name="message" 
        id="message" 
        rows="4"
        class="block w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 resize-vertical"
        placeholder="Enter your message"
      ></textarea>
    </div>
    
    <button 
      type="submit" 
      class="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
    >
      Submit
    </button>
  </form>
{/snippet}