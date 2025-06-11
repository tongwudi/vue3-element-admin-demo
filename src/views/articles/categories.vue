<template>
  <div class="card-box categories" shadow="never">
    <el-row justify="space-between">
      <!-- <el-button :icon="ArrowLeft">返回</el-button> -->
      <el-link :icon="ArrowLeft" underline="never" @click="router.back()">
        返回
      </el-link>
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        添加分类
      </el-button>
    </el-row>
    <el-divider />

    <el-row class="categories-content" :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>分类列表</template>
          <el-tree
            ref="treeRef"
            :data="dataSource"
            node-key="id"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
            draggable
            @node-click="nodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
                <el-row style="gap: 15px">
                  <el-link
                    type="primary"
                    underline="never"
                    :icon="Plus"
                    @click.stop="append(data)"
                  />
                  <el-link
                    type="danger"
                    underline="never"
                    :icon="Delete"
                    @click.stop="remove(node, data)"
                  />
                </el-row>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card
          shadow="never"
          style="background-color: #f5f8fa"
          v-show="isDisplay"
        >
          <template #header>
            <el-row align="middle" justify="space-between">
              <span>设置分类</span>
              <el-button
                style="font-size: 20px"
                :icon="Close"
                link
                @click="handleClose"
              ></el-button>
            </el-row>
          </template>
          <el-form
            ref="formRef"
            label-width="80px"
            label-position="left"
            require-asterisk-position="right"
            :model="form"
            :rules="rules"
          >
            <el-form-item label="图片">
              <div class="upload">
                <el-icon :size="24"><Plus /></el-icon>
                <span>选择图片</span>
              </div>
            </el-form-item>
            <el-form-item label="名称" prop="label">
              <el-input v-model="form.label" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="上级分类" prop="id">
              <el-tree-select
                style="width: 100%"
                v-model="form.id"
                :data="dataSource"
                node-key="id"
                default-expand-all
              />
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="form.describe"
                type="textarea"
                placeholder="请输入描述"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="updateForm">
                {{ form.id ? '更新' : '创建' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { ArrowLeft, Plus, Delete, Close } from '@element-plus/icons-vue';

  const router = useRouter();

  const treeRef = ref(null);
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

  let id = 1000;
  const append = data => {
    const newChild = { id: id++, label: 'testtest', children: [] };
    if (!data.children) {
      data.children = [];
    }
    data.children.push(newChild);
    dataSource.value = [...dataSource.value];
  };
  const remove = (node, data) => {
    const parent = node.parent;
    const children = parent.data.children || parent.data;
    const index = children.findIndex(d => d.id === data.id);
    children.splice(index, 1);
    dataSource.value = [...dataSource.value];
    handleClose();
  };
  const nodeClick = (data, node) => {
    console.log('当前选中:', data);
    const { children, ...obj } = data;
    form.value = { ...obj };
    isDisplay.value = true;
  };

  const isDisplay = ref(false);
  const formRef = ref(null);
  const form = ref({
    id: '',
    label: '',
    category: 4,
    describe: ''
  });
  const rules = reactive({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择上级分类', trigger: 'change' }]
  });

  const handleAdd = () => {
    resetForm();
    treeRef.value.setCurrentKey();
    isDisplay.value = true;
  };
  const handleClose = () => {
    resetForm();
    isDisplay.value = false;
  };
  const resetForm = () => {
    if (!formRef.value) return;
    formRef.value.resetFields();
  };
  const updateForm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(valid => {
      if (valid) {
        console.log('submit!');
      }
    });
  };
</script>

<style lang="scss" scoped>
  .categories {
    height: calc(100% - 34px);
    flex-direction: column;
    &-content {
      flex: 1;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-card {
    height: 100%;
  }
</style>
