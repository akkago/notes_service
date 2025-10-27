import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/styles.css'

// Import pages
import NotesList from './pages/NotesList.vue'
import NoteDetail from './pages/NoteDetail.vue'
import NoteEdit from './pages/NoteEdit.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: NotesList },
    { path: '/notes/:id', component: NoteDetail, props: true },
    { path: '/notes/:id/edit', component: NoteEdit, props: true },
    { path: '/notes/new', component: NoteEdit },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
  ],
})

// Create app
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
