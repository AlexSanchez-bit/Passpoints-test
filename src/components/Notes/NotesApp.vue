<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from "vue";
import { supabase } from "../../lib/supabase";
import NoteEditor from "./NoteEditor.vue";
import NotesGrid from "./NotesGrid.vue";
import { useAuthStore } from "../../stores/auth";

interface Note {
  id: number;
  text: string;
  color: string;
}

const { user } = useAuthStore();

const notes = reactive<Note[]>([]);

onMounted(async () => {
  const { data, error } = await supabase
    .from("notes")
    .select("id,color,content")
    .eq("user_i", user.id);
  console.log(data, error);
  if (!error) {
    console.log("llego");
    data.forEach((note: any) => {
      notes.push({
        id: note.id,
        text: note.content,
        color: `#${note.color}`,
      });
    });
  }
});

const handleNoteAdd = async (noteText: string, noteColor: string) => {
  const { error } = await supabase.from("notes").insert([
    {
      color: noteColor,
      content: noteText,
      user_i: user.id,
    },
  ]);

  if (!error) {
    notes.unshift({
      id: Date.now(),
      text: noteText,
      color: `#${noteColor}`,
    });
  }
};

const handleNoteDelete = async (note: Note) => {
  notes.splice(notes.indexOf(note), 1);
};

const reactive_notes = computed(() => {
  return [...notes];
});
</script>

<template>
  <div class="mx-auto flex items-center justify-start flex-col gap-4 p-4">
    <NoteEditor @note-add="handleNoteAdd" />
    <NotesGrid :notes="reactive_notes" @note-delete="handleNoteDelete" />
  </div>
</template>

<style scoped>
/* Your CSS for notes app */
</style>
