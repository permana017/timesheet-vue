<template>
  <v-dialog v-model="isOpen" width="auto">
    <v-card class="overflow-visible" width="600">
      <div class="d-flex justify-space-between pa-4 border-b">
        <p class="font-weight-bold">Filter</p>
        <v-icon @click="close" :icon="mdiClose" class="cursor-pointer"></v-icon>
      </div>
      <v-form @submit.prevent="onSubmit" class="pa-3">
        <div class="px-2">
          <label class="text-subtitle-1 text-grey-darken-1"
            >Nama Proyek<span class="text-red">*</span>
          </label>
          <v-autocomplete
            density="compact"
            variant="outlined"
            v-model="filters"
            :items="items"
            item-title="name"
            item-value="name"
            chips
            closable-chips
            multiple
          >
          </v-autocomplete>
        </div>
        <div class="d-flex ga-2 justify-end">
          <v-btn @click="resetFilter" class="text-none text-red">Hapus</v-btn>
          <v-btn v-if="!isLoading" type="submit" class="text-none bg-red"
            >Simpan</v-btn
          >
          <v-btn v-else class="text-none bg-red">
            <v-progress-circular
              width="3"
              class="mr-1"
              size="20"
              color="white"
              indeterminate
            ></v-progress-circular>
            Menyimpan..
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { mdiClose } from "../../node_modules/@mdi/js/mdi";
import { postApi } from "../plugins/service";

const props = defineProps({
  modelValue: Boolean,
  items: null,
});

const emit = defineEmits(["update:modelValue", "success", "setFilter"]);

const isOpen = ref(false);
const isLoading = ref(false);
const filters = ref([]);

watch(
  () => isOpen.value,
  (val) => {
    console.log(val);
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

const close = () => {
  emit("update:modelValue", false);
};

const onSubmit = () => {
  emit("setFilter", filters.value);
};
const resetFilter = () => {
  filters.value = [];
  emit("setFilter", filters.value);
};

onMounted(() => {
  isOpen.value = props.modelValue;
});
</script>
