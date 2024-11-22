<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  color: string;
  children: string;
}>();

const { children, color } = props;

const emit = defineEmits(["delete"]);

const handleDelete = () => {
  emit("delete");
};
</script>

<template>
  <article
    class="note w-full max-h-96 truncate"
    :style="{ backgroundColor: color }"
  >
    <slot>span</slot>
    <button class="note__delete-button" type="button" @click="handleDelete">
      x
    </button>
  </article>
</template>

<style scoped>
.note {
  background: #f2e379;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: box-shadow 0.2s;
}
.note:hover {
  box-shadow:
    0px 10px 20px rgba(0, 0, 0, 0.19),
    0px 6px 6px rgba(0, 0, 0, 0.24);
}
.note__delete-button {
  font-family: inherit;
  font-size: inherit;
  border: none;
  background-color: transparent;
  position: absolute;
  right: 5px;
  top: 0;
  cursor: pointer;
}
</style>
