<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  color: string;
  children: string;
}>();

const { color } = props;

const emit = defineEmits(["delete"]);

const handleDelete = () => {
  emit("delete");
};
</script>

<template>
  <article
    class="w-full relative truncate transition-all p-4 rounded-md duration-150 ease-out hover:shadow-md cursor-text"
    :style="{ backgroundColor: color }"
  >
    <slot></slot>
    <button class="absolute right-2 top-0" type="button" @click="handleDelete">
      x
    </button>
  </article>
</template>

<style scoped></style>
