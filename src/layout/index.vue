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
        <!-- 面包屑 -->
        <Breadcrumb />

        <!-- 主要区域 -->
        <div class="container‌">
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
    box-shadow: 4px 4px 40px 0 rgba(0, 0, 0, 0.05);
  }

  .layout-main {
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
  }

  .container‌ {
    flex: 1;
  }
</style>
