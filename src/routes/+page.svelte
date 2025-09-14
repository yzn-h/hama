<script lang="ts">
  import { snippets, schemas } from "$lib";
  import * as Tabs from "@/components/ui/tabs/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import SchemaForm from "$lib/utils/schema-form.svelte";
  import * as v from "valibot";
  import * as Card from "$lib/components/ui/card/index.js";
  import { scale } from "svelte/transition";

  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import PenIcon from "@lucide/svelte/icons/pen";
  import Save from "@lucide/svelte/icons/save";
  import Upload from "@lucide/svelte/icons/upload";
  import Trash from "@lucide/svelte/icons/trash-2";
  import ImageIcon from "@lucide/svelte/icons/image";
  import FileTextIcon from "@lucide/svelte/icons/file-text";
  import MailIcon from "@lucide/svelte/icons/mail";
  import PannelBottomIcon from "@lucide/svelte/icons/panel-bottom";
  import StarIcon from "@lucide/svelte/icons/star";
  import Plus from "@lucide/svelte/icons/plus";
  import MinusIcon from "@lucide/svelte/icons/minus";
  import { dragHandle, dragHandleZone } from "svelte-dnd-action";

  import { buttonVariants } from "@/components/ui/button";
  import { Button } from "@/components/ui/button";
  import { flip } from "svelte/animate";

  let flipDurationMs = 100;

  const blockTypeMap = {
    hero: { icon: StarIcon, label: "Hero", description: "Main banner section" },
    image: { icon: ImageIcon, label: "Image", description: "Visual content" },
    paragraph: {
      icon: FileTextIcon,
      label: "Text",
      description: "Rich text content",
    },
    contactForm: { icon: MailIcon, label: "Form", description: "Contact form" },
    footer: {
      icon: PannelBottomIcon,
      label: "Footer",
      description: "Page footer",
    },
    separator: {
      icon: MinusIcon,
      label: "Separator",
      description: "Divider line",
    },
  };

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
    blocks = blocks.filter((block) => block.id !== id);
  }

  function hasProps(blockType: keyof typeof snippets): boolean {
    const schema = schemas[blockType];
    return Object.keys(schema.entries).length > 0;
  }
</script>

<div
  class="h-[100svh] fixed max-h-[100svh] overflow-hidden flex flex-col w-full p-1"
>
  <Tabs.Root
    bind:value={currentMode}
    class="flex flex-col w-full h-full place-self-center p-4"
  >
    <Tabs.List class="grid w-full grid-cols-2 max-w-lg place-self-center">
      <Tabs.Trigger value="edit">Edit Mode</Tabs.Trigger>
      <Tabs.Trigger value="preview">Preview Mode</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="edit" class="flex flex-col gap-6 w-full h-full ">
      <div class="space-y-4 w-full">
        <h3 class="text-lg font-semibold text-center text-gray-800 m-0 my-4">
          Add Content Blocks
        </h3>
        <div
          class="flex gap-3 overflow-x-scroll w-full lg:w-full lg:grid lg:grid-cols-6 lg:overflow-x-visible max-w-6xl mx-auto p-2"
        >
          {#each Object.entries(blockTypeMap) as [type, blockType]}
            <button
              onclick={() => addBlock(type as keyof typeof snippets)}
              class="group relative flex min-w-auto md:min-w-[170px] flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 flex-shrink-0"
            >
              <div
                class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors mb-2"
              >
                <blockType.icon
                  class="h-6 w-6 text-gray-600 group-hover:text-gray-800"
                />
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-900 mb-1">
                  {blockType.label}
                </div>
                <div class="text-xs text-gray-500 leading-tight">
                  {blockType.description}
                </div>
              </div>
              <div
                class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus
                  class="h-4 w-4 text-gray-600 bg-white rounded-full border border-gray-200"
                />
              </div>
            </button>
          {/each}
        </div>
      </div>

      <div class="flex gap-2 justify-center">
        <Button
          onclick={exportToFile}
          variant="default"
          size="sm"
          class="flex items-center gap-2 w-24 h-10"
        >
          <Save class="h-4 w-4" />
          Save
        </Button>
        <Button
          onclick={importFromFile}
          variant="default"
          size="sm"
          class="flex items-center gap-2 w-24 h-10"
        >
          <Upload class="h-4 w-4" />
          Import
        </Button>
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
            in:scale={{ duration: 150 }}
            class="flex items-center gap-3 min-h-14 p-3 rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-200 relative"
            data-drag-disabled="true"
          >
            <button
              onclick={() => deleteBlock(block.id)}
              class="absolute -top-2 -right-2 size-5 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center shadow-sm transition-colors z-10"
              title="Delete block"
            >
              <Trash class="size-3" />
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
                <div class="flex items-center gap-2 grow mx-3">
                  {#if blockTypeMap[block.type]}
                    {@const BlockIcon = blockTypeMap[block.type].icon}
                    <BlockIcon class="h-4 w-4 text-gray-600"></BlockIcon>
                    <span>{blockTypeMap[block.type].label}</span>
                  {:else}
                    <span>{block.type}</span>
                  {/if}
                </div>
                {#if hasProps(block.type)}
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
                {/if}
              </div>

              {#if hasProps(block.type)}
                <Collapsible.Content
                  class="space-y-2 w-full mt-4 overflow-visible"
                >
                  <SchemaForm
                    id={block.id}
                    schema={schemas[block.type]}
                    bind:values={block.props}
                  />
                </Collapsible.Content>
              {/if}
            </Collapsible.Root>
          </div>
        {/each}
      </div>
    </Tabs.Content>

    <Tabs.Content value="preview" class="grow overflow-y-auto ">
      <Card.Root
        class="overflow-y-auto flex flex-col grow my-5 p-2 place-self-center w-full max-w-2xl"
      >
        <Card.Content>
          {#each blocks as block}
            {@render block.block(block.props)}
          {/each}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>

  <!-- <Preview> -->
</div>

<!-- </Preview> -->
