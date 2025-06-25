<template>
  <div style="margin-bottom: 20px">
    <el-button type="primary" @click="visible = true">添加管理员</el-button>
  </div>
  <div class="info">管理员可以回答问答栏目的问题</div>

  <!-- <VueDraggable
    v-model="tableData"
    target="tbody"
    handle=".handle"
    :animation="150"
  > -->
  <el-table v-loading="loading" :data="tableData">
    <el-table-column label="名称">
      <template #default="{ row }">
        <el-row align="middle">
          <el-avatar
            shape="square"
            :size="24"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span style="margin-left: 5px">{{ row.name }}</span>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="{ row }">
        <el-button size="small" type="danger" @click="handleDelete(row)">
          删除
        </el-button>
        <!-- <el-button size="small" type="default" class="handle">移动</el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <!-- </VueDraggable> -->

  <el-dialog
    width="600px"
    v-model="visible"
    title="添加管理员"
    append-to-body
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="modal-content">
      <span>
        请先在微信中访问应用，进入“我的”栏目，同意授权后方能添加管理员
      </span>
      <el-select
        style="width: 100%"
        v-model="wxUserId"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="searchLoading"
        placeholder="请选择一位用户"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="!wxUserId" @click="handleAddAdmin">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  // import { VueDraggable } from 'vue-draggable-plus';
  import Member from '@/api/member';

  const visible = ref(false);
  const options = ref([]);
  const wxUserId = ref('');

  const loading = ref(true);
  const searchLoading = ref(false);
  const queryParams = reactive({
    pageSize: 10,
    pageNum: 1
  });
  const tableData = ref([]);
  // const total = ref(0);

  const remoteMethod = query => {
    if (query) {
      searchLoading.value = true;
      Member.queryUserList({ nickName: query })
        .then(res => {
          options.value = res.map(v => {
            return { value: v.id, label: v.nickName };
          });
        })
        .finally(() => {
          searchLoading.value = false;
        });
    } else {
      options.value = [];
    }
  };

  const handleAddAdmin = () => {
    Member.addUserToTchSupport({ wxUserId: wxUserId.value }).then(res => {
      ElMessage.success('添加成功');
      visible.value = false;
      getData();
    });
  };

  const getData = () => {
    loading.value = true;
    Member.querySupportPage(queryParams)
      .then(res => {
        tableData.value = res.records;
        // total.value = res.total;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const handleDelete = ({ id }) => {
    ElMessageBox.confirm(`确定删除此管理员吗？`, '警告', {
      type: 'warning'
    })
      .then(async () => {
        await Member.deleteSupport({ id });
        ElMessage.success('删除成功');
        getData();
      })
      .catch(() => {});
  };

  onMounted(() => {
    getData();
  });
</script>

<style lang="scss" scoped>
  .info {
    margin-bottom: 20px;
    font-size: 12px;
  }

  .handle {
    cursor: move;
  }

  .modal-content {
    padding: 60px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
