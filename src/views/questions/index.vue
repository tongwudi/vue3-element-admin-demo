<template>
  <component :is="curComponent" :params="params" @change="handleChangeCom" />
</template>

<script setup>
  import List from './components/List.vue';
  import Detail from './components/Detail.vue';

  const components = {
    list: List,
    detail: Detail
  };

  const curComponent = shallowRef(components.list);
  const params = ref('');

  const handleChangeCom = obj => {
    curComponent.value = components[obj.type];
    params.value = { id: obj.id };
  };
</script>

<style lang="scss" scoped></style>
