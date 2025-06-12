<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户" name="user"></el-tab-pane>
    <el-tab-pane label="管理员" name="admin"></el-tab-pane>
  </el-tabs>

  <div class="card-box">
    <component :is="curComponent"></component>
  </div>
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
  .card-box {
    border-top: 0;
  }
</style>
