import { fatchLogout } from '@/api/index';
import { usePermissionStore } from "@/store";

export const useUserStore = defineStore("user", () => {
  const userInfo = useStorage("userInfo", {});

  // function getUserInfo() {
  //   return new Promise((resolve, reject) => {
  //     getUserInfo()
  //       .then((data) => {
  //         if (!data) {
  //           reject("验证失败，请重新登录。");
  //           return;
  //         }
  //         Object.assign(userInfo.value, { ...data });
  //         resolve();
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }

  function logout() {
    return new Promise((resolve, reject) => {
      fatchLogout()
        .then(() => {
          resetAllState()
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function resetAllState() {
    // 清除用户凭证
    localStorage.removeItem('token')
    // 重置用户信息
    userInfo.value = {}
    // 重置路由
    usePermissionStore().resetRouter()

    return Promise.resolve();
  }

  return {
    userInfo,
    // getUserInfo,
    logout,
    resetAllState
  }
})