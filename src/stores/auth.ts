import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const authStore = defineStore("auth", () => {
  const isauth = ref<boolean>(false); /** Inner state of authness **/

  const login = async () => {
    console.log(isauth.value);
  };

  const authenticated = computed(() => {
    return isauth.value;
  });

  return { login, authenticated };
});
