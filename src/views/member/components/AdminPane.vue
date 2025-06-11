<template>
  <div style="margin-bottom: 20px">
    <el-button type="primary">添加管理员</el-button>
  </div>
  <div class="info">管理员可以回答问答栏目的问题</div>

  <VueDraggable
    v-model="userList"
    target="tbody"
    handle=".handle"
    :animation="150"
  >
    <el-table :data="userList" row-key="name">
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
      <el-table-column label="操作" width="200" align="center">
        <template #default>
          <el-button size="small" type="primary">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
          <el-button size="small" type="default" class="handle">移动</el-button>
        </template>
      </el-table-column>
    </el-table>
  </VueDraggable>
</template>

<script setup>
  import { VueDraggable } from 'vue-draggable-plus';

  const userList = ref([
    { name: '路飞', roles: '船长·格斗家·D之一族' },
    { name: '索隆', roles: '剑豪·战斗员·三刀流大师' },
    { name: '娜美', roles: '航海士·气象学家·财务官' },
    { name: '山治', roles: '厨师·格斗家·黑足' },
    { name: '罗宾', roles: '考古学家·历史正文解读者' }
  ]);
</script>

<style lang="scss" scoped>
  .info {
    margin-bottom: 20px;
    font-size: 12px;
  }
  .handle {
    cursor: move;
  }
</style>
