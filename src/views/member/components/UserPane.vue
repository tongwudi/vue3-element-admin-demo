<template>
  <!-- <el-button @click="add">新增</el-button> -->

  <!-- <div style="margin-bottom: 20px">
    <el-select
      style="width: 150px; margin-right: 10px"
      :disabled="multipleSelection.length == 0"
      v-model="status"
    >
      <el-option label="通过认证" value="1"
      <el-option label="驳回认证" value="0"
      />
    </el-select>
    <el-button type="primary" :disabled="status === ''">
      应用在所选项目
    </el-button>
  </div> -->

  <!-- <el-table
    v-loading="loading"
    :data="tableData"
    row-key="id"
    @selection-change="handleSelectionChange"
  > -->
  <el-table v-loading="loading" :data="tableData">
    <!-- <el-table-column type="selection" width="55" align="center" /> -->
    <el-table-column label="头像" width="120" align="center">
      <template #default="{ row }">
        <el-row justify="center">
          <el-avatar shape="square" :size="24" :src="row.avatarUrl" />
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="微信昵称" prop="nickName" />
    <el-table-column label="手机号码" prop="phone" align="center" />
    <el-table-column
      label="认证状态"
      prop="authStatus"
      align="center"
      :filters="statusOptions"
      :filter-multiple="false"
      :filter-method="handleFilterStatus"
    >
      <template #default="{ row }">
        <el-tag :type="renderStatus(row.authStatus).type">
          {{ renderStatus(row.authStatus).text }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>

  <Pagination
    v-if="total > 0"
    v-model:total="total"
    v-model:page="queryParams.pageNum"
    v-model:limit="queryParams.pageSize"
    @pagination="getData"
  />
</template>

<script setup>
  import Pagination from '@/components/Pagination/index.vue';
  import Member from '@/api/member';

  const loading = ref(true);
  const queryParams = reactive({
    pageSize: 20,
    pageNum: 1
  });
  const total = ref(0);
  const tableData = ref([]);
  // const multipleSelection = ref([]);

  const statusOptions = [
    { text: '未认证', value: 'UNVERIFIED', type: 'danger' },
    { text: '已认证', value: 'CERTIFIED', type: 'success' }
  ];

  const renderStatus = status => {
    const obj = statusOptions.reduce((obj, item) => {
      obj[item.value] = item;
      return obj;
    }, {});
    return obj[status] || statusOptions[0];
  };

  const getData = () => {
    loading.value = true;
    Member.queryUserPage(queryParams)
      .then(res => {
        tableData.value = res.records;
        total.value = res.total;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const handleQuery = () => {
    queryParams.pageNum = 1;
    getData();
  };

  // const handleSelectionChange = val => {
  //   multipleSelection.value = val;
  // };

  const handleFilterStatus = (value, row, column) => {
    const property = column['property'];
    return row[property] === value;
  };

  onMounted(() => {
    handleQuery();
  });

  // const add = () => {
  //   const params = {
  //     nickName: '张三',
  //     phone: '666666'
  //   };
  //   Member.addUser(params);
  // };
</script>

<style lang="scss" scoped></style>
