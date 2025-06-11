import router, { constantRoutes } from "@/router";
import { getRoutes } from '@/api/index';

const Layout = () => import('@/layout/index.vue')
const modules = import.meta.glob("../../views/**/**.vue");

export const usePermissionStore = defineStore("permission", () => {
  // 存储所有路由，包括静态路由和动态路由
  const routes = ref([...constantRoutes]);
  // const routes = ref([]);
  // 路由是否加载完成
  const routesLoaded = ref(false);

  function generateRoutes() {
    return new Promise((resolve, reject) => {
      getRoutes()
        .then((data) => {
          const dynamicRoutes = parseDynamicRoutes(data);
          console.log(dynamicRoutes, 'dynamicRoutes')
          routes.value = [...constantRoutes, ...dynamicRoutes];
          routesLoaded.value = true;
          resolve(dynamicRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const parseDynamicRoutes = (rawRoutes) => {
    const parsedRoutes = [];

    rawRoutes.forEach((route) => {
      const normalizedRoute = { ...route };

      // 处理组件路径
      normalizedRoute.component =
        normalizedRoute.component?.toString() === "Layout"
          ? Layout
          : modules[`../../views/${normalizedRoute.component}.vue`] ||
          modules["../../views/error-page/404.vue"];

      // 递归解析子路由
      if (normalizedRoute.children) {
        normalizedRoute.children = parseDynamicRoutes(route.children);
      }

      parsedRoutes.push(normalizedRoute);
    });

    return parsedRoutes;
  };

  const resetRouter = () => {
    // 创建常量路由名称集合，用于O(1)时间复杂度的查找
    const constantRouteNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean));

    // 从 router 实例中移除动态路由
    routes.value.forEach((route) => {
      if (route.name && !constantRouteNames.has(route.name)) {
        router.removeRoute(route.name);
      }
    });

    // 重置为仅包含常量路由
    routes.value = [...constantRoutes];
    routesLoaded.value = false;
  };

  return {
    routes,
    routesLoaded,
    generateRoutes,
    resetRouter
  }
})