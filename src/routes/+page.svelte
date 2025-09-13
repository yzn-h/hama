<script lang="ts">
  import { snippets, schemas } from "$lib";
  import * as RadioGroup from "@/components/ui/radio-group/index.js";
  import { Label } from "@/components/ui/label";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import SchemaForm from "$lib/utils/schema-form.svelte";
  import * as v from "valibot";
  import * as Card from "$lib/components/ui/card/index.js";

  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import PenIcon from "@lucide/svelte/icons/pen-tool";

  import { buttonVariants } from "@/components/ui/button";

  let currentMode: "edit" | "preview" = $state("edit");
  $inspect(currentMode);
  type block = {
    id: string;
    type: keyof typeof snippets;
    block: (typeof snippets)[keyof typeof snippets];
    props: any;
  };

  let blocks: block[] = $state([
    {
      id: "sfsdfs",
      type: "hero",
      block: snippets.hero,
      props: { title: "Hello" },
    },
  ]);

  function addBlock(block: keyof typeof snippets) {
    const defaultProps = v.parse(schemas[block], {});
    blocks.push({
      id: crypto.randomUUID(),
      type: block,
      block: snippets[block],
      props: defaultProps,
    });
  }

  function serializeBlocks() {
    const serialized = blocks.map((block) => ({
      id: block.id,
      type: block.type,
      props: block.props,
    }));
    console.log("serialized", serialized);

    return JSON.stringify(serialized);
  }

  function deserializeBlocks(raw: string) {
    console.log("raw", raw);
    console.log("JSON.parse(raw)", JSON.parse(raw));
    const parsed = JSON.parse(raw) as block[];
    console.log(parsed.map((b) => ({ ...b, block: snippets[b.type] })));
  }
</script>

<div
  class="h-[100svh] fixed max-h-[100svh] overflow-hidden flex flex-col w-full p-1"
>
  <RadioGroup.Root
    bind:value={currentMode}
    class="grid gap-3 md:grid-cols-2 max-w-lg w-full place-self-center p-4"
  >
    {#each [{ id: "preview", label: "Preview Mode" }, { id: "edit", label: "Edit Mode" }] as mode (mode.id)}
      <Label
        class="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20 flex items-start gap-3 rounded-lg border p-3"
      >
        <RadioGroup.Item
          value={mode.id}
          id={mode.id}
          class="data-[state=checked]:border-primary"
        />
        <div class="grid gap-1 font-normal">
          <div class="font-medium">{mode.label}</div>
        </div>
      </Label>
    {/each}
  </RadioGroup.Root>
  {#if currentMode === "edit"}
    <div>
      <button onclick={() => addBlock("image")}>add image</button>
      <button onclick={() => addBlock("contactForm")}>add form</button>
      <button onclick={() => addBlock("footer")}>add footer</button>
      <button onclick={() => addBlock("paragraph")}>add text</button>
      <button onclick={() => addBlock("hero")}>add hero</button>
      <button onclick={() => addBlock("paragraph")}>add paragraph</button>

      <button onclick={() => serializeBlocks()}>test serialize</button>
      <button onclick={() => deserializeBlocks(serializeBlocks())}
        >test deserialize</button
      >
    </div>

    <div
      class="overflow-y-auto flex flex-col my-5 p-2 gap-3 grow w-full max-w-2xl place-self-center"
    >
      {#each blocks as block}
        <div
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-200"
        >
          <Collapsible.Root class=" flex w-full flex-col h-full items-center">
            <div class="flex w-full h-full items-center">
              <div
                class="cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <GripVertical class="h-5 w-5" />
              </div>
              <div class="grow mx-3">
                {block.type}
              </div>
              <Collapsible.Trigger
                class={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  class: "w-9 p-0",
                })}
              >
                <PenIcon />
                <span class="sr-only">Toggle</span>
              </Collapsible.Trigger>
            </div>

            <Collapsible.Content class="space-y-2 w-full mt-4 overflow-visible">
              <SchemaForm
                schema={schemas[block.type]}
                bind:values={block.props}
              />
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      {/each}
    </div>
  {:else}
    <Card.Root
      class="overflow-y-auto flex flex-col grow my-5 p-2 place-self-center w-full max-w-2xl"
    >
      <!-- <Card.Root class="w-full "> -->
      <Card.Content>
        {#each blocks as block}
          {@render block.block(block.props)}
        {/each}
      </Card.Content>
    </Card.Root>
    <!-- </div> -->
  {/if}

  <!-- <Preview> -->
</div>

<!-- </Preview> -->
