const routes = [
  {
    path: '/', // Ruta para el Login
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/dashboard', // Ruta para el contenido del empleado
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard/chat/general' },
      { path: 'chat/:chatId', component: () => import('pages/HistorialChat.vue') },
      { path: 'actividades', component: () => import('pages/ActividadesPage.vue') },
      { path: 'cursos', component: () => import('pages/CursosPage.vue') },
      { path: 'documentos', component: () => import('pages/DocumentosPage.vue') },
      { path: 'supervisor', component: () => import('pages/SupervisorPage.vue') }
    ]
  },
  {
    path: '/admin', // Ruta para el panel de administración
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/progreso' },
      { path: 'progreso', component: () => import('pages/AdminDashboardPage.vue') },
      { path: 'mensajes', component: () => import('pages/AdminMessagesPage.vue') },
      { path: 'documentos', component: () => import('pages/AdminDocumentsPage.vue') },
      { path: 'calendario', component: () => import('pages/AdminCalendarPage.vue') } // <-- NUEVA RUTA
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
