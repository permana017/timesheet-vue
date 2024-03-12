<template>
  <v-dialog v-model="isOpen" width="auto">
    <v-card class="overflow-visible pa-5 px-10" width="400">
      <div class="d-flex flex-column align-center ga-2">
        <div class="rounded-circle bg-green-accent-1">
          <v-icon
            :icon="mdiCheckCircle"
            size="70"
            color="green-accent-4"
          ></v-icon>
        </div>
        <p class="text-h6">Berhasil</p>
        <p class="text-subtitle-2">
          {{ title ?? "Berhasil Menambahkan Data" }}
        </p>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { mdiCheckCircle } from "../../node_modules/@mdi/js/mdi";

const props = defineProps({
  modelValue: Boolean,
  title: null,
});

const emit = defineEmits(["update:modelValue", "addProject"]);

const isOpen = ref(false);

watch(
  () => isOpen.value,
  (val) => {
    if (!val) {
      close();
    }
  }
);

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
  }
);

onMounted(() => {
  isOpen.value = props.modelValue;
});
</script>
