<template>
  <div class="row-fixed">
    <div class="col-fixed">
      <div class="card-box">
        <el-tree
          ref="treeRef"
          :data="dataSource"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
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
        v-if="showTabs"
        v-model="currentTab"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="图片" name="image"></el-tab-pane>
        <el-tab-pane label="音视频" name="video"></el-tab-pane>
        <el-tab-pane label="文档" name="document"></el-tab-pane>
      </el-tabs>

      <component
        :is="curComponent"
        :node="curNode"
        :show-upload="showUpload"
        @change="handleChangeCom"
      />
    </div>
  </div>
</template>

<script setup>
  import LibraryComp from './components/LibraryComp.vue';
  import UploadComp from './components/UploadComp.vue';
  import { Remove, CirclePlus } from '@element-plus/icons-vue';

  const props = defineProps({
    showTabs: {
      type: Boolean,
      default: true
    },
    activeTag: {
      type: String,
      default: 'image'
    },
    showUpload: {
      type: Boolean,
      default: true
    }
  });

  const components = {
    library: LibraryComp,
    upload: UploadComp
  };
  const curComponent = shallowRef(components.library);
  const currentTab = ref('');

  const handleTabClick = () => {
    curComponent.value = components.library;
  };
  const handleChangeCom = obj => {
    curComponent.value = components[obj.type];
  };

  watch(
    () => props.activeTag,
    val => (currentTab.value = val),
    { immediate: true }
  );

  const treeRef = ref(null);
  const curNode = ref({});
  const dataSource = ref([
    {
      id: 0,
      label: '全部',
      children: [
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
      ]
    }
  ]);

  onMounted(() => {
    getTreeData();
  });

  const getTreeData = () => {
    // 默认选中"全部"节点
    treeRef.value.setCurrentKey(0);
    curNode.value = treeRef.value.getCurrentNode();
  };
  const nodeClick = (data, node) => {
    curNode.value = data;
  };

  const append = data => {
    const newId = Date.now(); // 使用时间戳作为新节点的ID
    const newChild = { id: newId, label: `新节点 ${newId}`, children: [] };
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
  };
</script>

<style lang="scss" scoped>
  .card-box {
    height: 100%;
    overflow: auto;
  }

  .el-tabs + :deep(.operate) {
    border-top: none;
  }
</style>
