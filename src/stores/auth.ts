import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { supabase } from "../lib/supabase";
import { isAuthError } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const isauth = ref<boolean>(false); /** Inner state of authness **/
  const user = ref<{ id: string; name: string; email: string } | null>(null);

  try {
    user.value = JSON.parse(localStorage.getItem("user") ?? "null") as {
      id: string;
      name: string;
      email: string;
    };
  } catch (e) {}

  supabase.auth.getSession().then((val: any) => {
    if (val?.data?.session) {
      isauth.value = true;
    }
  });

  const login = async (login_request: any) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "passpoints-login",
        {
          body: login_request,
        },
      );

      if (data && data.success) {
        await supabase.auth.setSession(data.session.session);
        isauth.value = true;
        user.value = {
          id: data.session.user.id,
          name: data.user.username,
          email: data.session.user.email,
        };
        localStorage.setItem("user", JSON.stringify(user.value));
      }
      return { data, error };
    } catch (e) {
      console.log(e);
    }
  };

  const register = async (register_request: any) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "passpoints-register",
        {
          body: register_request,
        },
      );
      if (data && data.success) {
        await supabase.auth.setSession(data.session.session);
        isauth.value = true;
        user.value = {
          id: data.session.user.id,
          name: register_request.username,
          email: data.session.user.email,
        };
        localStorage.setItem("user", JSON.stringify(user.value));
      }
      return { data, error };
    } catch (e) {}
  };

  const authenticated = computed(() => {
    return isauth.value;
  });

  const logout = async () => {
    await supabase.auth.signOut();
    isauth.value = false;
  };

  return { login, authenticated, user, register, logout };
});
