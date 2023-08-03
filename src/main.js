import { createApp } from 'vue';
import Index from './index.vue';
import router from './router';
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
const app = createApp(Index);
app.use(router);
app.mount('#app');
