<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:w-3/5">
    <div class="flex flex-col gap-6 py-6 px-3 items-center md:start-start">
      <FloatLabel class="w-full">
        <label for="mail">Mail</label>
        <Input id="mail" type="email" class="w-full" v-model="userMail"></Input>
      </FloatLabel>
      <Button
        class="w-full"
        type="button"
        :disabled="!validForm"
        label="Iniciar Sesiòn"
        :loading="loading"
        @click="login"
      />
    </div>
    <div class="w-full flex flex-col gap-2">
      <div>
        <label for="passpoints1">Passpoints</label>
        <PasspointsCollector
          id="passpoint1"
          @update:image="(e) => (selectedImage = e)"
          :image="selectedImage"
          @update:passpoints="(e) => (password = e)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PasspointsCollector from "../../../components/PassPoint/PasspointCollector.vue";

import { useToast } from "primevue/usetoast";
import { ref, computed } from "vue";
import { PasswordInfo } from "../../../types/password";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth";
const toast = useToast();

const router = useRouter();

const userMail = ref<string>(null);

const password = ref<PasswordInfo | null>(null);

const selectedImage = ref("");
const loading = ref(false);

const showError = (message: string) => {
  toast.add({
    severity: "error",
    summary: "Info",
    detail: message,
    life: 3000,
  });
};

const validForm = computed<boolean>(() => {
  return password.value?.points.length == 5 && userMail.value;
});

async function login() {
  if (!userMail.value) {
    showError("Rellene todos los campos");
    return;
  }
  const login_request = {
    email: userMail.value,
    password: password.value,
  };

  loading.value = true;
  try {
    const { data } = await useAuthStore().login(login_request);
    console.log(data);
    if (!data || !data.success) {
      showError(map_error(data.message));
    } else {
      router.push({ name: "user-info" });
    }
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}

function map_error(err: string) {
  if (
    err ==
    "Error al registrar en Supabase Auth: A user with this email address has already been registered"
  ) {
    return "Ya hay una cuenta para este usuario";
  }
  if (err == "Passwords dont Match") {
    return "Las Contraseñas deben coincidir";
  }
  if (err == "Invalid Password" || err == "user not found") {
    return "Usuario o contraseña incorrectos";
  }
}
</script>
