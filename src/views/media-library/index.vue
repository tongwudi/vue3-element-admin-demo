<template>
  <div class="row-fixed">
    <div class="col-fixed">
      <div class="card-box">
        <div>
          <el-tree
            ref="treeRef"
            :data="dataSource"
            node-key="id"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
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
                    v-if="node.level !== 1"
                    type="danger"
                    underline="never"
                    :icon="Delete"
                    @click.stop="remove(node, data)"
                  />
                </el-row>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
    </div>

    <div class="col-flex">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="图片" name="image"></el-tab-pane>
        <el-tab-pane label="音视频" name="video"></el-tab-pane>
        <el-tab-pane label="文档" name="document"></el-tab-pane>
      </el-tabs>

      <el-row class="operate" justify="space-between">
        <div>
          <el-button>全选</el-button>
          <el-button :icon="RefreshRight">刷新</el-button>
          <el-button>上传</el-button>
          <el-button type="primary">批量上传</el-button>
          <!-- <el-button :icon="Plus">创建目录</el-button> -->
        </div>
        <div>
          <el-row justify="end" align="middle">
            <el-input
              style="width: 200px"
              v-model="input"
              placeholder="搜索"
              :prefix-icon="Search"
            />
          </el-row>
        </div>
      </el-row>

      <div class="card-box">
        <el-row :gutter="20">
          <el-col
            :lg="4"
            :md="8"
            :sm="12"
            v-for="item in 8"
            style="margin-bottom: 15px"
          >
            <div class="cover">
              <el-image
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              />
            </div>
            <div class="title">售后服务</div>
          </el-col>
          <el-col :lg="4" :md="8" :sm="12">
            <div class="cover">
              <el-image :src="yNsxFC8rLHMZQcK" />
            </div>
            <div class="title">售后服务</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Plus, Delete, RefreshRight, Search } from '@element-plus/icons-vue';
  import yNsxFC8rLHMZQcK from '@/assets/img/yNsxFC8rLHMZQcK.jpg';

  const activeName = ref('image');

  const treeRef = ref(null);
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
  };
  const nodeClick = (data, node) => {
    console.log('当前选中:', data, node);
  };

  const input = ref('');

  const handleAdd = () => {
    treeRef.value.setCurrentKey();
  };
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .operate {
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
  }

  .card-box {
    height: 100%;
    overflow: auto;
  }

  .cover {
    padding: 5px;
    border: 1px solid #eee;
    .el-image {
      width: 100%;
      padding-top: 75%;
      height: 0;
      position: relative;
      :deep(img) {
        position: absolute;
        inset: 0;
        height: 100%;
      }
    }
  }
  .title {
    font-size: 12px;
    line-height: 1.5;
    margin-top: 5px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
