<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:w-3/5">
    <div class="flex flex-col gap-6 py-6 px-3 items-center md:start-start">
      <FloatLabel class="w-full">
        <label for="name">Name</label>
        <Input id="name" class="w-full" v-model="userName"></Input>
      </FloatLabel>
      <FloatLabel class="w-full">
        <label for="mail">Mail</label>
        <Input id="mail" type="email" class="w-full" v-model="userMail"></Input>
      </FloatLabel>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="share_accepted"
            inputId="share"
            id="share"
            binary
          />
          <label for="share"> Compartir mis datos </label>
        </div>
        <small class="text-zinc-400"
          >al aceptar sus datos como contraseñas seràn empleados para llevar a
          cabo un estudio de seguridad sobre este sistema</small
        >
      </div>
      <Button
        type="button"
        :disabled="!validForm"
        label="Registrar"
        :loading="loading"
        @click="create"
      />
    </div>
    <div class="w-full flex flex-col gap-2">
      <div>
        <label for="passpoints1">Passpoints</label>
        <PasspointsCollector
          id="passpoint1"
          @update:image="(e) => (selectedImage = e)"
          :image="selectedImage"
          @update:passpoints="(e) => (password1 = e)"
        />
      </div>
      <div>
        <label for="passpoints2">Confirmar Passpoints</label>
        <PasspointsCollector
          id="passpoint2"
          :image="selectedImage"
          @update:passpoints="(e) => (password2 = e)"
          @update:image="(e) => (selectedImage = e)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PasspointsCollector from "../../../components/PassPoint/PasspointCollector.vue";

import InputMask from "primevue/inputmask";
import Checkbox from "primevue/checkbox";
import { useToast } from "primevue/usetoast";
import { ref, computed } from "vue";
import { PasswordInfo } from "../../../types/password";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth";
const toast = useToast();
const router = useRouter();

const userName = ref<string>(null);
const userMail = ref<string>(null);

const share_accepted = ref(false);

const password1 = ref<PasswordInfo | null>(null);
const password2 = ref<PasswordInfo | null>(null);

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
  return (
    share_accepted.value &&
    password1.value?.points.length == password2.value?.points.length &&
    password2.value?.points.length == 5 &&
    !(!userName.value || !userMail.value)
  );
});

async function create() {
  if (password1.value?.image.name != password2.value?.image.name) {
    showError("Por favor use una sola imagen");
    return;
  }
  if (!userName.value || !userMail.value) {
    showError("Rellene todos los campos");
    return;
  }
  const register_request = {
    username: userName.value,
    email: userMail.value,
    password: password1.value,
    passwordConfirmation: password2.value,
  };

  loading.value = true;
  try {
    const { data, error } = useAuthStorage().register(register_request);
    if (data && !data.success) {
      showError(map_error(data.message));
    } else {
      supabase.auth.setSession(data.session);
      router.push({ name: "notes" });
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
}
</script>
