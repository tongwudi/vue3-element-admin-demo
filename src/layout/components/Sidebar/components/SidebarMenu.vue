<template>
  <el-menu
    :default-active="currentRoute.path"
    :collapse="!appStore.sidebar.opened"
    background-color="#343d44"
    text-color="#fff"
    active-text-color="#409eff"
    @select="handleSelect"
  >
    <!-- logo -->
    <div class="logo el-menu-item" @click="toggleClick">
      <el-icon :size="18">
        <component :is="appStore.sidebar.opened ? 'Fold' : 'Expand'" />
      </el-icon>
      <span v-show="appStore.sidebar.opened">菜单</span>
    </div>

    <!-- 菜单项 -->
    <SidebarMenuItem
      v-for="route in menus"
      :key="route.path"
      :item="route"
      :base-path="route.path"
    />
  </el-menu>
</template>

<script setup>
  import SidebarMenuItem from './SidebarMenuItem.vue';
  import { useAppStore } from '@/store/index';
  import { isExternal } from '@/utils/index';

  const props = defineProps({
    menus: {
      type: Array,
      default: () => []
    },
    basePath: {
      type: String
    }
  });

  const router = useRouter();
  const currentRoute = useRoute();

  const appStore = useAppStore();

  const toggleClick = () => {
    appStore.toggleSidebar();
  };

  const handleSelect = (index, indexPath) => {
    isExternal(index) ? window.open(index, '_blank') : router.push(index);
  };
</script>

<style scoped>
  .el-menu:not(.el-menu--collapse) {
    width: 180px;
  }

  .logo:hover {
    background-color: #343d44;
  }
</style>
