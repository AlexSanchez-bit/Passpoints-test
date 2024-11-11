<template>
  <div class="card flex justify-center items-center px-4 max-h-screen py-6">
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
          />
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  image: string | null;
}>();
const emit = defineEmits<{
  (e: "update:image", selectedImage: string): void;
}>();

const products = ref(["disney.jpeg", "cars.jpeg", "japan.jpg"]);
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
  emit("update:image", image);
}
</script>
