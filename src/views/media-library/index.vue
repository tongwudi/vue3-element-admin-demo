<template>
  <div class="row-fixed">
    <div class="col-fixed">
      <div class="card-box">
        <el-tree
          ref="treeRef"
          :data="treeData"
          node-key="id"
          :props="{ label: 'name' }"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          @node-click="nodeClick"
        >
          <template #default="{ node, data }">
            <div
              v-if="!isDialog"
              class="custom-tree-node"
              @mouseover="node.visibleButtons = true"
              @mouseleave="node.visibleButtons = false"
            >
              <span>{{ node.label }}</span>
              <div v-show="node.visibleButtons">
                <el-button
                  v-if="node.level !== 1"
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
      </div>
    </div>

    <div class="col-flex">
      <el-tabs
        type="border-card"
        v-if="!isDialog"
        v-model="currentTab"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="图片" name="IMAGE"></el-tab-pane>
        <el-tab-pane label="音视频" name="AUDIO_VIDEO"></el-tab-pane>
        <el-tab-pane label="文档" name="DOCUMENT"></el-tab-pane>
      </el-tabs>

      <component
        ref="dynamicComponentRef"
        :is="curComponent"
        :isDialog="isDialog"
        @change="handleChangeCom"
        v-bind="$attrs"
      />
    </div>
  </div>

  <el-dialog
    width="400px"
    v-model="visible"
    title="创建目录"
    append-to-body
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-input v-model="catalogueName" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="!catalogueName" @click="addNode">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import LibraryComp from './components/LibraryComp.vue';
  import UploadComp from './components/UploadComp.vue';
  import { Remove, CirclePlus } from '@element-plus/icons-vue';
  import MediaLibrary from '@/api/media-library';

  const props = defineProps({
    isDialog: {
      type: Boolean,
      default: false
    },
    activeTab: {
      type: String,
      default: 'IMAGE'
    }
  });

  const components = {
    library: LibraryComp,
    upload: UploadComp
  };
  const dynamicComponentRef = ref();
  const curComponent = shallowRef(components.library);
  const currentTab = ref('');
  provide('currentTab', currentTab);

  const handleTabClick = () => {
    curComponent.value = components.library;
  };
  const handleChangeCom = obj => {
    curComponent.value = components[obj.type];
    nextTick(() => {
      if (dynamicComponentRef.value?.getData) {
        dynamicComponentRef.value.getData();
      }
      if (dynamicComponentRef.value?.getDetail && obj.id) {
        dynamicComponentRef.value.getDetail(obj.id);
      }
    });
  };

  watch(
    () => props.activeTab,
    val => (currentTab.value = val),
    { immediate: true }
  );

  const treeRef = ref(null);
  const treeData = ref([{ name: '全部', id: 'all', children: [] }]);
  const currentNode = ref({});
  provide('currentNode', currentNode);

  const visible = ref(false);
  const catalogueName = ref('');

  const getTreeData = async () => {
    const res = await MediaLibrary.getDirectoryTree();
    treeData.value = [{ name: '全部', id: 'all', children: res }];
    if (Object.keys(currentNode.value).length == 0) {
      // 默认选中"全部"节点
      treeRef.value.setCurrentKey('all');
      currentNode.value = treeRef.value.getCurrentNode();
    }
  };

  const nodeClick = data => {
    currentNode.value = data;
  };

  let tempNode;
  const append = data => {
    visible.value = true;
    tempNode = data;
  };

  const closeDialog = () => {
    tempNode = null;
    catalogueName.value = '';
    visible.value = false;
  };

  const addNode = async () => {
    const params = {
      parentId: tempNode.id,
      name: catalogueName.value
    };
    await MediaLibrary.addTreeById(params);
    ElMessage.success('创建成功');
    closeDialog();
    getTreeData();
  };

  const remove = (node, data) => {
    ElMessageBox.confirm(`确定删除 < ${node.label} > 吗？`, '警告', {
      type: 'warning'
    })
      .then(async () => {
        await MediaLibrary.deleteTreeById({ id: data.id });
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        treeData.value = [...treeData.value];
        ElMessage.success('删除成功');
        // 如果删除的是自身，改为选中'全部'分类
        if (currentNode.value.id == data.id) {
          treeRef.value.setCurrentKey('all');
          currentNode.value = treeRef.value.getCurrentNode();
        }
      })
      .catch(() => {});
  };

  // 监听树节点和 tabs 变化，触发数据更新
  watch([currentNode, currentTab], ([node, tab]) => {
    if (node && tab && dynamicComponentRef.value?.getData) {
      dynamicComponentRef.value.getData();
    }
  });

  onMounted(() => {
    getTreeData();
  });
</script>

<style lang="scss" scoped>
  .row-fixed {
    height: 100%;
    display: flex;
    gap: 20px;
    .col-fixed {
      width: 350px;
      flex-shrink: 0; /* 禁止收缩 */
    }
    .col-flex {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
  }

  .card-box {
    height: 100%;
    overflow: auto;
  }

  .el-tabs + :deep(.operate) {
    border-top: none;
  }
</style>
