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
    <transition-group name="bounce" tag="div">
      <div v-if="image != null && image != ''">
        <PasspointsSelector
          @update:passpoints="updatePasspoints"
          :size="passwordInfo.tolerance"
          :image="image"
          :show="showPassword"
          :fullScreen="fullScreen"
          ref="selector"
        />
      </div>
      <div v-else>
        <ImageSelector
          class="image-selector"
          @update:imageInfo="changeImageInfo"
          :image="image"
          @update:image="changeImage"
        />
      </div>
    </transition-group>
    <transition name="bounce"> </transition>

    <div
      class="absolute image-change ui transition-all duration-300 top-3 left-2"
    >
      <Button
        @click="image = null"
        raised
        rounded
        aria-label="Filter"
        icon="pi pi-window-maximize"
        class=""
      ></Button>
    </div>

    <div></div>

    <div
      class="absolute toggle-show ui transition-all duration-300 top-2 left-1/2 -translate-x-1/2"
    >
      <Button
        @click="showPassword = !showPassword"
        raised
        rounded
        aria-label="Filter"
        :icon="`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`"
      ></Button>
    </div>

    <div
      class="absolute toggle-fullscreen ui transition-all duration-300 bottom-3 right-2"
    >
      <Button
        @click="toggleFullScreen"
        raised
        rounded
        aria-label="Filter"
        :icon="`pi ${!fullScreen ? 'pi-expand' : 'pi-window-minimize'}`"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, toRefs, onMounted, onBeforeUnmount, watch } from "vue";
import ImageSelector from "./ImageSelector.vue";
import PasspointsSelector from "./PasspointsSelector.vue";
import { Point, PasswordInfo, ImageInfo } from "../../types/password";
import { subscribeGaze } from "../../lib/webgazerService";

const fullScreen = ref(false);
const showPassword = ref(true);
const points = ref<Point[]>([]);
const selector = ref();

// Gaze tracking logic
const lastPrediction = ref<{ x: number, y: number } | null>(null);
const predictionWindow = ref<{ x: number, y: number }[]>([]);
let gazeTimer: any = null;
let samplingTimer: any = null;
let unsubscribeGaze: (() => void) | null = null;

const setupGazeTracking = () => {
  unsubscribeGaze = subscribeGaze((data: any) => {
    if (data) {
      lastPrediction.value = { x: data.x, y: data.y };
    }
  });
};

const startSampling = () => {
  if (samplingTimer) return;
  samplingTimer = setInterval(() => {
    if (lastPrediction.value) {
      predictionWindow.value.push({ ...lastPrediction.value });
      if (predictionWindow.value.length > 8) {
        predictionWindow.value.shift();
      }
    }
  }, 100);

  gazeTimer = setInterval(() => {
    if (fullScreen.value && predictionWindow.value.length === 8) {
      processGazePoints();
    }
  }, 800);
};

const stopSampling = () => {
  if (samplingTimer) clearInterval(samplingTimer);
  if (gazeTimer) clearInterval(gazeTimer);
  samplingTimer = null;
  gazeTimer = null;
};

const processGazePoints = () => {
  const points = predictionWindow.value;
  if (points.length < 8) return;
  
  const avgX = points.reduce((acc, p) => acc + p.x, 0) / points.length;
  const avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;

  const maxDist = Math.max(...points.map(p => {
    return Math.sqrt(Math.pow(p.x - avgX, 2) + Math.pow(p.y - avgY, 2));
  }));

  const threshold = 50; 

  if (maxDist < threshold) {
    if (selector.value) {
      selector.value.addPoint(avgX, avgY);
    }
    predictionWindow.value = [];
  }
};

onMounted(() => {
  setupGazeTracking();
});

onBeforeUnmount(() => {
  if (unsubscribeGaze) unsubscribeGaze();
  stopSampling();
});

watch(fullScreen, (isFull) => {
  if (isFull) {
    startSampling();
  } else {
    stopSampling();
  }
});

const passwordInfo = reactive<PasswordInfo>({
  points: [],
  tolerance: 0.05,
  image: {
    width: 0,
    height: 0,
    name: "",
  },
});

const props = defineProps<{
  image: string | null;
}>();

const emit = defineEmits<{
  (e: "update:image", selectedImage: string): void;
  (e: "update:passpoints", selectedPasspoints: PasswordInfo): void;
}>();

const image = ref(props.image);
function changeImage(newImage: string) {
  image.value = newImage;
  emit("update:image", newImage);
}

const updatePasspoints = (e: Point[]) => {
  passwordInfo.points = e.map((point: Point) => {
    const { x, y } = point;
    return {
      x: Math.floor((x / 100) * passwordInfo.image.width),
      y: Math.floor((y / 100) * passwordInfo.image.height),
    };
  });
  emit("update:passpoints", { ...passwordInfo });
};

async function toggleFullScreen() {
  fullScreen.value = !fullScreen.value;
}

function changeImageInfo(imageInfo: ImageInfo) {
  passwordInfo.image = imageInfo;
  emit("update:passpoints", { ...passwordInfo });
}
</script>

<style scoped>
.ui {
  display: none;
}
.ui-container:hover .ui {
  display: block;
}

.bounce-enter-active,
.bounce-leave-active {
  transition: transform 0.2s ease-in-out;
  display: none;
}

.bounce-enter {
  transform: scale(0); /* Comienza pequeño */
}

.bounce-enter-to {
  display: block;
  transform: scale(1.1); /* Aumenta un poco más que el tamaño original */
}

.bounce-leave {
  transform: scale(1); /* Tamaño original al salir */
}

.bounce-leave-to {
  transform: scale(0); /* Se reduce a cero al salir */
}
</style>
