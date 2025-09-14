// place files you want to import through the `$lib` alias in this folder.
import { hero, heroSchema } from "@/components/blocks/hero.svelte";
import { image, imageSchema } from "./components/blocks/image.svelte";
import {
  contactForm,
  contactFormSchema,
} from "./components/blocks/contactForm.svelte";
import { footer, footerSchema } from "./components/blocks/footer.svelte";
import {
  paragraph,
  paragraphSchema,
} from "./components/blocks/paragraph.svelte";
import {
  separator,
  separatorSchema,
} from "./components/blocks/separator.svelte";

export const snippets = {
  hero,
  image,
  contactForm,
  footer,
  paragraph,
  separator,
};

export const schemas = {
  hero: heroSchema,
  image: imageSchema,
  contactForm: contactFormSchema,
  footer: footerSchema,
  paragraph: paragraphSchema,
  separator: separatorSchema,
};
