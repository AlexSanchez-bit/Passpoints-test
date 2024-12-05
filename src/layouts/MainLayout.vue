<template>
  <main class="min-h-screen relative">
    <div class="card sticky top-0 z-30">
      <Menubar class="menu" :model="items" />
    </div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 z-20">
      <ProgressSpinner
        v-if="session_loading"
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const { session_loading, authenticated, user } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();

const router = useRouter();

const items = reactive<any[]>([
  {
    label: "Principal",
    icon: "pi pi-home",
    command: () => {
      router.push({ name: "home" });
    },
  },
  {
    label: "Login",
    icon: "pi pi-user",
    command: () => {
      router.push({ name: "login" });
    },
  },
  {
    label: "Registro",
    icon: "pi pi-user",
    command: () => {
      router.push({ name: "register" });
    },
  },
  {
    label: "",
  },
]);

const closing = ref(false);

watch(authenticated, (newv: boolean) => {
  if (newv) {
    items[3] = {
      label: user.value.name,
      icon: "pi pi-star",
      items: [
        {
          label: "Perfil",
          icon: "pi pi-x-mark",
          command: () => {
            router.push({ name: "user-info" });
          },
        },
        {
          label: "Mis Notas",
          icon: "pi pi-x-mark",
          command: () => {
            router.push({ name: "notes" });
          },
        },
        {
          label: "Cerrar Sesión",
          icon: "pi pi-x-mark",
          command: async () => {
            closing.value = true;
            await logout();
            closing.value = false;
            router.push({ name: "login" });
          },
        },
      ],
    };
  } else {
    items[3] = {
      label: "",
    };
  }
});
</script>

<style scoped>
::v-deep .p-menubar {
  background: #059669;
}
::v-deep .p-menubar-item-link {
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
