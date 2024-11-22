<script setup lang="ts">
import Note from "./Note.vue";
import { defineProps, defineEmits } from "vue";
import VueMasonry from "vue-masonry-css";
defineProps({
  notes: Array,
});

const emit = defineEmits(["note-delete"]);

const handleDelete = (note: any) => {
  emit("note-delete", note);
};
</script>

<template>
  <vue-masonry
    :cols="{ default: 3, '1100': 2, '700': 1 }"
    gutter="30px"
    class="h-96"
  >
    <article v-for="note in notes" :key="note.id" class="masonry-item h-96">
      <Note :color="note.color" @delete="handleDelete(note)">
        <div v-html="note.text"></div>
      </Note>
    </article>
  </vue-masonry>
</template>

<style scoped></style>
