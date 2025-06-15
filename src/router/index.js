import { createRouter, createWebHashHistory } from 'vue-router';

const Layout = () => import('@/layout/index.vue');

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台', icon: '' }
      },
      {
        path: '404',
        component: () => import('@/views/error/404.vue'),
        meta: { hidden: true }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/member/index.vue'),
        meta: { title: '人员管理' }
      }
    ]
  },
  {
    path: '/doc',
    component: Layout,
    children: [
      {
        path: 'https://juejin.cn/post/7228990409909108793',
        meta: {
          title: '平台文档(外链)'
        }
      }
    ]
  },
  {
    path: '/media-library',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/media-library/index.vue'),
        meta: { title: '媒体库' }
      }
    ]
  },
  {
    path: '/questions',
    component: Layout,
    meta: { title: '问答管理' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/questions/list.vue'),
        meta: { title: '问答列表' }
      },
      {
        path: 'categories',
        component: () => import('@/views/questions/categories.vue'),
        meta: { title: '分类管理' }
      }
    ]
  },
  {
    path: '/articles',
    component: Layout,
    meta: { title: '文章管理' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/articles/list.vue'),
        meta: { title: '文章列表' }
      },
      {
        path: 'categories',
        component: () => import('@/views/articles/categories.vue'),
        meta: { title: '分类管理' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
});

export default router;
