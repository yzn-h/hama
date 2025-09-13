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
  import Download from "@lucide/svelte/icons/download";
  import Upload from "@lucide/svelte/icons/upload";
  import X from "@lucide/svelte/icons/x";
  import {
    dndzone,
    dragHandle,
    dragHandleZone,
    TRIGGERS,
  } from "svelte-dnd-action";

  import { buttonVariants } from "@/components/ui/button";
  import { Button } from "@/components/ui/button";
  import { flip } from "svelte/animate";

  let flipDurationMs = 100;

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
      id: "demo1",
      type: "hero",
      block: snippets.hero,
      props: { title: "Hello" },
    },
  ]);

  function addBlock(block: keyof typeof snippets) {
    const defaultProps = v.parse(schemas[block], {});
    const id = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString();
    blocks.push({
      id: id,
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

    return JSON.stringify(serialized, null, 2);
  }

  function deserializeBlocks(raw: string) {
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      type: keyof typeof snippets;
      props: any;
    }>;

    blocks = parsed.map((b) => ({
      ...b,
      block: snippets[b.type],
    }));
  }

  function exportToFile() {
    const data = serializeBlocks();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `hama-blocks-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importFromFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          deserializeBlocks(content);
        } catch (error) {
          console.error("Error importing file:", error);
          alert(
            "Error importing file. Please check that it's a valid JSON file."
          );
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  function handleSort(e: CustomEvent) {
    blocks = e.detail.items;
  }

  function deleteBlock(id: string) {
    blocks = blocks.filter(block => block.id !== id);
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
    <div class="flex flex-col gap-4 p-4">
      <div class="flex flex-wrap gap-2">
        <Button onclick={() => addBlock("image")} variant="outline" size="sm"
          >add image</Button
        >
        <Button
          onclick={() => addBlock("contactForm")}
          variant="outline"
          size="sm">add form</Button
        >
        <Button onclick={() => addBlock("footer")} variant="outline" size="sm"
          >add footer</Button
        >
        <Button
          onclick={() => addBlock("paragraph")}
          variant="outline"
          size="sm">add text</Button
        >
        <Button onclick={() => addBlock("hero")} variant="outline" size="sm"
          >add hero</Button
        >
      </div>

      <div class="flex gap-2 justify-center">
        <Button
          onclick={exportToFile}
          variant="default"
          size="sm"
          class="flex items-center gap-2"
        >
          <Download class="h-4 w-4" />
          Export
        </Button>
        <Button
          onclick={importFromFile}
          variant="default"
          size="sm"
          class="flex items-center gap-2"
        >
          <Upload class="h-4 w-4" />
          Import
        </Button>
      </div>
    </div>

    <div
      class="overflow-y-auto flex flex-col my-5 p-2 gap-3 grow w-full max-w-2xl place-self-center"
      use:dragHandleZone={{
        items: blocks,
        flipDurationMs,
      }}
      onconsider={handleSort}
      onfinalize={handleSort}
    >
      {#each blocks as block (block.id)}
        <div
          animate:flip={{ duration: flipDurationMs }}
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-200 relative"
          data-drag-disabled="true"
        >
          <button
            onclick={() => deleteBlock(block.id)}
            class="absolute -top-1 -right-1 w-4 h-4 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center shadow-sm transition-colors z-10"
            title="Delete block"
          >
            <X class="h-2 w-2" />
          </button>
          <Collapsible.Root class=" flex w-full flex-col h-full items-center">
            <div class="flex w-full h-full items-center">
              <div
                use:dragHandle
                class="drag-handle cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0"
                data-drag-disabled="false"
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
