<template>
  <div class="w-2/6">
    <PasspointsCollector v-model:image="selectedImage" />
    <PasspointsCollector v-model:image="selectedImage" />
  </div>
</template>

<script setup lang="ts">
import PasspointsCollector from "../../../components/PassPoint/PasspointCollector.vue";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
const toast = useToast();

const selectedImage = ref("");

const show = () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Message Content",
    life: 3000,
  });
};
</script>
