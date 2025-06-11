<template>
  <div>
    404

    <el-table :data="tableData">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name1" label="Name1" width="180" />
      <el-table-column prop="name2" label="Name2" width="180" />
      <el-table-column prop="name3" label="Name3" width="180" />
      <el-table-column prop="name4" label="Name4" width="180" />
      <el-table-column prop="name4" label="Name4" width="180" />
      <el-table-column prop="name4" label="Name4" width="180" />
      <el-table-column prop="name4" label="Name4" width="180" />
      <el-table-column prop="name5" label="Name5" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script setup>
  const tableData = [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }
  ];
</script>

<style lang="scss" scoped></style>
