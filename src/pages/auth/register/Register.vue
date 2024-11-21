<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:w-3/5">
    <div class="flex flex-col gap-6 py-6 px-3 items-center md:start-start">
      <FloatLabel class="w-full">
        <label for="name">Name</label>
        <Input id="name" class="w-full" v-model="userName"></Input>
      </FloatLabel>
      <FloatLabel class="w-full">
        <label for="mail">Mail</label>
        <Input id="mail" class="w-full" v-model="userMail"></Input>
      </FloatLabel>
      <Button @click="create">Registrar</Button>
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
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { PasswordInfo } from "../../../types/password";
import { supabase } from "../../../lib/supabase";
const toast = useToast();

const userName = ref<string>(null);
const userMail = ref<string>(null);

const password1 = ref<PasswordInfo | null>(null);
const password2 = ref<PasswordInfo | null>(null);

const selectedImage = ref("");

const showError = (message: string) => {
  toast.add({
    severity: "error",
    summary: "Info",
    detail: message,
    life: 3000,
  });
};

async function create() {
  console.log(password1.value);
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

  try {
    const resp = await supabase.functions.invoke("passpoints-register", {
      body: register_request,
    });
    console.log(resp);
  } catch (e) {
    console.log(e);
  }
}
</script>
