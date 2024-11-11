<template>
  <div class="relative" ref="imagecontainer">
    <img :src="image" alt="" @click="selectPoint" />
    <div
      v-for="(indicator, index) in indicators"
      :key="index"
      class="absolute bg-red-200 opacity-80 -translate-x-1/2 -translate-y-1/2"
      :style="{
        top: `${indicator.y}%`,
        left: `${indicator.x}%`,
        width: `${size}px`,
        height: `${size}px`,
      }"
    ></div>
  </div>
  <!-- <canvas class="w-full h-full">sas</canvas> -->
</template>

<script setup lang="ts">
import { toRefs, reactive, ref, computed } from "vue";

const props = defineProps<{
  image: string | null;
  size: number;
}>();

const { size, image } = toRefs(props);
const indicators = reactive<{ x: number; y: number }[]>([]);
const imagecontainer = ref(null);

function selectPoint(event: PointerEvent) {
  if (indicators.length >= 5) return;
  const { left, top, width, height } =
    imagecontainer.value.getBoundingClientRect();
  indicators.push({
    x: ((event.clientX - left) / width) * 100,
    y: ((event.clientY - top) / height) * 100,
  });
}
</script>
