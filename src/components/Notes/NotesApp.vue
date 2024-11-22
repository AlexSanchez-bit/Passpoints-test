<script setup lang="ts">
import { ref, onMounted, watch, reactive } from "vue";
import NoteEditor from "./NoteEditor.vue";
import NotesGrid from "./NotesGrid.vue";

interface Note {
  id: number;
  text: string;
  color: string;
}

const notes = reactive<Note[]>([]);

onMounted(() => {
  const localNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  if (localNotes) {
    localNotes.forEach((note) => {
      notes.push(note);
    });
  }
});

watch(
  notes,
  (newNotes) => {
    localStorage.setItem("notes", JSON.stringify(newNotes));
  },
  { deep: true },
);

const handleNoteAdd = (noteText: string, noteColor: string) => {
  notes.value.unshift({
    id: Date.now(),
    text: noteText,
    color: `#${noteColor}`,
  });
};

const handleNoteDelete = (note: Note) => {
  notes.value = notes.value.filter((_note) => _note.id !== note.id);
};
</script>

<template>
  <div class="mx-auto flex items-center justify-start flex-col gap-4 p-4">
    <NoteEditor @note-add="handleNoteAdd" />
    <NotesGrid :notes="notes" @note-delete="handleNoteDelete" />
  </div>
</template>

<style scoped>
/* Your CSS for notes app */
</style>
