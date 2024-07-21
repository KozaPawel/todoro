import { createRouter, createWebHistory } from 'vue-router'
import TablesView from '@/views/TablesView.vue'
import TableView from '@/views/TableView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tables',
      component: TablesView
    },
    {
      path: '/:notFound(.*)',
      redirect: '/'
    },
    {
      path: '/t/:id',
      name: 'table',
      component: TableView,
      beforeEnter: (to, from, next) => {
        const storage = JSON.parse(localStorage.getItem('tables'))
        let tableExists = false
        storage.forEach((table) => {
          table.name == to.params.id && (tableExists = true)
        })
        tableExists ? next() : next('/')
      }
    }
  ]
})

export default router
