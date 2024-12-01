<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
  >
    <div class="container mx-auto px-4 py-16">
      <header class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
          Implementación de un sistema de autenticación gráfica basado en
          Passpoints
        </h1>
        <p class="text-xl text-white opacity-90">
          Seguro, Intuitivo, y Fácil de usar
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card
          v-for="feature in features"
          :key="feature.title"
          class="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 p-2 rounded-lg shadow-zinc-300 hover:scale-110"
        >
          <template #header>
            <div class="flex items-center justify-center mb-4">
              <component
                :is="feature.icon"
                class="w-10 h-10"
                :style="{ color: feature.iconColor }"
              />
            </div>
            <h2 class="text-xl font-bold text-gray-800 text-center">
              {{ feature.title }}
            </h2>
          </template>
          <template #content>
            <p class="text-gray-600">{{ feature.description }}</p>
          </template>
        </Card>
      </div>

      <div class="flex flex-row gap-3 items-center justify-center">
        <Button
          as="a"
          href="https://revistatelematica.cujae.edu.cu/index.php/tele/article/view/970"
          label="Aprender mas sobre esta implementación"
          class="p-button-lg bg-white text-purple-600 hover:bg-purple-100"
        />
        <Button
          as="router-link"
          :to="{ name: 'register' }"
          label="Comenzar a usar el sistema"
          class="p-button-lg bg-white text-purple-600 hover:bg-purple-100"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import {
  MousePointer,
  ShieldCheck,
  Zap,
  Fingerprint,
  Lock,
} from "lucide-vue-next";

const features = ref([
  {
    icon: MousePointer,
    iconColor: "#9333ea", // purple-600
    title: "Selección Intuitiva",
    description:
      "Su contraseña consistirá en una selección de 5 puntos de una imagen donde el ¡ORDEN IMPORTA!",
  },
  {
    icon: ShieldCheck,
    iconColor: "#16a34a", // green-600
    title: "Mejor Seguridad",
    description:
      "Passpoints tiene un espacio de contraseñas mayor, por lo que su autenticación será más segura sin tener que recordar tediosas y largas contraseñas",
  },
  {
    icon: Zap,
    iconColor: "#ca8a04", // yellow-600
    title: "Fácil de recordar",
    description:
      "Passpoints aprovecha la capacidad de tu cerebro para recordar patrones en imágenes, por lo que recordar una contraseña una vez registrada será casi imposible",
  },
  {
    icon: Fingerprint,
    iconColor: "#2563eb", // blue-600
    title: "Utilice patrones únicos y personalizados",
    description:
      "Seleccione los puntos más sencillos de recordar para usted de la imagen que prefiera",
  },
  {
    icon: Lock,
    iconColor: "#dc2626", // red-600
    title: "Resistente a ataques",
    description:
      "Passpoints es resistente a ataques comunes en contraseñas alfanuméricas, como ataques de diccionario y fuerza bruta ",
  },
]);
</script>

<style scoped>
/* Add any additional component-specific styles here */
</style>
