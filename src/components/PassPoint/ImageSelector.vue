<template>
  <div class="card flex justify-center items-center px-4 max-h-screen">
    <Carousel
      :value="products"
      :numVisible="3"
      :numScroll="1"
      :responsiveOptions="responsiveOptions"
      class="h-full"
    >
      <template #item="slotProps">
        <div
          class="flex flex-row justify-center items-center cursor-pointer"
          @click="selectImage(slotProps.data)"
        >
          <img
            :src="slotProps.data"
            :alt="slotProps.data"
            class="object-cover w-auto h-auto max-h-96"
            draggable="false"
          />
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ImageInfo } from "../../types/password";
const props = defineProps<{
  image: string | null;
}>();
const emit = defineEmits<{
  (e: "update:image", selectedImage: string): void;
  (e: "update:imageInfo", info: ImageInfo): void;
}>();

const products = ref(["disney.jpeg", "cars.jpeg", "japan.jpg"]);
onMounted(() => {
  products.value = shuffle([...products.value]);
});

function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio entre 0 e i
    [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
  }
  return array;
}

const responsiveOptions = ref([
  {
    breakpoint: "2400px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "1400px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);

function selectImage(image: string) {
  const img = new Image();
  img.src = image; // Obtener la URL de la imagen
  img.onload = () => {
    const width = img.naturalWidth; // Obtener el ancho real
    const height = img.naturalHeight; // Obtener la altura real
    emit("update:imageInfo", {
      width,
      height,
      name: image.split(".")[0],
    });
    emit("update:image", image);
  };
}
</script>
