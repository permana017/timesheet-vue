<template>
  <VueDatePicker
    v-model="date"
    time-picker
    class="mt-5 w-50"
    @update:model-value="handleUpdate"
  >
    <template
      #dp-input="{
        value,
        // onInput,
        // onEnter,
        // onTab,
        // onClear,
        // onBlur,
        // onKeypress,
        // onPaste,
        // isMenuOpen,
      }"
    >
      <label for="timeInput" class="realtive d-flex">
        <input
          id="timeInput"
          type="text"
          :value="value"
          class="input-picker w-100 pr-10"
        />
        <div class="icon">
          <v-icon
            :icon="mdiClockTimeFiveOutline"
            :size="30"
            color="grey-darken-2"
          ></v-icon>
        </div>
      </label>
    </template>
    <template #clear-icon></template>
  </VueDatePicker>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { mdiClockTimeFiveOutline } from "../../node_modules/@mdi/js/mdi";

const date = ref("");

const props = defineProps({
  modelValue: "",
});

const emit = defineEmits(["update:modelValue"]);

const handleUpdate = (e) => {
  emit("update:modelValue", e);
  date.value = e;
};

watch(
  () => props.modelValue,
  (val) => {
    console.log("kesini", val);
    date.value = val;
  }
);

onMounted(() => {
  if (props.modelValue) {
    date.value = props.modelValue;
  }
});
</script>
<style scoped>
.input-picker {
  padding: 1rem;
  border: 1px solid;
  border-color: gray;
  outline: none;
  border-radius: 4px;
}
.input-picker:hover {
  border: 1px solid #2d87dc;
}
.input-picker:focus {
  border: 1px solid #2d87dc;
}
.icon {
  right: 14px;
  position: absolute;
  top: 14px;
}
</style>
