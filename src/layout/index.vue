<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside width="auto" class="layout-aside">
      <!-- 菜单项 -->
      <Sidebar />
    </el-aside>

    <el-container direction="vertical">
      <el-header class="layout-header">
        <!-- 顶栏 -->
        <NavBar />
      </el-header>

      <el-main class="layout-main">
        <div class="app-breadcrumb">
          <!-- 面包屑 -->
          <Breadcrumb />
        </div>

        <!-- 主要区域 -->
        <div class="app-container‌">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
  import Sidebar from './components/Sidebar/index.vue';
  import NavBar from './components/NavBar/index.vue';
  import Breadcrumb from '@/components/Breadcrumb/index.vue';
</script>

<style lang="scss" scoped>
  .layout-aside {
    background-color: #343d44;
  }

  .layout-header {
    box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.05);
    z-index: 9;
  }

  .layout-main {
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
    padding: 0;
  }

  .app-breadcrumb {
    padding: 20px;
    padding-top: 0;
  }

  .app-container‌ {
    flex: 1;
    padding: 20px;
    padding-top: 0;
    overflow: auto;
  }
</style>
