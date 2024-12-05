<template>
  <div
    class="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto"
  >
    <!-- Imagen de perfil -->
    <div class="relative w-32 h-32 mb-4">
      <img
        :src="profileImage"
        alt="Profile Picture"
        class="rounded-full border-4 border-primary object-cover w-full h-full"
      />
    </div>

    <!-- Información del perfil -->
    <div class="text-center">
      <input
        type="text"
        class="bg-gray-50 font-extrabold text-xl text-center border-b-zinc-100"
        v-model="name"
      />
      <p class="text-gray-500">{{ email }}</p>
    </div>

    <!-- Detalles adicionales -->
    <div class="mt-4 w-full">
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="text-gray-600">Edad:</span>
        <input
          type="number"
          class="bg-gray-50 text-gray-800 text-end border-b-zinc-100"
          v-model="age"
        />
      </div>
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="text-gray-600">Nivel institucional:</span>
        <select
          class="bg-gray-50 text-end border-none focus:border-none"
          name=""
          id=""
          v-model="institutionalLevel"
        >
          <option
            class="border-none p-4 text-center"
            v-for="inst_level in institutional_levels"
            :key="inst_level.value"
            :value="inst_level.value"
          >
            {{ inst_level.label }}
          </option>
        </select>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="text-gray-600">Género:</span>
        <select
          class="bg-gray-50 text-end font-medium border-none focus:border-none"
          name=""
          id=""
          v-model="gender"
        >
          <option
            class="border-none p-4 text-center"
            v-for="gender in genders"
            :key="gender.value"
            :value="gender.value"
          >
            {{ gender.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Botón de acción -->
    <Button
      :loading="loading"
      @click="save"
      class="mt-6 px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-md shadow-md transition duration-300"
    >
      Editar Perfil
    </Button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/auth";

import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

import { useToast } from "primevue/usetoast";
// Propiedades del perfil
const name = ref("John Doe");
const email = ref("johndoe@example.com");
const age = ref(30);
const institutionalLevel = ref("STUDENT");
const gender = ref("NONE");
const loading = ref(false);

const institutional_levels = [
  {
    value: "STUDENT",
    label: "Estudiante",
  },
  {
    value: "PROFESSIONAL",
    label: "Profesional (computación) ",
  },
  {
    value: "WORKER",
    label: "Trabajador de otra área",
  },
  {
    value: "NONE",
    label: "Prefiero no decir",
  },
];

const genders = [
  {
    value: "MALE",
    label: "Masculino",
  },
  {
    value: "FEMALE",
    label: "Femenino",
  },
  {
    value: "NONE",
    label: "Prefiero no decir",
  },
];

// Imagen de perfil genérica
const profileImage = ref("https://via.placeholder.com/150");

const { user, change_user } = useAuthStore();
const toast = useToast();

const save = async () => {
  loading.value = true;
  const reqobj = {
    username: name.value,
    email: email.value,
    age: age.value,
    gender: gender.value,
    institutional_level: institutionalLevel.value,
  };

  const { error } = await supabase
    .from("user")
    .update([reqobj])
    .eq("id", user.id);

  loading.value = false;
  if (!error) {
    toast.add({
      severity: "success",
      summary: "Editado",
      detail: "usuario editado con éxito",
      life: 3000,
    });
    const aux = { ...user };
    aux.name = name.value;
    await change_user(aux);
  }
};

onMounted(async () => {
  const { data, error } = await supabase
    .from("user")
    .select("username,email,age,gender,institutional_level")
    .eq("id", user.id);
  if (data) {
    const {
      username,
      email: usermail,
      age: uage,
      gender: ugender,
      institutional_level,
    } = data[0];
    name.value = username;
    email.value = usermail;
    age.value = uage;
    institutionalLevel.value = institutional_level;
    gender.value = ugender;
  } else {
    toast.add({
      severity: "error",
      summary: "Info",
      detail: "Ocurrió un error",
      life: 3000,
    });
  }

  if (localStorage.getItem("user_info_tutorail") == null) {
    startTour();
    localStorage.setItem("user_info_tutorail", "checked");
  }
});

function startTour() {
  const steps = [
    {
      popover: {
        title: "Perfil de Usuario",
        description:
          "Aquí podrá consultar o editar su información, por favor agrege la más posible",
        position: "center",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
    },
    {
      element: "#pv_id_1_3 ",
      popover: {
        title: "Acciones del perfil",
        description:
          "Desde aquí podrá cerrar sesión e ingresar al apartado de notas donde nos puede dejar feedback :)",
        position: "top",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
      },
      onHighlightStarted: (element: Element, step: DriveStep, options: any) => {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(event);
        console.log(element, element.dispatchEvent(event));
      },
      // onDeselected: (element: Element, step: DriveStep, options: any) => {
      //   console.log(element.style, element.dispatchEvent);
      // },
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

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #059669;
  --primary-dark: #047857;
}

.bg-primary {
  background-color: var(--primary);
}
.bg-primary-dark {
  background-color: var(--primary-dark);
}
.border-primary {
  border-color: var(--primary);
}
</style>
