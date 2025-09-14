<script lang="ts">
  import { snippets, schemas } from "$lib";
  import * as Tabs from "@/components/ui/tabs/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import SchemaForm from "$lib/utils/schema-form.svelte";
  import * as v from "valibot";
  import * as Card from "$lib/components/ui/card/index.js";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { dragHandle, dragHandleZone } from "svelte-dnd-action";
  import { buttonVariants, Button } from "@/components/ui/button";

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

  const FLIP_DURATION_MS = 100;

  const BLOCK_TYPE_CONFIG = {
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

  type ContentBlock = {
    id: string;
    type: keyof typeof snippets;
    block: (typeof snippets)[keyof typeof snippets];
    props: any;
  };

  let contentBlocks: ContentBlock[] = $state([
    {
      id: "demo1",
      type: "hero",
      block: snippets.hero,
      props: { title: "Hello" },
    },
  ]);

  function addContentBlock(blockType: keyof typeof snippets) {
    const defaultProps = v.parse(schemas[blockType], {});
    const blockId = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString();
    contentBlocks.push({
      id: blockId,
      type: blockType,
      block: snippets[blockType],
      props: defaultProps,
    });
  }

  function serializeContentBlocks() {
    const serializedBlocks = contentBlocks.map((block) => ({
      id: block.id,
      type: block.type,
      props: block.props,
    }));

    return JSON.stringify(serializedBlocks, null, 2);
  }

  function deserializeContentBlocks(jsonData: string) {
    const parsedBlocks = JSON.parse(jsonData) as Array<{
      id: string;
      type: keyof typeof snippets;
      props: any;
    }>;

    contentBlocks = parsedBlocks.map((blockData) => ({
      ...blockData,
      block: snippets[blockData.type],
    }));
  }

  function exportToFile() {
    const jsonData = serializeContentBlocks();
    const blob = new Blob([jsonData], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = `hama-blocks-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);
  }

  function importFromFile() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.onchange = (event) => {
      const selectedFile = (event.target as HTMLInputElement).files?.[0];
      if (!selectedFile) return;

      const fileReader = new FileReader();
      fileReader.onload = (loadEvent) => {
        try {
          const fileContent = loadEvent.target?.result as string;
          deserializeContentBlocks(fileContent);
        } catch (error) {
          console.error("Error importing file:", error);
          alert(
            "Error importing file. Please check that it's a valid JSON file."
          );
        }
      };
      fileReader.readAsText(selectedFile);
    };

    fileInput.click();
  }

  function handleBlockReorder(event: CustomEvent) {
    contentBlocks = event.detail.items;
  }

  function deleteContentBlock(blockId: string) {
    contentBlocks = contentBlocks.filter((block) => block.id !== blockId);
  }

  function blockHasConfigurableProps(
    blockType: keyof typeof snippets
  ): boolean {
    const blockSchema = schemas[blockType];
    return Object.keys(blockSchema.entries).length > 0;
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
    <Tabs.Content value="edit" class="flex flex-col gap-6 w-full h-full">
      <div class="space-y-4 w-full">
        <h3 class="text-lg font-semibold text-center text-gray-800 m-0 my-4">
          Add Content Blocks
        </h3>
        <div
          class="flex gap-3 overflow-x-scroll w-full lg:w-full lg:grid lg:grid-cols-6 lg:overflow-x-visible max-w-6xl mx-auto p-2"
        >
          {#each Object.entries(BLOCK_TYPE_CONFIG) as [type, blockConfig]}
            <button
              onclick={() => addContentBlock(type as keyof typeof snippets)}
              class="group relative flex min-w-auto md:min-w-[170px] flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 flex-shrink-0"
            >
              <div
                class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors mb-2"
              >
                <blockConfig.icon
                  class="h-6 w-6 text-gray-600 group-hover:text-gray-800"
                />
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-900 mb-1">
                  {blockConfig.label}
                </div>
                <div class="text-xs text-gray-500 leading-tight">
                  {blockConfig.description}
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
          items: contentBlocks,
          flipDurationMs: FLIP_DURATION_MS,
        }}
        onconsider={handleBlockReorder}
        onfinalize={handleBlockReorder}
      >
        {#each contentBlocks as block (block.id)}
          <div
            animate:flip={{ duration: FLIP_DURATION_MS }}
            in:scale={{ duration: 150 }}
            class="flex items-center gap-3 min-h-14 p-3 rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-200 relative"
            data-drag-disabled="true"
          >
            <button
              onclick={() => deleteContentBlock(block.id)}
              class="absolute -top-2 -right-2 size-5 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center shadow-sm transition-colors z-10"
              title="Delete block"
            >
              <Trash class="size-3" />
            </button>
            <Collapsible.Root class="flex w-full flex-col h-full items-center">
              <div class="flex w-full h-full items-center">
                <div
                  use:dragHandle
                  class="drag-handle cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0"
                  data-drag-disabled="false"
                >
                  <GripVertical class="h-5 w-5" />
                </div>
                <div class="flex items-center gap-2 grow mx-3">
                  {#if BLOCK_TYPE_CONFIG[block.type]}
                    {@const BlockIcon = BLOCK_TYPE_CONFIG[block.type].icon}
                    <BlockIcon class="h-4 w-4 text-gray-600"></BlockIcon>
                    <span>{BLOCK_TYPE_CONFIG[block.type].label}</span>
                  {:else}
                    <span>{block.type}</span>
                  {/if}
                </div>
                {#if blockHasConfigurableProps(block.type)}
                  <Collapsible.Trigger
                    class={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      class:
                        "w-9 p-0 hover:scale-105 active:scale-95 transition-transform duration-150 hover:bg-gray-100 active:bg-gray-200",
                    })}
                  >
                    <PenIcon class="transition-colors duration-150" />
                    <span class="sr-only">Toggle</span>
                  </Collapsible.Trigger>
                {/if}
              </div>

              {#if blockHasConfigurableProps(block.type)}
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

    <Tabs.Content value="preview" class="grow overflow-y-auto">
      <Card.Root
        class="overflow-y-auto flex flex-col grow my-5 p-2 place-self-center w-full max-w-2xl"
      >
        <Card.Content>
          {#each contentBlocks as block}
            {@render block.block(block.props)}
          {/each}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</div>
