import "vuetify/styles";
import "vuetify/dist/vuetify.min.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import colors from "vuetify/util/colors";
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      dark: false,
      light: {
        dark: false,
        colors: {
          primary: colors.red.darken1,
          secondary: colors.red.lighten4,
          "main-page": "#F7F8FB",
          red: "#F15858",
          blue: "#2775EC",
          "light-blue": "#F0F6FF",
        },
      },
    },
  },
});
