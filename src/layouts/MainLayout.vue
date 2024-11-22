<template>
  <main class="min-h-screen">
    <div class="card sticky top-0 z-30">
      <Menubar :model="items" />
    </div>
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const { authenticated } = storeToRefs(useAuthStore());

const router = useRouter();

const items = reactive([
  {
    label: "Principal",
    icon: "pi pi-home",
  },
  {
    label: "Login",
    icon: "pi pi-star",
    command: () => {
      router.push({ name: "login" });
    },
  },
  {
    label: "Registro",
    icon: "pi pi-star",
    command: () => {
      router.push({ name: "register" });
    },
  },
  {
    label: "Registro",
    icon: "pi pi-search",
    items: [
      {
        label: "Components",
        icon: "pi pi-bolt",
      },
      {
        label: "Blocks",
        icon: "pi pi-server",
      },
      {
        label: "UI Kit",
        icon: "pi pi-pencil",
      },
      {
        label: "Templates",
        icon: "pi pi-palette",
        items: [
          {
            label: "Apollo",
            icon: "pi pi-palette",
          },
          {
            label: "Ultima",
            icon: "pi pi-palette",
          },
        ],
      },
    ],
  },
  {
    label: "Contacto",
    icon: "pi pi-envelope",
  },
]);

watch(authenticated, (newv: boolean) => {
  if (newv) {
    items[1] = {
      label: "Login",
      icon: "pi pi-star",
      command: () => {
        router.push({ name: "login" });
      },
    };
  } else {
    items[1] = {
      label: "Login",
      icon: "pi pi-star",
      command: () => {
        router.push({ name: "login" });
      },
    };
  }
});
</script>

<style scoped>
::v-deep .p-menubar {
  background: black;
  color: white;
}
::v-deep .p-menubar span {
  color: white;
}
</style>
