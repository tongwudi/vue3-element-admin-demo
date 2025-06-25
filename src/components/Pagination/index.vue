<template>
  <el-row :class="{ hidden: hidden }" class="pagination" justify="center">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-row>
</template>

<script setup>
  const props = defineProps({
    total: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      }
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next'
    },
    background: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['pagination']);

  const currentPage = defineModel('page', {
    type: Number,
    required: true,
    default: 1
  });

  const pageSize = defineModel('limit', {
    type: Number,
    required: true,
    default: 10
  });

  watch(
    () => props.total,
    newVal => {
      const lastPage = Math.ceil(newVal / pageSize.value);
      if (newVal > 0 && currentPage.value > lastPage) {
        currentPage.value = lastPage;
        emit('pagination', { page: currentPage.value, limit: pageSize.value });
      }
    }
  );

  function handleSizeChange(val) {
    currentPage.value = 1;
    emit('pagination', { page: currentPage.value, limit: val });
  }

  function handleCurrentChange(val) {
    emit('pagination', { page: val, limit: pageSize.value });
  }
</script>

<style lang="scss" scoped>
  .pagination {
    padding-top: 20px;

    &.hidden {
      display: none;
    }
  }
</style>
