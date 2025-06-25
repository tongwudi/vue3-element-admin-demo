<template>
  <el-row class="operate" justify="space-between">
    <div>
      <!-- <el-button plain @click="handleCheckAll">
        {{ isAllCheck ? '取消' : '' }}全选
      </el-button> -->
      <el-button plain :icon="RefreshRight" @click="handleRefresh">
        刷新
      </el-button>
      <template v-if="!isDialog">
        <el-button @click="handleSingleUpload">上传</el-button>
      </template>
    </div>
    <!-- <el-input
      style="width: 200px"
      v-model="searchVal"
      :prefix-icon="Search"
      placeholder="搜索"
    /> -->
  </el-row>

  <div class="card-box">
    <el-table
      style="height: 100%"
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :highlight-current-row="isDialog"
      @current-change="handleCurrentChange"
    >
      <!-- <el-table-column
        v-if="isDialog"
        type="selection"
        width="55"
        align="center"
      /> -->
      <el-table-column v-if="isDialog" width="55" align="center">
        <template #default="{ row }">
          <el-radio v-model="selectedId" :value="row.id" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="curTab == 'IMAGE'"
        label="缩略图"
        width="200"
        align="center"
      >
        <template #default="{ row }">
          <el-row justify="center">
            <el-image
              style="width: 80px; height: 60px"
              :src="row.fileUrl"
              :previewSrcList="[row.fileUrl]"
              preview-teleported
              @click.stop.prevent
            />
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="name" />
      <el-table-column
        label="文件大小"
        prop="fileSize"
        width="180"
        align="center"
      />
      <el-table-column
        label="操作"
        :width="curTab == 'IMAGE' ? 120 : 160"
        align="center"
      >
        <template #default="{ row }">
          <el-button
            v-if="row.mediaType == 'AUDIO_VIDEO'"
            size="small"
            :icon="View"
            circle
            @click="handleView(row)"
          />
          <el-button
            size="small"
            :icon="Edit"
            circle
            @click="handleEdit(row)"
          />
          <el-button
            size="small"
            :icon="Delete"
            circle
            @click="handleDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-row :gutter="20">
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
    </el-row> -->
  </div>
</template>

<script setup>
  import {
    RefreshRight,
    Search,
    View,
    Edit,
    Delete
  } from '@element-plus/icons-vue';
  import MediaLibrary from '@/api/media-library';
  import { previewFile } from '@/api/index';

  defineOptions({
    inheritAttrs: false
  });

  const props = defineProps({
    isDialog: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['change', 'select']);

  const curNode = inject('currentNode');
  const curTab = inject('currentTab');

  const loading = ref(false);
  const searchVal = ref('');
  const tableRef = ref();
  const tableData = ref([]);
  const selectedRows = ref([]);
  const selectedId = ref();
  // const maskIndex = ref(-1);
  // const isAllCheck = ref(false);

  const getData = () => {
    loading.value = true;
    const params = {
      classificationId: curNode.value.id == 'all' ? '' : curNode.value.id,
      mediaType: curTab.value
    };
    MediaLibrary.queryPage(params)
      .then(res => {
        tableData.value = res.records;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const handleRefresh = () => {
    getData();
  };

  const handleCurrentChange = row => {
    if (!props.isDialog) return;
    selectedRows.value = row;
    selectedId.value = row.id;
    emit('select', selectedRows.value);
  };

  const handleView = async row => {
    const fileRes = await previewFile({ id: row.fileId });
    window.open(fileRes[0].url);
  };

  const handleEdit = row => {
    emit('change', { type: 'upload', id: row.id });
  };

  const handleDelete = row => {
    ElMessageBox.confirm(`确定删除 < ${row.name} > 吗？`, '警告', {
      type: 'warning'
    })
      .then(async () => {
        await MediaLibrary.deleteFile({ id: row.id });
        ElMessage.success('删除成功');
        getData();
      })
      .catch(() => {});
  };

  // const handleCheckAll = () => {
  //   items.value = items.value.map(v => {
  //     v.checked = !isAllCheck.value;
  //     return v;
  //   });
  //   isAllCheck.value = items.value.every(v => v.checked);
  // };

  // const handleCheckChange = () => {
  //   isAllCheck.value = items.value.every(v => v.checked);
  // };

  const handleSingleUpload = () => {
    emit('change', { type: 'upload' });
  };

  defineExpose({ getData });
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

  // .grid-item {
  //   margin-bottom: 15px;
  //   .cover {
  //     padding: 5px 10px;
  //     border: 1px solid #eee;
  //     font-size: 0;
  //     position: relative;
  //     .el-image {
  //       width: 100%;
  //       padding-top: 60%;
  //       height: 0;
  //       position: relative;
  //       :deep(img) {
  //         position: absolute;
  //         inset: 0;
  //         height: 100%;
  //       }
  //     }
  //     .mask {
  //       width: 100%;
  //       height: 100%;
  //       padding: 5px;
  //       position: absolute;
  //       right: 0;
  //       top: 0;
  //       background-color: rgba(0, 100, 221, 0.5);
  //     }
  //     .check-btn {
  //       position: absolute;
  //       left: 5px;
  //       top: 10px;
  //       .el-checkbox {
  //         height: auto;
  //       }
  //     }
  //   }
  //   .title {
  //     font-size: 12px;
  //     line-height: 1.5;
  //     margin-top: 5px;
  //     text-align: center;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //   }
  // }
</style>
