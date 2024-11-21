import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

/**PrimeVue imports*/
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import "primeicons/primeicons.css";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Nora from "@primevue/themes/nora";
import Menubar from "primevue/menubar";
import Carousel from "primevue/carousel";
import Checkbox from "primevue/checkbox";
/**PrimeVue imports*/

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.use(PrimeVue, {
  theme: {
    preset: Nora,
    options: {
      prefix: "p",
      darkModeSelector: "no",
      cssLayer: false,
    },
  },
});
app.use(ToastService);
/**primevue components*/
app.component("Button", Button);
app.component("Menubar", Menubar);
app.component("Toast", Toast);
app.component("Carousel", Carousel);
app.component("Input", InputText);
app.component("FloatLabel", FloatLabel);
app.component("CheckBox", Checkbox);
/**primevue components*/
app.mount("#app");
