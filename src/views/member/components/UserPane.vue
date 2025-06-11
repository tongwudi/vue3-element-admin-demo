<template>
  <div>

  <div style="margin-bottom: 20px">
    <el-select
      style="width: 150px; margin-right: 10px"
      :disabled="multipleSelection.length == 0"
      v-model="status"
    >
      <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button type="primary" :disabled="status === ''">
      应用在所选项目
    </el-button>
  </div>

  <el-table
  size="large"
    :data="tableData"
    row-key="id"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="头像" width="120" align="center">
      <template #default="{ row }">
        <el-row justify="center">
          <el-avatar
            shape="square"
            :size="24"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
        </el-row>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="姓名" width="180" />
    <el-table-column prop="date" label="ID" width="180" />
    <el-table-column prop="date" label="身份ID" />
    <el-table-column prop="date" label="手机号码" min-width="150" />
    <el-table-column
      label="认证状态"
      width="150"
      align="center"
      :filters="[
        { text: '2016-05-01', value: '2016-05-01' },
        { text: '2016-05-02', value: '2016-05-02' },
        { text: '2016-05-03', value: '2016-05-03' },
        { text: '2016-05-04', value: '2016-05-04' }
      ]"
      :filter-multiple="false"
      :filter-method="filterHandler"
    >
      <template #default="{ row }">
        <el-tag :type="row.status == 1 ? 'success' : 'danger'" effect="dark">
          {{ row.status == 1 ? '已认证' : '未认证' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="标签" />
    <el-table-column label="编辑" width="90" align="center">
      <template #default>
        <el-button
          size="small"
          :icon="Edit"
          circle
          @click="handleEdit"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>

  <el-row style="margin-top: 20px" justify="center">
    <el-pagination
      v-bind="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-row>
</template>

<script setup>
  import { Edit } from '@element-plus/icons-vue';

  const statusOptions = [
    { value: 1, label: '通过认证' },
    { value: 0, label: '驳回认证' }
    // { value: 1, label: '选择分类' },
  ];
  const status = ref('');
  const multipleSelection = ref([]);
  const tableData = [{ status: 1 }];
  const pagination = reactive({
    layout: 'total, prev, pager, next',
    pageSize: 20,
    total: 0,
    currentPage: 1
  });

  const handleSelectionChange = val => {
    multipleSelection.value = val;
  };
  const filterHandler = value => {
    console.log(value);
  };
  // 请求数据
  const handleRefresh = () => {};
  const handleEdit = () => {};

  const handleSizeChange = value => {
    pagination.pageSize = value;
    handleRefresh();
  };
  const handleCurrentChange = value => {
    pagination.currentPage = value;
    handleRefresh();
  };
</script>

<style lang="scss" scoped></style>
