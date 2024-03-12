<template>
  <div>
    <MainLayout>
      <div class="d-flex flex-column h-100 w-100">
        <div class="bg-white px-6 py-4">
          <p class="font-weight-medium text-h6">HH Timesheet</p>
        </div>
        <div
          class="bg-white d-flex px-6 text-subtitle-2 font-weight-bold ga-2 text-blue-grey"
        >
          <p class="border-blue" style="border-bottom: 3px solid blue">
            Daftar Kegiatan
          </p>
          <p>Pengaturan</p>
        </div>
        <div class="pa-6">
          <v-card>
            <div class="pa-5 border-b d-flex ga-3">
              <div class="">
                <p class="text-blue-grey text-subtitle-2">Nama Karyawan</p>
                <p class="text-blue-grey text-subtitle-2 font-weight-bold">
                  {{ items.user_name ?? "-" }}
                </p>
              </div>
              <div class="">
                <p class="text-blue-grey text-subtitle-2">Rate</p>
                <p class="text-blue-grey text-subtitle-2 font-weight-bold">
                  {{ formatCurrency(items.user_rate) ?? "-" }}
                </p>
              </div>
            </div>
            <div class="pa-5 d-flex justify-space-between aligen-center">
              <div class="d-flex ga-4 align-center">
                <p class="font-weight-bold">Daftar Kegiatan</p>
                <v-btn
                  flat
                  :prepend-icon="mdiPlusCircleOutline"
                  class="text-blue bg-light-blue text-none"
                  @click="onOpenForm"
                  >Tambah Kegiatan</v-btn
                >
              </div>
              <div class="d-flex ga-4 align-center">
                <v-text-field
                  v-model="search"
                  style="min-width: 240px"
                  placeholder="Cari Kegiatan"
                  :prepend-inner-icon="mdiMagnify"
                  variant="outlined"
                  density="compact"
                  :hide-details="true"
                ></v-text-field>
                <v-btn flat class="border">
                  <v-icon
                    :color="filters.length ? 'red' : 'grey'"
                    :icon="mdiFilterVariant"
                    size="24"
                    @click="dialogFilter = true"
                  ></v-icon>
                </v-btn>
              </div>
            </div>
            <div class="pa-5">
              <v-data-table
                :headers="headers"
                :items="items?.timesheet"
                :pagination="false"
                density="compact"
                :loading="isLoading"
                class="border"
                :search="search"
              >
                <template
                  v-slot:headers="{
                    columns,
                    // isSorted,
                    // getSortIcon,
                    toggleSort,
                  }"
                >
                  <tr>
                    <template
                      v-for="(column, index) in columns"
                      :key="column.key"
                    >
                      <td
                        class="border"
                        :class="index == 0 ? 'title-table' : ''"
                      >
                        <div class="d-flex ga-2 align-center">
                          <p class="text-subtitle-2" style="font-weight: 600">
                            {{ column.title }}
                          </p>
                          <div
                            v-if="column.title !== 'Action'"
                            class="d-flex flex-column relative cursor-pointer"
                            @click="() => toggleSort(column)"
                          >
                            <v-icon
                              class="absolute"
                              :size="22"
                              style="top: 6px"
                              :icon="mdiTriangleSmallUp"
                            ></v-icon>
                            <v-icon
                              class="absolute"
                              :size="22"
                              style="bottom: 6px"
                              :icon="mdiTriangleSmallDown"
                            ></v-icon>
                          </div>
                        </div>
                      </td>
                    </template>
                  </tr>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <td
                      v-for="(header, index) in headers"
                      :key="index"
                      class="border"
                      :class="index == 0 ? 'title-table' : ''"
                    >
                      <p v-if="header.key == 'duration'">
                        {{ formatMillisToTime(item.duration) }}
                      </p>
                      <div
                        v-else-if="header.key == 'actions'"
                        class="d-flex ga-2 text-red"
                      >
                        <v-icon
                          :icon="mdiPencilOutline"
                          @click="updateTimeSheet(item)"
                        ></v-icon>
                        <v-icon
                          :icon="mdiDeleteOutline"
                          @click="deleteTimeSheet(item)"
                        ></v-icon>
                      </div>
                      <p v-else>
                        {{ item[header.key] }}
                      </p>
                    </td>
                  </tr>
                </template>
                <template #bottom>
                  <div class="pa-5 border">
                    <div
                      class="d-flex justify-space-between w-100 text-blue-lighten-1 font-weight-medium text-subtitle-2"
                    >
                      <p>Total Durasi</p>
                      <p>{{ formatMillisToTime(items.total_duration) }}</p>
                    </div>
                    <div
                      class="d-flex justify-space-between w-100 text-blue font-weight-bold text-subtitle-1"
                    >
                      <p>Total Pendapatan</p>
                      <p>
                        {{
                          calculateCost(
                            formatMillisToTime(durations, "hour"),
                            formatMillisToTime(durations, "minute"),
                            items.user_rate
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </template>
                <template #loading>
                  <div>Memuat data...</div>
                </template>
                <template #no-data>
                  <div class="w-full">Belum Ada Kegiatan</div>
                </template>
              </v-data-table>
            </div>
            <modalForm
              :pocket="pocket"
              ref="refForm"
              v-model="dialog"
              @addProject="isOpenFormProject = true"
              :projects="projects"
              @success="onSuccessPostTimesheet"
            />
            <formCreateProject
              v-model="isOpenFormProject"
              @success="onSuccessCreateProject"
            />
          </v-card>
          <dialogLoader v-model="loader" />
          <dialogSuccess v-model="isSuccess" :title="succesMsg" />
          <Filter
            v-model="dialogFilter"
            :items="projects"
            @setFilter="setFilter"
          />
        </div>
      </div>
    </MainLayout>
  </div>
</template>
<script setup>
import {
  mdiDelete,
  mdiPencil,
  mdiPlusCircleOutline,
  mdiTriangleSmallDown,
  mdiTriangleSmallUp,
} from "@mdi/js/mdi";
import MainLayout from "../Layouts/main-layout.vue";
import modalForm from "../components/modal-form.vue";
import { deleteApi, getApi } from "../plugins/service";
import { onMounted, ref } from "vue";
import day from "../plugins/day";
import formatMillisToTime from "../helper/formatMillisToTime";
import { formatCurrency } from "../helper/currencyFormater";
import { calculateCost } from "../helper/calcIncome";
import formCreateProject from "../components/form-create-project.vue";
import dialogLoader from "../components/dialog-loader.vue";
import dialogSuccess from "../components/dialog-success.vue";
import Filter from "../components/dialog-filter.vue";
import {
  mdiDeleteOutline,
  mdiFilterVariant,
  mdiMagnify,
  mdiPencilOutline,
} from "../../node_modules/@mdi/js/mdi";

const dialog = ref(false);
const loader = ref(false);
const isSuccess = ref(false);
const isLoading = ref(false);
const items = ref([]);
const refForm = ref(null);
const pocket = ref(null);
const succesMsg = ref("");
const search = ref("");
const durations = ref(0);
const isOpenFormProject = ref(false);
const projects = ref([]);
const dialogFilter = ref(false);
const filters = ref([]);

const headers = [
  {
    key: "title",
    title: "Judul Kegiatan",
    width: "40%",
    sortable: false,
  },
  {
    key: "project_name",
    title: "Nama Proyek",
  },
  {
    key: "start_date",
    title: "Tanggal Mulai",
  },
  {
    key: "end_date",
    title: "Tangal Berakhir",
  },
  {
    key: "time_start",
    title: "Waktu Mulai",
  },
  {
    key: "time_end",
    title: "Waktu Berakhir",
  },
  {
    key: "duration",
    title: "Durasi",
  },
  {
    key: "actions",
    title: "Action",
    sortable: false,
  },
];

const setFilter = (val) => {
  filters.value = val;
  if (items.value?.timesheet) {
    items.value.timesheet = items.value?.timesheet.filter((el) => {
      return filters.value.includes(el.project_name);
    });
  }
  dialogFilter.value = false;
  if (!filters.value.length) {
    fetchData();
  }
};

const fetchData = async () => {
  isLoading.value = true;
  durations.value = 0;
  try {
    const res = await getApi("timesheet?userId=2");
    items.value = res.data[0];
    if (items.value?.timesheet?.length) {
      items.value.timesheet.forEach((el) => {
        durations.value += el.duration;
      });
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const getProject = async () => {
  try {
    let res = await getApi("projects");
    projects.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

const onSuccessCreateProject = () => {
  isOpenFormProject.value = false;
  getProject();
  isSuccess.value = true;
  succesMsg.value = "Berhasil Menambahkan Proyek";
};

const onSuccessPostTimesheet = (val) => {
  succesMsg.value = val;
  dialog.value = false;
  isSuccess.value = true;
  fetchData();
};

const onOpenForm = () => {
  dialog.value = true;
  pocket.value = null;
};

const deleteTimeSheet = async (item) => {
  isLoading.value = true;
  try {
    const res = await deleteApi(`timesheet/${item.id}`);
    isSuccess.value = true;
    succesMsg.value = "Berhasil Menghapus Kegiatan";
    fetchData();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const updateTimeSheet = async (item) => {
  pocket.value = item;
  dialog.value = true;
};

onMounted(() => {
  fetchData();
  getProject();
});
</script>
<style scoped>
.title-table {
  width: 25%;
}
.v-input__details {
  display: none;
}
</style>
