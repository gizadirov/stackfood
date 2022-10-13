import { createApp } from 'vue';
import store from './store/store';
import mitt from 'mitt';
import App from './App.vue'

const emitter = mitt();

const app = createApp(App);
app.config.globalProperties.emitter = emitter;

app.use(store).mount('#app')
