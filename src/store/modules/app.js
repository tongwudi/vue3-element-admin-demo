export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebarStatus = useStorage("sidebarStatus", "opened");
  const sidebar = reactive({
    opened: sidebarStatus.value === "opened",
    withoutAnimation: false,
  });

  // 切换侧边栏
  function toggleSidebar() {
    sidebar.opened = !sidebar.opened;
    sidebarStatus.value = sidebar.opened ? "opened" : "closed";
  }

  // 关闭侧边栏
  function closeSideBar() {
    sidebar.opened = false;
    sidebarStatus.value = "closed";
  }

  // 打开侧边栏
  function openSideBar() {
    sidebar.opened = true;
    sidebarStatus.value = 'opened';
  }

  return {
    sidebar,
    toggleSidebar,
    closeSideBar,
    openSideBar,
  }
})