<template>
  <main class="min-h-screen">
    <div class="card sticky top-0 z-30">
      <Menubar class="menu" :model="items" />
    </div>
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const { authenticated, user } = storeToRefs(useAuthStore());

const router = useRouter();

const items = reactive([
  {
    label: "Principal",
    icon: "pi pi-home",
    command: () => {
      router.push({ name: "home" });
    },
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
    label: "Contacto",
    icon: "pi pi-envelope",
  },
]);

watch(authenticated, (newv: boolean) => {
  if (newv) {
    items[3] = {
      label: user.value.name,
      icon: "pi pi-star",
      command: () => {
        router.push({ name: "login" });
      },
    };
  } else {
    items[1] = {
      label: "Login",
      icon: "pi pi-user",
      command: () => {
        router.push({ name: "login" });
      },
    };
  }
});
</script>

<style scoped>
::v-deep .p-menubar {
  background: #059669;
}
::v-deep .p-menubar-item-label {
  color: #ffffff;
}
::v-deep .menu .pi {
  color: #ffffff;
}
::v-deep .menu .p-icon {
  color: #ffffff;
}
::v-deep .p-menubar-mobile .p-menubar-root-list {
  background: #059669;
}
</style>
