<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:w-3/5">
    <div class="flex flex-col gap-6 py-6 px-3 items-center md:start-start">
      <FloatLabel class="w-full">
        <label for="mail">Mail</label>
        <Input
          @input="touched = true"
          id="mail"
          type="email"
          class="w-full"
          v-model="userMail"
        ></Input>
      </FloatLabel>
      <div>
        <Button
          class="w-full"
          type="button"
          :disabled="!validForm"
          label="Iniciar Sesión"
          :loading="loading"
          @click="login"
        />
        <small v-if="touched" class="text-red-400 text-xs">{{
          errorMessage
        }}</small>
      </div>
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
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth";
import { Regex } from "lucide-vue-next";
const toast = useToast();
const touched = ref(false);

const router = useRouter();

const userMail = ref<string>(null);

const password = ref<PasswordInfo | null>(null);
const errorMessage = ref("");

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
  const emailRegex =
    /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  if (!userMail.value || !emailRegex.test(userMail.value)) {
    errorMessage.value = "Introduzca un correo válido";
  } else if (password.value?.points.length != 5) {
    errorMessage.value = " La contraseña debe tener 5 puntos";
  } else {
    errorMessage.value = "";
  }
  return (
    password.value?.points.length == 5 &&
    userMail.value &&
    emailRegex.test(userMail.value)
  );
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
