<template>
  <el-row class="operate" justify="space-between">
    <div>
      <el-button plain @click="handleCheckAll">
        {{ isAllCheck ? '取消' : '' }}全选
      </el-button>
      <el-button plain :icon="RefreshRight">刷新</el-button>
      <template v-if="showUpload">
        <el-button @click="handleSingleUpload">上传</el-button>
      </template>
    </div>
    <el-input
      style="width: 200px"
      v-model="input"
      placeholder="搜索"
      :prefix-icon="Search"
    />
  </el-row>

  <div class="card-box">
    <el-row :gutter="20">
      <el-col :md="8" :lg="6" v-for="(item, index) in items" :key="index">
        <div class="grid-item">
          <div
            class="cover"
            @mouseenter="maskIndex = index"
            @mouseleave="maskIndex = -1"
          >
            <el-image
              fit="contain"
              :src="
                index % 2
                  ? 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                  : yNsxFC8rLHMZQcK
              "
            />
            <div class="check-btn">
              <el-checkbox
                v-show="maskIndex == index || item.checked"
                v-model="item.checked"
                @change="handleCheckChange"
              />
            </div>
            <div class="mask" v-show="maskIndex == index">
              <el-row justify="end" align="middle">
                <el-button size="small" :icon="View" plain circle />
                <el-button size="small" :icon="EditPen" plain circle />
              </el-row>
            </div>
          </div>
          <div class="title">{{ item.title }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { RefreshRight, Search, View, EditPen } from '@element-plus/icons-vue';
  import yNsxFC8rLHMZQcK from '@/assets/img/yNsxFC8rLHMZQcK.jpg';

  defineOptions({
    inheritAttrs: false
  });

  const props = defineProps({
    showUpload: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['change']);

  const input = ref('');
  const items = ref([
    { title: '售后服务', checked: false },
    { title: '产品介绍', checked: false },
    { title: '技术支持', checked: false },
    { title: '用户指南', checked: false },
    { title: '配件购买', checked: false },
    { title: '维修服务', checked: false },
    { title: '保修政策', checked: false },
    { title: '常见问题', checked: false }
  ]);
  const maskIndex = ref(-1);
  const isAllCheck = ref(false);

  const handleCheckAll = () => {
    items.value = items.value.map(v => {
      v.checked = !isAllCheck.value;
      return v;
    });
    isAllCheck.value = items.value.every(v => v.checked);
  };
  const handleCheckChange = () => {
    isAllCheck.value = items.value.every(v => v.checked);
  };
  const handleAdd = () => {
    treeRef.value.setCurrentKey();
  };

  const handleSingleUpload = () => {
    emit('change', { type: 'upload' });
  };
</script>

<style lang="scss" scoped>
  .operate {
    padding: 10px 20px;
    background-color: #f8f8f8;
    border: 1px solid #e4e7ed;
    border-bottom: none;
  }

  .card-box {
    height: 100%;
    overflow: auto;
  }

  .grid-item {
    margin-bottom: 15px;
    .cover {
      padding: 5px 10px;
      border: 1px solid #eee;
      font-size: 0;
      position: relative;
      .el-image {
        width: 100%;
        padding-top: 60%;
        height: 0;
        position: relative;
        :deep(img) {
          position: absolute;
          inset: 0;
          height: 100%;
        }
      }
      .mask {
        width: 100%;
        height: 100%;
        padding: 5px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: rgba(0, 100, 221, 0.5);
      }
      .check-btn {
        position: absolute;
        left: 5px;
        top: 10px;
        .el-checkbox {
          height: auto;
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
  }
</style>
