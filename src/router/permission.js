import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";

// 白名单路由
const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (to.path === "/login") {
      // 如果已登录，跳转到首页
      next({ path: "/" });
    } else {
      // 未登录
      const permissionStore = usePermissionStore();
      // 判断路由是否加载完成
      if (permissionStore.routesLoaded) {
        if (to.matched.length === 0) {
          // 路由未匹配，跳转到404
          next("/404");
        } else {
          // 动态设置页面标题
          const title = (to.params.title) || (to.query.title);
          if (title) {
            to.meta.title = title;
          }
          next();
        }
      } else {
        try {
          // 生成动态路由
          const dynamicRoutes = await permissionStore.generateRoutes();
          dynamicRoutes.forEach((route) => router.addRoute(route));
          next({ ...to, replace: true });
        } catch (error) {
          console.error(error);
          // 路由加载失败，重置 token 并重定向到登录页
          await useUserStore().resetAllState();
          redirectToLogin(to, next);
        }
      }
    }
  } else {
    // 未登录，判断是否在白名单中
    if (whiteList.includes(to.path)) {
      next();
    } else {
      // 不在白名单，重定向到登录页
      redirectToLogin(to, next);
    }
  }
});

// 重定向到登录页
function redirectToLogin(to, next) {
  const params = new URLSearchParams(to.query);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/login?redirect=${encodeURIComponent(redirect)}`);
}

/** 判断是否有权限 */
export function hasAuth(value, type) {
  const { roles, perms } = useUserStore().userInfo;

  // 超级管理员 拥有所有权限
  if (type === "button" && roles.includes(ROLE_ROOT)) {
    return true;
  }

  const auths = type === "button" ? perms : roles;
  return typeof value === "string"
    ? auths.includes(value)
    : value.some((perm) => auths.includes(perm));
}
