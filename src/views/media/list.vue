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
        <el-button type="primary" @click="showDrawer = true">
          创建课程
        </el-button>
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
      <el-table-column label="封面" width="200" align="center">
        <template #default="{ row }">
          <el-row justify="center">
            <el-image
              style="width: 160px; height: 120px"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            />
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="标题" />
      <!-- <el-table-column prop="date" label="语言" /> -->
      <el-table-column prop="date" label="更新时间" width="180" />
      <el-table-column label="编辑" width="150" align="center">
        <template #default>
          <el-button
            size="small"
            :icon="Edit"
            circle
            @click="handleEdit"
          ></el-button>
          <el-button
            size="small"
            :icon="Delete"
            circle
            @click="handleDelete"
          ></el-button>
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

  <MediaDrawer v-model="showDrawer" @close="showDrawer = false" />
</template>

<script setup>
  import TagSelector from '@/components/TagSelector/index.vue';
  import MediaDrawer from './components/MediaDrawer.vue';
  import { Edit, Delete } from '@element-plus/icons-vue';

  const router = useRouter();

  const searchForm = ref({});
  const showTags = ref(true);
  const showDrawer = ref(false);
  const selectedParams = ref([1]);
  const tagsData = ref([
    { value: 1, label: '全部' },
    {
      value: 2,
      label: '数字化实验产品',
      children: [
        { value: 21, label: '2级全部' },
        {
          value: 22,
          label: '实验数据采集系统',
          children: [
            { value: 31, label: '3级全部' },
            { value: 32, label: '数据采集器' },
            { value: 33, label: '传感器' }
          ]
        }
      ]
    },
    { value: 3, label: '校园卫生产品' }
  ]);

  const handleSearch = () => {};

  const handleTagChange = selection => {
    selectedParams.value = selection;
  };

  const goPage = () => {
    router.push('/articles/categories');
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
