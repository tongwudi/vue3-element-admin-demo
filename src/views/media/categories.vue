<template>
  <div class="categories">
    <el-card shadow="never">
      <el-row justify="space-between">
        <!-- <el-button :icon="ArrowLeft">返回</el-button> -->
        <el-link :icon="ArrowLeft" underline="never" @click="router.back()">
          返回
        </el-link>
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          添加分类
        </el-button>
      </el-row>
    </el-card>

    <el-row :gutter="20" style="flex: 1; overflow: hidden">
      <el-col :span="12" style="height: 100%">
        <el-card
          shadow="hover"
          style="height: 100%"
          body-style="height: calc(100% - 61px);overflow: auto;"
        >
          <template #header>
            <span>分类列表</span>
          </template>
          <el-tree
            ref="treeRef"
            :data="treeData"
            node-key="id"
            :props="{ label: 'name' }"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            draggable
            @node-click="nodeClick"
          >
            <template #default="{ node, data }">
              <div
                class="custom-tree-node"
                @mouseover="node.visibleButtons = true"
                @mouseleave="node.visibleButtons = false"
              >
                <span>{{ node.label }}</span>
                <div v-show="node.visibleButtons">
                  <el-button
                    type="danger"
                    link
                    :icon="Remove"
                    @click.stop="remove(node, data)"
                  ></el-button>
                  <el-button
                    type="primary"
                    link
                    :icon="CirclePlus"
                    @click.stop="append(data)"
                  ></el-button>
                </div>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="12" style="height: 100%">
        <el-card
          shadow="never"
          style="height: 100%; background-color: #f5f8fa"
          body-style="height: calc(100% - 61px);overflow: auto;"
          v-show="isDisplay"
        >
          <template #header>
            <el-row align="middle" justify="space-between">
              <span>设置分类</span>
              <el-button link @click="close">
                <el-icon size="20"><Close /></el-icon>
              </el-button>
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
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="上级分类" prop="parentId">
              <el-tree-select
                style="width: 100%"
                v-model="form.parentId"
                :data="treeSelectData"
                :props="{ label: 'name' }"
                node-key="id"
                default-expand-all
                check-strictly
              />
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="form.description"
                type="textarea"
                placeholder="请输入描述"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="submitForm">
                {{ form.id ? '更新' : '添加' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { ArrowLeft, Plus, Remove, CirclePlus } from '@element-plus/icons-vue';
  import Media from '@/api/media';

  const router = useRouter();

  const treeRef = ref(null);
  const treeData = ref([]);
  const treeSelectData = ref([{ name: '全部', id: 'all', children: [] }]);

  const isDisplay = ref(false);
  const formRef = ref(null);
  const form = ref({});
  const rules = reactive({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    parentId: [{ required: true, message: '请选择上级分类', trigger: 'change' }]
  });

  const getTreeData = async () => {
    const res = await Media.queryTreeById({ id: '' });
    treeData.value = res;
    treeSelectData.value = [{ name: '全部', id: 'all', children: res }];
  };

  const handleAdd = () => {
    resetForm();
    form.value = { parentId: 'all' };
    isDisplay.value = true;
    treeRef.value.setCurrentKey();
  };

  const nodeClick = data => {
    resetForm();
    const { children, ...obj } = data;
    form.value = { ...obj, parentId: obj.parentId || 'all' };
    isDisplay.value = true;
  };

  const append = data => {
    resetForm();
    form.value = { parentId: data.id };
    isDisplay.value = true;
    treeRef.value.setCurrentKey(data.id);
  };

  const remove = (node, data) => {
    const hasChild = data.children?.length > 0;
    ElMessageBox.confirm(
      `确定删除 < ${node.label} > ${hasChild ? '及所有子' : ''}分类吗？`,
      '警告',
      { type: 'warning' }
    )
      .then(async () => {
        await Media.deleteTreeById({ id: data.id });
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        treeData.value = [...treeData.value];
        ElMessage.success('删除成功');
        close();
      })
      .catch(() => {});
  };

  const close = () => {
    resetForm();
    isDisplay.value = false;
  };

  const resetForm = () => {
    if (!formRef.value) return;
    formRef.value.resetFields();
  };

  const submitForm = () => {
    if (!formRef.value) return;
    formRef.value.validate(async valid => {
      if (!valid) return;
      const { id, parentId, ...other } = form.value;
      const params = {
        ...other,
        id,
        parentId: parentId == 'all' ? '' : parentId
      };
      const fetch = id ? Media.updateTreeById : Media.addTreeById;
      await fetch(params);
      ElMessage.success(id ? '更新成功' : '添加成功');
      close();
      getTreeData();
    });
  };

  onMounted(() => {
    getTreeData();
  });
</script>

<style lang="scss" scoped></style>
