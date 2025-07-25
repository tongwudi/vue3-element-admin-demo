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
            placeholder="状态"
            clearable
          >
            <el-option label="草稿" value="DRAFT" />
            <el-option label="已发布" value="PUBLISHED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-button type="primary" plain @click="goPage">分类管理</el-button>
        <el-button type="primary" @click="handleAdd">创建文章</el-button>
      </div>
    </el-row>
  </el-card>

  <el-card shadow="never" style="margin-top: 20px">
    <el-table v-loading="loading" :data="tableData">
      <el-table-column label="封面" width="200" align="center">
        <template #default="{ row }">
          <el-row justify="center">
            <el-image
              style="width: 80px; height: 60px"
              :src="row.coverImgUrl"
              :previewSrcList="[row.coverImgUrl]"
              preview-teleported
            />
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="180"
        align="center"
      />
      <el-table-column label="编辑" width="150" align="center">
        <template #default="{ row }">
          <el-button
            size="small"
            :icon="Edit"
            circle
            @click="handleEdit(row)"
          ></el-button>
          <el-button
            size="small"
            :icon="Delete"
            circle
            @click="handleDelete(row)"
          ></el-button>
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

  <ArticlesDrawer v-model="showDrawer" :row="rowParams" @submit="handleQuery" />
</template>

<script setup>
  import Pagination from '@/components/Pagination/index.vue';
  import ArticlesDrawer from './components/ArticlesDrawer.vue';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import Articles from '@/api/articles';

  const router = useRouter();

  const showDrawer = ref(false);
  const rowParams = ref({});


  const loading = ref(true);
  const searchForm = reactive({});
  const queryParams = reactive({
    pageSize: 8,
    pageNum: 1
  });
  const total = ref(0);
  const tableData = ref([]);
  const treeData = ref([]);

  const goPage = () => {
    router.push('/questions/categories');
  };

  const getTgasData = async () => {
    const res = await Articles.queryTreeById({ id: '' });
    treeData.value = res;
  };

  const getTableData = () => {
    loading.value = true;
    const params = {
      ...searchForm,
      ...queryParams
    };
    Articles.queryPage(params)
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

  const handleAdd = () => {
    rowParams.value = {};
    showDrawer.value = true;
  };

  const handleEdit = row => {
    rowParams.value = { ...row };
    showDrawer.value = true;
  };

  const handleDelete = ({ id }) => {
    ElMessageBox.confirm(`确定删除此文章吗？`, '警告', {
      type: 'warning'
    })
      .then(async () => {
        await Articles.deleteById({ id });
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
