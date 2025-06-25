<template>
  <el-breadcrumb v-if="currentRoute.path != '/dashboard'">
    <el-breadcrumb-item :to="{ path: '/' }">控制台</el-breadcrumb-item>
    <el-breadcrumb-item v-for="route in breadcrumbs" :key="route.path">
      <span>{{ route.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
  const currentRoute = useRoute();

  const breadcrumbs = ref([]);

  watch(
    currentRoute,
    route => {
      breadcrumbs.value = route.matched.filter(v => v.children.length == 0);
    },
    { immediate: true }
  );
</script>

<style lang="scss" scoped>
  .el-breadcrumb {
    margin-top: 20px;
  }
</style>
