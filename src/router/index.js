import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: Layout,
    meta: { title: '控制台', icon: 'House' },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台' }
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
    ]
  },
  {
    path: '/member',
    component: Layout,
    meta: { title: '人员管理', icon: 'User' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/member/index.vue'),
        meta: { title: '人员管理' },
      }
    ]
  },
  {
    path: '/media-library',
    component: Layout,
    meta: { title: '媒体库', icon: 'Files' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/media-library/index.vue'),
        meta: { title: '媒体库' },
      }
    ]
  },
  {
    path: '/questions',
    component: Layout,
    meta: { title: '问答管理', icon: 'ChatLineSquare' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/questions/index.vue'),
        meta: { title: '问答列表' },
      },
      {
        path: 'categories',
        component: () => import('@/views/questions/categories.vue'),
        meta: { title: '分类管理' },
      }
    ]
  },
  {
    path: '/articles',
    component: Layout,
    meta: { title: '文章管理', icon: 'Tickets' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/articles/list.vue'),
        meta: { title: '文章列表' },
      },
      {
        path: 'categories',
        component: () => import('@/views/articles/categories.vue'),
        meta: { title: '分类管理' },
      }
    ]
  },
  {
    path: '/media',
    component: Layout,
    meta: { title: '课程管理', icon: 'Monitor' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/media/list.vue'),
        meta: { title: '课程列表' },
      },
      {
        path: 'categories',
        component: () => import('@/views/media/categories.vue'),
        meta: { title: '分类管理' },
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router