import { createApp } from "vue";
import { createPinia } from "pinia";
import dotenv from 'dotenv'

import App from "./App.vue";

dotenv.config()
const pinia = createPinia();
const app = createApp(App);


app.use(pinia);
app.mount("#app");
