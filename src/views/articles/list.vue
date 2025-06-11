<template>
  <el-card shadow="never">
    <el-row style="margin-bottom: 20px" justify="space-between">
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
        <el-button @click="goPage">分类管理</el-button>
        <el-button type="primary" @click="drawer = true">创建文章</el-button>
      </div>
    </el-row>

    <TagSelector
      :show="showTags"
      :tagsData="tagsData"
      :initialLevel="selectedParams"
      @change="handleTagChange"
    />
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

  <el-drawer
    size="100%"
    v-model="drawer"
    :show-close="false"
    class="articles-drawer"
    header-class="drawer-header"
  >
    <template #header>
      <el-row justify="space-between">
        <el-link :icon="ArrowLeft" underline="never" @click="drawer = false">
          返回
        </el-link>
        <span>文章编辑</span>
        <el-row>
          <el-checkbox
            style="margin-right: 12px"
            v-show="showPreviewBtn"
            v-model="openPreview"
            label="开启右侧预览"
          />
          <el-button type="primary">保存草稿</el-button>
          <el-button>发布</el-button>
        </el-row>
      </el-row>
    </template>
    <el-form
      style="height: 100%"
      ref="formRef"
      label-width="100px"
      label-position="left"
      require-asterisk-position="right"
      :model="form"
      :rules="rules"
    >
      <div class="drawer-body">
        <div class="drawer-body_left">
          <el-form-item label="封面">
            <div class="upload">
              <el-icon :size="24"><Plus /></el-icon>
              <span>选择封面</span>
            </div>
          </el-form-item>
          <el-form-item label="摘要" prop="name">
            <el-input
              v-model="form.name"
              type="textarea"
              placeholder="请输入摘要"
            />
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-tree-select
              style="width: 100%"
              v-model="form.category"
              :data="dataSource"
              node-key="id"
            />
          </el-form-item>
          <el-form-item label="权重设置" prop="category">
            <el-select style="width: 100%" v-model="form.category">
              <el-option label="默认" value="0" />
              <el-option label="高" value="1" />
              <el-option label="中" value="2" />
              <el-option label="低" value="3" />
              <el-option label="自定义" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="自定义权重" prop="num">
            <el-input-number
              style="width: 100%"
              v-model="form.num"
              :precision="0"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="发布时间" prop="time">
            <el-date-picker
              style="width: 100%"
              v-model="form.time"
              type="date"
              placeholder="选择时间"
            />
          </el-form-item>
          <el-form-item label="收费" prop="aa">
            <el-switch v-model="form.aa" />
          </el-form-item>
          <el-form-item label="需要口令" prop="aa">
            <el-switch v-model="form.aa" />
          </el-form-item>
          <el-form-item label="置顶" prop="aa">
            <el-switch v-model="form.aa" />
          </el-form-item>
          <el-form-item label="原文链接">
            <el-input v-model="form.describe" />
          </el-form-item>
          <el-form-item label="别名">
            <el-input v-model="form.describe" />
          </el-form-item>
        </div>
        <div class="drawer-body_center">
          <el-form-item label-width="0">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
          <el-divider />
          <el-form-item label-width="0">
            <el-input
              v-model="form.desc"
              placeholder="副标题、关键词或者简单描述，可不填"
            />
          </el-form-item>
          <WangEditor
            style="margin-top: 10px"
            v-model="form.value"
            height="400px"
          />
        </div>
        <div class="drawer-body_right" v-show="openPreview">
          <div class="preview-action">
            <span>手机端样式预览</span>
            <el-switch size="large" v-model="isPhoneStyle">
              <template #active-action>
                <span>是</span>
              </template>
              <template #inactive-action>
                <span>否</span>
              </template>
            </el-switch>
          </div>
          <div class="phone" v-show="isPhoneStyle">
            <img class="shell" src="@/assets//icons/mobile.svg" />
            <div class="screen">
              <div class="screen-wrapper">
                <h3 class="title" v-show="form.title">{{ form.title }}</h3>
                <div class="desc" v-show="form.desc">{{ form.desc }}</div>
                <div class="content" v-html="form.value"></div>
              </div>
            </div>
          </div>
          <div class="common" v-show="!isPhoneStyle">
            <h3 class="title" v-show="form.title">{{ form.title }}</h3>
            <div class="desc" v-show="form.desc">{{ form.desc }}</div>
            <div class="content" v-html="form.value"></div>
          </div>
        </div>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup>
  import TagSelector from '@/components/TagSelector/index.vue';
  import WangEditor from '@/components/WangEditor/index.vue';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import { ArrowLeft } from '@element-plus/icons-vue';

  const router = useRouter();
  const searchForm = ref({});
  const showTags = ref(true);
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

  const drawer = ref(false);

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

  const formRef = ref(null);
  const form = ref({
    name: '',
    category: 4,
    describe: ''
  });
  const rules = reactive({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择上级分类', trigger: 'change' }]
  });
  const dataSource = ref([
    {
      id: 1,
      label: 'Level one 1',
      children: [
        {
          id: 4,
          label: 'Level two 1-1',
          children: [
            {
              id: 9,
              label: 'Level three 1-1-1'
            },
            {
              id: 10,
              label: 'Level three 1-1-2'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: 'Level one 2',
      children: [
        {
          id: 5,
          label: 'Level two 2-1'
        },
        {
          id: 6,
          label: 'Level two 2-2'
        }
      ]
    },
    {
      id: 3,
      label: 'Level one 3',
      children: [
        {
          id: 7,
          label: 'Level two 3-1'
        },
        {
          id: 8,
          label: 'Level two 3-2'
        }
      ]
    }
  ]);
  const showPreviewBtn = ref(false);
  const openPreview = ref(false);
  const WIDTH_DESKTOP = 1440;
  const width = useWindowSize().width;
  const isPhoneStyle = ref(true);
  // 监听窗口宽度变化，调整设备类型和侧边栏状态
  watchEffect(() => {
    const isDesktop = width.value >= WIDTH_DESKTOP;
    showPreviewBtn.value = isDesktop;
    !showPreviewBtn.value && (openPreview.value = false);
  });
</script>

<style lang="scss" scoped></style>
