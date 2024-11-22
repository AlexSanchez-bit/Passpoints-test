<script setup lang="ts">
import Note from "./Note.vue";
import { defineProps, defineEmits, toRefs } from "vue";
import MasonryWall from "@yeger/vue-masonry-wall";
const props = defineProps<{
  notes: string[];
}>();
const { notes } = toRefs(props);
const emit = defineEmits(["note-delete"]);

const handleDelete = (note: any) => {
  emit("note-delete", note);
};

const items = [50, 75, 75, 100, 50, 50, 75, 150, 125, 175, 50, 100, 125];
</script>

<template>
  <div class="w-full">
    <MasonryWall :items="notes" :ssr-columns="4" :column-width="400" :gap="16">
      <template #default="{ item: note }">
        <Note :color="note.color">
          <div v-html="note.text"></div>
        </Note>
      </template>
    </MasonryWall>
  </div>
</template>

<style scoped></style>
