<template>
  <div
    class="justify-center ui-container flex items-center p-3 box-border transition-all duration-500"
    :class="{
      relative: !fullScreen,
      'w-full': !fullScreen,
      'h-full': !fullScreen,
      fixed: fullScreen,
      'top-0': fullScreen,
      'left-0': fullScreen,
      'w-screen': fullScreen,
      'h-screen': fullScreen,
      'z-40': fullScreen,
      'p-4': fullScreen,
      'backdrop-blur': fullScreen,
    }"
  >
    <PasspointsSelector
      :size="29"
      :image="image"
      v-if="image != null && image != ''"
    />
    <ImageSelector :image="image" @update:image="changeImage" v-else />

    <div class="absolute ui transition-all duration-300 bottom-3 right-0">
      <Button
        @click="fullScreen = !fullScreen"
        variant="text"
        raised
        rounded
        aria-label="Filter"
        icon="pi pi-window-maximize"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import ImageSelector from "./ImageSelector.vue";
import PasspointsSelector from "./PasspointsSelector.vue";

const fullScreen = ref(false);

const props = defineProps<{
  image: string | null;
}>();
const emit = defineEmits<{
  (e: "update:image", selectedImage: string): void;
  (e: "update:passpoints", selectedImage: string): void;
}>();

const image = ref(props.image);
function changeImage(newImage: string) {
  image.value = newImage;
  emit("update:image", newImage);
}

console.log(image);
</script>

<style scoped>
.ui {
  display: none;
}
.ui-container:hover .ui {
  display: block;
}
</style>
