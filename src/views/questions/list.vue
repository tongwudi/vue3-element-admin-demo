<template>
  <el-card shadow="never">
    <el-row justify="space-between">
      <el-form inline :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item>
          <el-select
            style="width: 100px"
            v-model="searchForm.status"
            placeholder="发布状态"
          >
            <el-option label="未发布" value="0" />
            <el-option label="已发布" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-button plain @click="showTags = !showTags">
          {{ showTags ? '隐藏' : '显示' }}菜单
        </el-button>
        <el-button type="primary" plain @click="goPage">分类管理</el-button>
      </div>
    </el-row>

    <div style="margin-top: 20px" v-show="showTags">
      <TagSelector
        :tagsData="tagsData"
        :initialLevel="selectedParams"
        @change="handleTagChange"
      />
    </div>
  </el-card>

  <div style="margin-top: 20px">
    <el-table :data="tableData">
      <el-table-column prop="date" label="标题" />
      <el-table-column prop="date" label="付费问题" width="120" />
      <el-table-column prop="date" label="提问时间" width="180" />
      <el-table-column prop="date" label="状态" width="100" />
      <el-table-column label="编辑" width="250" align="center">
        <template #default>
          <el-button size="small" type="primary" @click="handleEdit">
            编辑
          </el-button>
          <el-button size="small">设为隐藏</el-button>
          <el-button size="small" type="danger" @click="handleDelete">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="pagination-box">
    <el-pagination
      v-bind="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
  import TagSelector from '@/components/TagSelector/index.vue';

  const router = useRouter();
  const searchForm = ref({});
  const showTags = ref(true);
  const selectedParams = ref([1]);

  const tagsData = ref([
    { value: 1, label: '全部' },
    { value: 2, label: '化学学科' },
    { value: 3, label: '物理学科' },
    { value: 4, label: '生物学科' },
    { value: 5, label: '小学科学' },
    { value: 6, label: '其他' }
  ]);

  const handleSearch = () => {};

  const handleTagChange = selection => {
    selectedParams.value = selection;
  };

  const goPage = () => {
    router.push('/questions/categories');
  };

  const tableData = ref([{ status: 1 }]);
  const pagination = reactive({
    layout: 'total, prev, pager, next',
    pageSize: 8,
    total: 0,
    currentPage: 1
  });

  // 请求数据
  const handleRefresh = async () => {};
  const handleEdit = () => {};
  const handleDelete = () => {};

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
