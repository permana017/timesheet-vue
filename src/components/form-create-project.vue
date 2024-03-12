<template>
  <v-dialog v-model="isOpen" width="auto">
    <v-card class="overflow-visible" width="900">
      <div class="d-flex justify-space-between pa-4 border-b">
        <p class="font-weight-bold">Tambah Proyek Baru</p>
        <v-icon @click="close" :icon="mdiClose" class="cursor-pointer"></v-icon>
      </div>
      <v-form @submit.prevent="onSubmit" class="pa-3">
        <div class="px-2">
          <label class="text-subtitle-1 text-grey-darken-1"
            >Nama Proyek<span class="text-red">*</span>
          </label>
          <v-text-field
            v-model="form.name"
            placeholder="Masukan Judul Kegiatan"
            variant="outlined"
            density="compact"
          ></v-text-field>
          <p
            v-if="errs.name"
            style="margin-top: -20px"
            class="text-red text-subtitle-2"
          >
            Nama Proyek {{ errs.name }}
          </p>
        </div>
        <div class="d-flex ga-2 justify-end">
          <v-btn @click="close" class="text-none text-red">Kembali</v-btn>
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
  pocket: null,
});

const emit = defineEmits(["update:modelValue", "success"]);

const isOpen = ref(false);
const isLoading = ref(false);

watch(
  () => isOpen.value,
  (val) => {
    if (!val) {
      close();
    }
  }
);

const form = reactive({
  name: "",
});
const errs = reactive({
  name: "",
});

watch(
  () => props.modelValue,
  (val) => {
    console.log(val);
    isOpen.value = val;
  }
);

const close = () => {
  emit("update:modelValue", false);
  resetErr();
  resetForm();
};

const resetForm = () => {
  for (const key in form) {
    form[key] = "";
  }
};

defineExpose({
  resetForm,
});

const onSubmit = () => {
  console.log(form);
  resetErr();
  if (form.name) {
    postData();
  } else {
    errs.name = "harus di isi!";
  }
};

const postData = async () => {
  isLoading.value = true;
  let init = {
    path: "projects",
    body: form,
  };
  try {
    const res = await postApi(init);
    emit("success");
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const resetErr = () => {
  for (const key in errs) {
    errs[key] = "";
  }
};

onMounted(() => {
  isOpen.value = props.modelValue;
});
</script>
