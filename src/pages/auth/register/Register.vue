<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:w-3/5">
    <div
      id="step1"
      class="flex flex-col gap-6 py-6 px-3 items-center md:start-start"
    >
      <FloatLabel class="w-full">
        <label for="name">Usuario</label>
        <Input id="name" class="w-full" v-model="userName"></Input>
      </FloatLabel>
      <FloatLabel class="w-full">
        <label for="mail">Correo</label>
        <Input id="mail" type="email" class="w-full" v-model="userMail"></Input>
      </FloatLabel>
      <div class="flex flex-col">
        <div id="step2" class="flex items-center gap-2">
          <Checkbox v-model="share_accepted" inputId="share" binary />
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
    <div id="step3" class="w-full flex flex-col gap-2">
      <div id="">
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
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
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
    const { data, error } = await useAuthStore().register(register_request);
    if (data && !data.success) {
      showError(map_error(data.message));
    } else {
      supabase.auth.setSession(data.session);
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
}

if (localStorage.getItem("register_tutorail") == null) {
  startTour();
  localStorage.setItem("register_tutorail", "checked");
}

function startTour() {
  const steps = [
    {
      popover: {
        title: "Bienvenido",
        description:
          "Este es el registro de su contraseña basada en Passpoints",
        position: "center",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
    },
    {
      element: "#step1",
      popover: {
        title: "Informaciòn de Usuario",
        description: "Debe introducir su informaciòn de identificaciòn",
        position: "bottom",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
    },
    {
      element: "#step2",
      popover: {
        title: "Aceptar compartir sus datos",
        description:
          "Al usar este servicio estrà cediendo su contraseña para un estudio acadèmico sobre este sistema, no es recomendable guardar informaciòn sensible",
        position: "right",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
    },
    {
      element: "#step3",
      popover: {
        title: "Contraseña",
        description: "Aquì deberà insertar y confirmar su contraseña",
        position: "top",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
    },
    {
      element: "#passpoint1",
      popover: {
        title: "Introducir una contraseña",
        description:
          "Aquì deberà insertar y confirmar su contraseña,esta consistirà en una selecciòn de 5 puntos donde el orden de estos importa",
        position: "top",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
    },
    {
      element: "#passpoint1 .image-selector",
      popover: {
        title: "Cambiar imagen",
        description:
          "Aqui puede cambiar la imagen para su contraseña, basta con navegar y dar click en la imagen que desee",
        position: "top",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
    },
    {
      element: "#passpoint1 .image-change",
      popover: {
        title: "selector de imagen",
        description: "Activa el selector de imagen en caso de querer cambiarla",
        position: "top",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
      onHighlightStarted: (element: Element, step: DriveStep, options: any) => {
        console.log(element.style, element.dispatchEvent);
        element.classList.remove("ui");
      },
      onDeselected: (element: Element, step: DriveStep, options: any) => {
        console.log(element.style, element.dispatchEvent);
        element.classList.add("ui");
      },
    },
    {
      element: "#passpoint1 .toggle-show",
      popover: {
        title: "Ver puntos",
        description:
          "En esta opcion puede hacer que se muestren/oculten los puntos seleccionados",
        position: "top",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
      onHighlightStarted: (element: Element, step: DriveStep, options: any) => {
        console.log(element.style, element.dispatchEvent);
        element.classList.remove("ui");
      },
      onDeselected: (element: Element, step: DriveStep, options: any) => {
        console.log(element.style, element.dispatchEvent);
        element.classList.add("ui");
      },
    },
    {
      element: "#passpoint1 .toggle-fullscreen",
      popover: {
        title: "Pantalla completa",
        description: "Ponga el selector a pantalla completa",
        position: "top",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
      onHighlightStarted: (element: Element, step: DriveStep, options: any) => {
        console.log(element.style, element.dispatchEvent);
        element.classList.remove("ui");
      },
      onDeselected: (element: Element, step: DriveStep, options: any) => {
        console.log(element.style, element.dispatchEvent);
        element.classList.add("ui");
      },
    },
  ];
  const _driver = driver({
    showProgress: true,
    smoothScroll: true,
    animate: true,
    steps,
  });

  _driver.drive();
}
</script>
