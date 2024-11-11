<template>
  <div class="w-full h-full justify-center items-center">
    <ImageSelector />
  </div>
</template>

<script setup lang="ts">
import ImageSelector from "./ImageSelector.vue";

const props = defineProps<{
  selectedImage: string;
}>();
const emit = defineEmits<{
  (e: "update:image", selectedImage: string): void;
  (e: "update:passpoints", selectedImage: string): void;
}>();
</script>
