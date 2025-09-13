// place files you want to import through the `$lib` alias in this folder.
import { hero } from "@/components/blocks/hero.svelte";
import { image } from "./components/blocks/image.svelte";
import { contactForm } from "./components/blocks/contactForm.svelte";
import { footer } from "./components/blocks/footer.svelte";
import { paragraph } from "./components/blocks/paragraph.svelte";

export const snippets = {
  hero,
  image,
  contactForm,
  footer,
  paragraph,
};

export type 