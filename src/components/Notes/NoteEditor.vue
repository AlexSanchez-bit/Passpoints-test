<script setup lang="ts">
import { ref, defineEmits } from "vue";
import Editor from "primevue/editor";
import ColorPicker from "primevue/colorpicker";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputMask from "primevue/inputmask";
const text = ref("");
const color = ref("f2e379");

const emit = defineEmits(["note-add"]);

const handleAdd = () => {
  emit("note-add", text.value, color.value);
  text.value = "";
  color.value = "f2e379";
};
</script>

<template>
  <div class="relative max-w-lg">
    <Editor v-model="text" editorStyle="height: 50vh;font-size:25px" />
    <div class="absolute bottom-0 right-0 flex flex-row items-center">
      <InputGroup>
        <InputGroupAddon>
          <ColorPicker v-model="color" />
        </InputGroupAddon>

        <InputMask
          id="color"
          v-model="color"
          mask="******"
          :style="{ background: `#${color}` }"
        />
      </InputGroup>
      <Button
        label="Añadir"
        type="button"
        @click="handleAdd"
        :disabled="!text || text == ''"
      />
    </div>
  </div>
</template>

<style scoped>
/* Your CSS for note editor */
</style>
