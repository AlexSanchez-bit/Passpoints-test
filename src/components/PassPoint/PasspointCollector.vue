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
          @point-selected="handlePointSelected"
          :size="passwordInfo.tolerance"
          :image="image"
          :show="showPassword"
          :fullScreen="fullScreen"
          ref="selector"
        />

        <!-- Calibration Overlay -->
        <div v-if="isCalibrating" class="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div class="bg-black/60 text-white px-6 py-3 rounded-full text-xl backdrop-blur-md">
            {{ calibrationMessage }}
          </div>
          <div
            class="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg transition-all duration-500"
            :style="{
              top: calibrationPoint.y + 'px',
              left: calibrationPoint.x + 'px',
              transform: 'translate(-50%, -50%)'
            }"
          ></div>
        </div>
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
        @click="changeImage(null)"
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

    <!-- Settings Panel -->
    <div
      class="absolute top-3 right-2 ui transition-all duration-300 flex gap-2"
    >
      <Button
        @click="toggleEyeTracking"
        raised
        rounded
        :icon="isEyeTrackingEnabled ? 'pi pi-video' : 'pi pi-video-slash'"
        :class="isEyeTrackingEnabled ? 'p-button-primary' : 'p-button-danger'"
      ></Button>
      <Button
        @click="showSettings = !showSettings"
        raised
        rounded
        icon="pi pi-cog"
        class="p-button-secondary"
      ></Button>
    </div>

    <div v-if="showSettings" class="fixed top-16 right-4 z-50 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-xl backdrop-blur-md border border-gray-200 dark:border-gray-700 w-64">
      <h3 class="text-lg font-bold mb-3 dark:text-white">Ajustes Gaze</h3>

      <div class="mb-4 flex items-center gap-3 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg">
        <CheckBox
          v-model="isEyeTrackingEnabled"
          :binary="true"
          @change="syncEyeTracking"
        />
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" @click="toggleEyeTracking">
          Seguimiento Ocular
        </label>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Peso Cluster: {{ peso_cluster.toFixed(2) }}
        </label>
        <input type="range" v-model.number="peso_cluster" min="0" max="1" step="0.05" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
        <p class="text-xs text-gray-500 mt-1">Cuánto atrae el cluster la mirada.</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Peso Saliencia: {{ peso_saliencia.toFixed(2) }}
        </label>
        <input type="range" v-model.number="peso_saliencia" min="0" max="1" step="0.05" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600">
        <p class="text-xs text-gray-500 mt-1">Influencia de puntos visualmente llamativos.</p>
      </div>

      <div class="mb-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ventana (puntos): {{ windowSize }}
        </label>
        <input type="range" v-model.number="windowSize" min="5" max="40" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600">
      </div>

      <button @click="showSettings = false" class="w-full mt-2 py-1 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm transition-colors">
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, toRefs, onMounted, onBeforeUnmount, watch } from "vue";
import ImageSelector from "./ImageSelector.vue";
import PasspointsSelector from "./PasspointsSelector.vue";
import { Point, PasswordInfo, ImageInfo } from "../../types/password";
import { subscribeGaze, initWebGazer, stopWebGazer } from "../../lib/webgazerService";
import { calculateSaliency, findNearestCluster, Cluster } from "../../lib/imageAnalysis";

const props = defineProps<{
  image: string | null;
}>();

const emit = defineEmits<{
  (e: "update:image", selectedImage: string | null): void;
  (e: "update:passpoints", selectedPasspoints: PasswordInfo): void;
}>();

const fullScreen = ref(false);
const showPassword = ref(true);
const points = ref<Point[]>([]);
const selector = ref();

const image = ref(props.image);

// Saliency state
const imageSaliency = ref<{ map: number[][], clusters: Cluster[] }>({ map: [], clusters: [] });

// Configurable weights and window
const peso_cluster = ref(0.6);
const peso_saliencia = ref(0.4);
const windowSize = ref(20);
const showSettings = ref(false);
const isEyeTrackingEnabled = ref(true);

// Calibration state
const isCalibrating = ref(false);
const calibrationMessage = ref("");
const calibrationPoint = ref({ x: 0, y: 0 });

// Session data log
const sessionLog = ref<any[]>([]);

const passwordInfo = reactive<PasswordInfo>({
  points: [],
  tolerance: 0.05,
  image: {
    width: 0,
    height: 0,
    name: "",
  },
});

// Gaze tracking logic
const lastPrediction = ref<{ x: number, y: number } | null>(null);
const predictionWindow = ref<{ x: number, y: number }[]>([]);
let gazeTimer: any = null;
let samplingTimer: any = null;
let unsubscribeGaze: (() => void) | null = null;

const setupGazeTracking = () => {
  if (unsubscribeGaze) unsubscribeGaze();
  unsubscribeGaze = subscribeGaze((data: any) => {
    if (data) {
      lastPrediction.value = { x: data.x, y: data.y };
    }
  });
};

const syncEyeTracking = () => {
  if (!isEyeTrackingEnabled.value) {
    stopSampling();
    isCalibrating.value = false;
    if (unsubscribeGaze) {
      unsubscribeGaze();
      unsubscribeGaze = null;
    }
    stopWebGazer();
  } else {
    initWebGazer();
    setupGazeTracking();
    if (fullScreen.value) {
      startSampling();
    }
  }
};

const toggleEyeTracking = () => {
  isEyeTrackingEnabled.value = !isEyeTrackingEnabled.value;
  syncEyeTracking();
};

const startSampling = () => {
  if (samplingTimer || !isEyeTrackingEnabled.value) return;

  // Start calibration sequence when sampling begins
  runCalibration();

  samplingTimer = setInterval(() => {
    if (lastPrediction.value) {
      predictionWindow.value.push({ ...lastPrediction.value });
      if (predictionWindow.value.length > windowSize.value) {
        predictionWindow.value.shift();
      }
    }
  }, 100);

  gazeTimer = setInterval(() => {
    if (fullScreen.value && predictionWindow.value.length === windowSize.value && !isCalibrating.value) {
      processGazePoints();
    }
  }, 800);
};

const runCalibration = async () => {
  if (isCalibrating.value || !isEyeTrackingEnabled.value) return;
  isCalibrating.value = true;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const margin = 80; // pixels from edge for visibility

  const points = [
    { x: margin, y: margin, msg: "Mira el punto rojo (Arriba-Izquierda)" },
    { x: viewportWidth - margin, y: margin, msg: "Mira el punto rojo (Arriba-Derecha)" },
    { x: viewportWidth - margin, y: viewportHeight - margin, msg: "Mira el punto rojo (Abajo-Derecha)" },
    { x: margin, y: viewportHeight - margin, msg: "Mira el punto rojo (Abajo-Izquierda)" },
    { x: viewportWidth / 2, y: viewportHeight / 2, msg: "Finalmente, mira al centro de la imagen" }
  ];

  const webgazer = (window as any).webgazer;

  for (const point of points) {
    if (!isEyeTrackingEnabled.value) break;
    calibrationPoint.value = { x: point.x, y: point.y };
    calibrationMessage.value = point.msg;

    // Give user time to find the point
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (!isEyeTrackingEnabled.value) break;

    // Record multiple samples for this point to tell WebGazer where the eye is looking
    if (webgazer) {
      for (let i = 0; i < 5; i++) {
        webgazer.recordScreenPosition(point.x, point.y, 'calibration');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  isCalibrating.value = false;
  calibrationMessage.value = "";
  console.log("Calibration completed for current session.");
};

const stopSampling = () => {
  if (samplingTimer) clearInterval(samplingTimer);
  if (gazeTimer) clearInterval(gazeTimer);
  samplingTimer = null;
  gazeTimer = null;
};

const processGazePoints = () => {
  const points = predictionWindow.value;
  if (points.length < windowSize.value) return;

  const avgX = points.reduce((acc, p) => acc + p.x, 0) / points.length;
  const avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;

  const maxDist = Math.max(...points.map(p => {
    return Math.sqrt(Math.pow(p.x - avgX, 2) + Math.pow(p.y - avgY, 2));
  }));

  const baseThreshold = 60;
  let finalX = avgX;
  let finalY = avgY;
  let effectiveThreshold = baseThreshold;

  // Refine point using voting on saliency clusters
  if (imageSaliency.value.clusters.length > 0) {
    const clusterVotes = new Map<Cluster, number>();

    // Each point in the window votes for the nearest cluster
    points.forEach(p => {
      const nearest = findNearestCluster(p.x, p.y, imageSaliency.value.clusters, 120);
      if (nearest) {
        clusterVotes.set(nearest, (clusterVotes.get(nearest) || 0) + 1);
      }
    });

    // Find the winning cluster
    let winner: Cluster | null = null;
    let maxVotes = 0;

    for (const [cluster, votes] of clusterVotes.entries()) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = cluster;
      }
    }

    // Only apply if there's a significant consensus (e.g., more than 1/3 of points)
    if (winner && maxVotes > points.length / 3) {
      // Increase threshold (make it easier to trigger selection) based on consensus
      effectiveThreshold *= (1 + (maxVotes / points.length) * 0.5);

      // Pull prediction towards cluster center using peso_cluster
      finalX = avgX * (1 - peso_cluster.value) + winner.x * peso_cluster.value;
      finalY = avgY * (1 - peso_cluster.value) + winner.y * peso_cluster.value;

      // Additional refinement if cluster has high saliency, using peso_saliencia
      if (winner.saliency > 0.3) {
        finalX = finalX * (1 - peso_saliencia.value) + winner.x * peso_saliencia.value;
        finalY = finalY * (1 - peso_saliencia.value) + winner.y * peso_saliencia.value;
      }

      console.log(`Winning cluster with ${maxVotes} votes. Refining prediction.`);
    }
  }

  if (maxDist < effectiveThreshold) {
    if (selector.value) {
      selector.value.addPoint(finalX, finalY);
    }
    predictionWindow.value = [];
  }
};

const analyzeImage = async (imageSrc: string) => {
  // Simple hash for imageSrc to use as cache key
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return "saliency_" + h;
  };

  const cacheKey = hash(imageSrc);
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      imageSaliency.value = JSON.parse(cached);
      console.log("Loaded saliency data from local storage.");
      return;
    } catch (e) {
      console.warn("Failed to parse cached saliency data", e);
    }
  }

  console.log("Calculating image saliency map and clusters...");
  try {
    const result = await calculateSaliency(imageSrc);
    imageSaliency.value = result;
    // Only save clusters if map is too large, but user asked for both
    localStorage.setItem(cacheKey, JSON.stringify(result));
    console.log("Saliency analysis complete and saved to local storage.");
  } catch (err) {
    console.error("Saliency analysis failed:", err);
  }
};

const handlePointSelected = (data: { clientX: number; clientY: number }) => {
  if (predictionWindow.value.length === 0) {
    console.warn("No predictions available in window to calculate error.");
    return;
  }

  const selectedX = data.clientX;
  const selectedY = data.clientY;

  const errors = predictionWindow.value.map((p) => {
    const dx = selectedX - p.x;
    const dy = selectedY - p.y;
    return dx * dx + dy * dy; // Squared Error
  });

  const mse = errors.reduce((acc, err) => acc + err, 0) / errors.length;

  const logEntry = {
    timestamp: new Date().toISOString(),
    selectedPoint: { x: selectedX, y: selectedY },
    predictions: [...predictionWindow.value],
    squaredErrors: errors,
    meanSquaredError: mse,
  };

  sessionLog.value.push(logEntry);
  console.log("Point data recorded for session:", logEntry);
};

const saveToLocalFile = () => {
  if (sessionLog.value.length === 0) {
    console.log("No data recorded during this session.");
    return;
  }

  const exportData = {
    sessionSummary: {
      totalPoints: sessionLog.value.length,
      startTime: sessionLog.value[0].timestamp,
      endTime: sessionLog.value[sessionLog.value.length - 1].timestamp,
      webGazerParams: {
        regression: "threadedridge",
        kalmanFilter: {
          R: 0.5,
          Q: 0.001,
          applied: true
        }
      }
    },
    logs: sessionLog.value
  };

  const fileName = `session_passpoints_log_${new Date().getTime()}.json`;
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Clear session log after saving
  sessionLog.value = [];
  console.log("Session data exported and log cleared.");
};

onMounted(() => {
  setupGazeTracking();
  if (image.value) {
    analyzeImage(image.value);
  }
});

onBeforeUnmount(() => {
  if (unsubscribeGaze) unsubscribeGaze();
  stopSampling();
});

watch(image, (newImage) => {
  if (newImage) {
    analyzeImage(newImage);
  } else {
    imageSaliency.value = { map: [], clusters: [] };
  }
});

watch(fullScreen, (isFull) => {
  if (isFull) {
    sessionLog.value = []; // Reset for new session
    startSampling();
  } else {
    stopSampling();
    saveToLocalFile(); // Download when closing fullscreen
  }
});

function changeImage(newImage: string | null) {
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
