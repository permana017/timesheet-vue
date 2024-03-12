<template>
  <v-dialog v-model="isOpen" width="auto">
    <v-card class="overflow-visible" width="900">
      <div class="d-flex justify-space-between pa-4 border-b">
        <p class="font-weight-bold">Tambah Kegiatan</p>
        <v-icon @click="close" :icon="mdiClose" class="cursor-pointer"></v-icon>
      </div>
      <v-form @submit.prevent="onSubmit" class="pa-3">
        <v-row no-gutters class="my-2">
          <v-col cols="12" sm="3" class="">
            <v-sheet class="ma-1 pa-1">
              <label class="text-subtitle-1 text-grey-darken-1"
                >Tanggal Mulai<span class="text-red">*</span>
              </label>
              <VueDatePicker
                placeholder="Masukan Tanggal"
                :enable-time-picker="false"
                v-model="form.start_date"
              ></VueDatePicker>
              <p v-if="errs.start_date" class="text-red text-subtitle-2">
                Tanggal mulai {{ errs.start_date }}
              </p>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="3" class="">
            <v-sheet class="ma-1 pa-1">
              <label class="text-subtitle-1 text-grey-darken-1"
                >Tanggal Berakhir<span class="text-red">*</span>
              </label>
              <VueDatePicker
                placeholder="Masukan Tanggal"
                :enable-time-picker="false"
                v-model="form.end_date"
              ></VueDatePicker>
              <p v-if="errs.end_date" class="text-red text-subtitle-2">
                Tanggal berakhir {{ errs.end_date }}
              </p>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="3" class="">
            <v-sheet class="ma-1 pa-1">
              <label class="text-subtitle-1 text-grey-darken-1"
                >Waktu Mulai<span class="text-red">*</span>
              </label>
              <VueDatePicker
                placeholder="Masukan Waktu"
                v-model="form.time_start"
                time-picker
              >
                <template #input-icon>
                  <v-icon
                    class="ml-2"
                    :icon="mdiClockOutline"
                    size="22"
                  ></v-icon>
                </template>
              </VueDatePicker>
              <p v-if="errs.time_start" class="text-red text-subtitle-2">
                Waktu mulai {{ errs.time_start }}
              </p>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="3" class="">
            <v-sheet class="ma-1 pa-1">
              <label class="text-subtitle-1 text-grey-darken-1"
                >Waktu Berakhir<span class="text-red">*</span>
              </label>
              <VueDatePicker
                placeholder="Masukan waktu"
                v-model="form.time_end"
                time-picker
              >
                <template #input-icon>
                  <v-icon
                    class="ml-2"
                    :icon="mdiClockOutline"
                    size="22"
                  ></v-icon>
                </template>
              </VueDatePicker>
              <p v-if="errs.time_end" class="text-red text-subtitle-2">
                Waktu berakhir {{ errs.time_end }}
              </p>
            </v-sheet>
          </v-col>
        </v-row>
        <div class="px-2">
          <label class="text-subtitle-1 text-grey-darken-1"
            >Judul Kegiatan<span class="text-red">*</span>
          </label>
          <v-text-field
            v-model="form.title"
            placeholder="Masukan Judul Kegiatan"
            variant="outlined"
            density="compact"
          ></v-text-field>
          <p
            v-if="errs.title"
            style="margin-top: -20px"
            class="text-red text-subtitle-2"
          >
            Judul kegitatan {{ errs.title }}
          </p>
        </div>
        <div class="px-2 mb-5">
          <label class="text-subtitle-1 text-grey-darken-1"
            >Nama Proyek<span class="text-red">*</span>
          </label>
          <v-autocomplete
            placeholder="Masukan Judul Kegiatan"
            density="compact"
            v-model="form.project_name"
            variant="outlined"
            :items="projects"
            item-title="name"
            item-value="name"
          >
            <template #prepend-item>
              <div
                @click="emit('addProject')"
                class="d-flex align-center px-3 py-3 cursor-pointer ga-1 text-red text-subtitle-2"
              >
                <v-icon :icon="mdiPlus" size="16"></v-icon>
                <p>Tambah Proyek</p>
              </div>
            </template>
          </v-autocomplete>
          <p
            v-if="errs.project_name"
            style="margin-top: -20px"
            class="text-red text-subtitle-2"
          >
            Nama proyek {{ errs.project_name }}
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
import {
  mdiClockOutline,
  mdiClose,
  mdiPlus,
} from "../../node_modules/@mdi/js/mdi";
import { getApi, postApi, updateApi } from "../plugins/service";
import formatDate from "../helper/formatDate";

const props = defineProps({
  modelValue: Boolean,
  pocket: null,
  projects: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["update:modelValue", "addProject", "success"]);

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
  start_date: "",
  end_date: "",
  time_start: "",
  time_end: "",
  title: "",
  project_name: "",
  user_id: 2,
});
const errs = reactive({
  start_date: "",
  end_date: "",
  time_start: "",
  time_end: "",
  title: "",
  project_name: "",
});
watch(
  () => props.modelValue,
  (val) => {
    console.log(val);
    isOpen.value = val;
  }
);

const setDpValue = () => {
  if (props.pocket) {
    form.start_date = props.pocket.start_date;
    form.end_date = props.pocket.end_date;
    form.time_start = props.pocket.time_start;
    form.time_end = props.pocket.time_end;
    form.title = props.pocket.title;
    form.project_name = props.pocket.project_name;
  }
};

watch(
  () => props.pocket,
  (val) => {
    if (props.pocket) {
      setDpValue();
    }
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
  resetErr();
  for (const key in form) {
    if (!form[key]) {
      errs[key] = "harus di isi!";
    }
  }
  if (
    form.start_date &&
    form.end_date &&
    form.time_end &&
    form.time_start &&
    form.title &&
    form.project_name
  ) {
    postData();
  }
};

const postData = async () => {
  isLoading.value = true;
  if (!props.pocket) {
    form.time_end = `${form.time_end.hours}:${form.time_end.minutes}`;
    form.time_start = `${form.time_start.hours}:${form.time_start.minutes}`;
    form.start_date = formatDate(form.start_date);
    form.end_date = formatDate(form.end_date);
    form.user_id = 2;
  }
  let init = {
    path: props.pocket ? `timesheet/${props.pocket.id}` : "timesheet",
    body: form,
  };
  try {
    const res = props.pocket ? await updateApi(init) : await postApi(init);
    if (props.pocket) {
      emit("success", "Berhasil Mengupdate kegiatan");
    } else {
      emit("success", "Berhasil Menambah kegiatan");
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
    close();
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
