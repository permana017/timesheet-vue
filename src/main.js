import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import createVuetify from "./plugins/vuetify";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const vuetify = createVuetify;

const app = createApp(App);
app.component("VueDatePicker", VueDatePicker);
app.use(vuetify);
app.mount("#app");
