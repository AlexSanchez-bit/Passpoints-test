<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from "vue";
import { supabase } from "../../lib/supabase";
import NoteEditor from "./NoteEditor.vue";
import NotesGrid from "./NotesGrid.vue";
import { useAuthStore } from "../../stores/auth";
import { useToast } from "primevue/usetoast";

interface Note {
  id: number;
  text: string;
  color: string;
}
const toast = useToast();

const { user } = useAuthStore();

const notes = reactive<Note[]>([]);

onMounted(async () => {
  for (let i = 0; i < 10; i++) {
    const skeleton_note = {
      id: i,
      text: "",
      color: `skeleton`,
    };
    notes.push(skeleton_note);
  }

  const { data, error } = await supabase
    .from("notes")
    .select("id,color,content")
    .eq("user_i", user.id);

  removeSkeletonColors();

  if (!error) {
    data.forEach((note: any) => {
      notes.push({
        id: note.id,
        text: note.content,
        color: `#${note.color}`,
      });
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Info",
      detail: "Error leyendo notas",
      life: 3000,
    });
  }
});

function removeSkeletonColors() {
  for (let i = notes.length - 1; i >= 0; i--) {
    if (notes[i].color === "skeleton") {
      notes.splice(i, 1);
    }
  }
}

const handleNoteAdd = async (noteText: string, noteColor: string) => {
  const skeleton_note = {
    id: Date.now(),
    text: noteText,
    color: `skeleton`,
  };
  notes.unshift(skeleton_note);
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
  } else {
    toast.add({
      severity: "error",
      summary: "Info",
      detail: "Error insertando nota",
      life: 3000,
    });
  }
  notes.splice(notes.indexOf(skeleton_note), 1);
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
