<template>
  <div>
    <PasspointsCollector class="w-96" />
    <PasspointsCollector class="w-96" />
  </div>
</template>

<script setup lang="ts">
import PasspointsCollector from "../../../components/PassPoint/PasspointCollector.vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const show = () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Message Content",
    life: 3000,
  });
};
</script>
