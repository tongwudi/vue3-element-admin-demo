<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="用户" name="user"></el-tab-pane>
    <el-tab-pane label="管理员" name="admin"></el-tab-pane>
  </el-tabs>

  <el-card shadow="never">
    <component :is="curComponent"></component>
  </el-card>
</template>

<script setup>
  import UserPane from './components/UserPane.vue';
  import AdminPane from './components/AdminPane.vue';

  const components = {
    user: UserPane,
    admin: AdminPane
  };

  const activeName = ref('user');
  const curComponent = shallowRef(components.user);

  const handleClick = tab => {
    curComponent.value = components[tab.paneName];
  };
</script>

<style lang="scss" scoped>
  .el-tabs--border-card {
    border-bottom: 0;
  }
</style>
