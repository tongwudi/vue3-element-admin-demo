<template>
  <el-card shadow="never">
    <el-row justify="space-between">
      <el-form inline :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item>
          <el-cascader
            v-model="searchForm.classificationTypeId"
            :options="treeData"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              emitPath: false,
              label: 'name',
              value: 'id'
            }"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            style="width: 120px"
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" plain @click="goPage">分类管理</el-button>
    </el-row>
  </el-card>

  <el-card shadow="never" style="margin-top: 20px">
    <el-table v-loading="loading" :data="tableData">
      <el-table-column label="标题" prop="content" />
      <el-table-column label="付费问题" width="120" align="center">
        <template #default="{ row }">
          {{ row.charge == 'N' ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column
        label="提问时间"
        width="200"
        prop="createTime"
        align="center"
      />
      <el-table-column label="状态" width="150" align="center">
        <template #default="{ row }">
          <el-tag :type="renderStatus(row.replyStatus).type">
            {{ renderStatus(row.replyStatus).text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            size="small"
            :type="row.open == 'N' ? '' : 'warning'"
            :loading="row.btnLoading"
            @click="handleChange(row)"
          >
            {{ row.open == 'N' ? '隐藏' : '公开' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="total > 0"
      v-model:total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getTableData"
    />
  </el-card>
</template>

<script setup>
  import Pagination from '@/components/Pagination/index.vue';
  import Questions from '@/api/questions';

  defineOptions({
    inheritAttrs: false
  });

  const emit = defineEmits(['change']);

  const router = useRouter();

  const loading = ref(true);
  const searchForm = reactive({});
  const queryParams = reactive({
    pageSize: 8,
    pageNum: 1
  });
  const treeData = ref([]);
  const tableData = ref([]);
  const total = ref(0);

  const statusOptions = [
    { text: '待回答', value: 'NOANSWER', type: 'danger' },
    { text: '已回答', value: 'ANSWERED', type: 'success' }
  ];

  const renderStatus = status => {
    const obj = statusOptions.reduce((obj, item) => {
      obj[item.value] = item;
      return obj;
    }, {});
    return obj[status] || statusOptions[0];
  };

  const goPage = () => {
    router.push('/questions/categories');
  };

  const getTgasData = async () => {
    const res = await Questions.queryTreeById({ id: '' });
    treeData.value = res;
  };

  const getTableData = () => {
    loading.value = true;
    const params = {
      ...searchForm,
      ...queryParams
    };
    Questions.queryPage(params)
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
    getTableData();
  };

  const handleSearch = () => {
    handleQuery();
  };

  const handleEdit = ({ id }) => {
    emit('change', { type: 'detail', id });
  };

  const handleChange = row => {
    row.btnLoading = true;
    const params = {
      id: row.id,
      openStatus: row.open == 'N' ? 'Y' : 'N'
    };
    Questions.editOpen(params)
      .then(res => {
        row.open = params.openStatus;
      })
      .finally(() => {
        row.btnLoading = false;
      });
  };

  const handleDelete = ({ id }) => {
    ElMessageBox.confirm(`确定删除此问题吗？`, '警告', {
      type: 'warning'
    })
      .then(async () => {
        await Questions.deleteById({ id });
        ElMessage.success('删除成功');
        handleQuery();
      })
      .catch(() => {});
  };

  onMounted(() => {
    getTgasData();
    handleQuery();
  });
</script>

<style lang="scss" scoped></style>
