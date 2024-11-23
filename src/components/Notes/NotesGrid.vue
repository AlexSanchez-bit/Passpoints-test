<script setup lang="ts">
import Note from "./Note.vue";
import { defineProps, watch, defineEmits, toRefs } from "vue";
import MasonryWall from "@yeger/vue-masonry-wall";
const props = defineProps<{
  notes: { text: string; color: string; id: number }[];
}>();
const { notes } = toRefs(props);
const emit = defineEmits(["note-delete"]);

const handleDelete = (note: any) => {
  emit("note-delete", note);
};
watch(notes, (val) => {
  console.log(notes);
});
</script>

<template>
  <div class="w-full">
    <MasonryWall :items="notes" :ssr-columns="4" :column-width="400" :gap="16">
      <template #default="{ item: note }">
        <Note :color="note.color" @delete="handleDelete(note)">
          <div v-html="note.text"></div>
        </Note>
      </template>
    </MasonryWall>
  </div>
</template>

<style scoped></style>
