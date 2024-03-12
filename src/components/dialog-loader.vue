<template>
  <v-dialog persistent v-model="isOpen" width="auto">
    <v-card class="overflow-visible pa-5 px-10" width="">
      <div class="d-flex flex-column align-center ga-2">
        <v-progress-circular
          :size="50"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <p>Loading...</p>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";

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
    console.log(val);
    isOpen.value = val;
  }
);

onMounted(() => {
  isOpen.value = props.modelValue;
});
</script>
