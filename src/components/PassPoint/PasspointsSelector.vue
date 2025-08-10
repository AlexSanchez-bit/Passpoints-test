<template>
  <div @click="selectPoint" class="relative w-full h-full" ref="imagecontainer">
    <img :src="image" class="w-full h-full min-w-48 min-h-48" draggable="false" alt="" />

    <transition-group name="fade" tag="div">
      <div
        v-for="(indicator, index) in indicators"
        :key="index"
        class="absolute bg-red-600 border-solid border-red-100 -translate-x-1/2 -translate-y-1/2"
        :style="{
          top: `${indicator.y}%`,
          left: `${indicator.x}%`,
          width: `${indicatorsSize}px`,
          height: `${indicatorsSize}px`,
        }"
        :class="{
          'opacity-80': show,
          'opacity-0': !show,
        }"
      ></div>
    </transition-group>

    <div
      class="absolute ui transition-all duration-300 -bottom-2 left-1/2 -translate-x-1/2"
    >
      <Button
        raised
        rounded
        aria-label="Filter"
        icon="pi pi-undo"
        @click.stop="removeLast"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  toRefs,
  reactive,
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { Point } from "../../types/password";

const props = defineProps<{
  image: string | null;
  size: number;
  show: boolean;
  fullScreen: boolean;
}>();

const { size, image, show, fullScreen } = toRefs(props);
const indicators = reactive<{ x: number; y: number }[]>([]);
const imagecontainer = ref(null);

function removeLast() {
  if (indicators.length <= 0) return;
  indicators.length = indicators.length - 1;
  emit("update:passpoints", [...indicators]);
}

const emit = defineEmits<{
  (e: "update:passpoints", passpoints: Point[]);
}>();

function selectPoint(event: PointerEvent) {
  if (indicators.length >= 5) return;
  const { left, top, width, height } =
    imagecontainer.value.getBoundingClientRect();
  indicators.push({
    x: ((event.clientX - left) / width) * 100,
    y: ((event.clientY - top) / height) * 100,
  });
  emit("update:passpoints", [...indicators]);
}

const indicatorsSize = ref(0);

const resizeObserver = new ResizeObserver(() => {
  const { width, height } = imagecontainer.value?.getBoundingClientRect();
  indicatorsSize.value = size.value * Math.min(width, height);
});

onMounted(async () => {
  resizeObserver.observe(imagecontainer.value);
  const { width, height } = imagecontainer.value.getBoundingClientRect();
  indicatorsSize.value = size.value * Math.min(width, height);
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter {
  opacity: 0;
  transform: scale(0); /* Comienza desde escala 0 */
}

.fade-leave-to /* .fade-leave-active en versiones anteriores de Vue */ {
  opacity: 0;
}
</style>
