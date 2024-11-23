<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/auth";

import { ref } from "vue";
const props = defineProps<{
  color: string;
  children: string;
}>();

const { color } = props;
const loading = ref(false);

const emit = defineEmits(["delete"]);

const handleDelete = async () => {
  loading.value = true;
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("user_i", useAuthStore().user.id);
  loading.value = false;
  if (!error) {
    emit("delete");
  }
};
</script>

<template>
  <article
    class="w-full relative truncate transition-all p-4 rounded-md duration-150 ease-out hover:shadow-md cursor-text"
    :style="{ backgroundColor: color }"
  >
    {{ loading }}
    <slot></slot>
    <div class="absolute right-2 top-0 z-10">
      <Button
        :loading="loading"
        icon="pi pi-times"
        severity="danger"
        variant="text"
        rounded
        aria-label="Cancel"
        type="button"
        @click="handleDelete"
      />
    </div>
  </article>
</template>

<style scoped></style>
