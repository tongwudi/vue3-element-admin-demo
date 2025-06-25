<template>
  <el-scrollbar>
    <SidebarMenu :menus="permissionStore.routes" />
  </el-scrollbar>
</template>

<script setup>
  import SidebarMenu from './components/SidebarMenu.vue';
  import { usePermissionStore } from '@/store';

  const permissionStore = usePermissionStore();
</script>

<style lang="scss" scoped>
  .el-scrollbar {
    // height: calc(100vh - 60px);
    height: 100vh;
  }
  :deep(.el-menu) {
    border: none;
  }
</style>
