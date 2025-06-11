<template>
  <div class="header">
    <router-link class="brand" to="/">
      <img src="@/assets/img/login-logo.png" />
      <span>管理中心</span>
    </router-link>

    <el-dropdown @command="handleCommand">
      <div class="profile">
        <el-avatar
          :size="32"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <div class="profile-info">
          <div class="name">远大朗威</div>
          <div class="account">llongwill</div>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/store';

  const route = useRoute();
  const router = useRouter();

  const userStore = useUserStore();

  const handleCommand = command => {
    if (command === 'logout') {
      ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        userStore.logout().then(() => {
          router.push(`/login?redirect=${route.fullPath}`);
        });
      });
    }
  };
</script>

<style lang="scss" scoped>
  .header {
    height: 100%;
    display: flex;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 5px;
    > img {
      height: 30px;
    }
    > span {
      font-size: 20px;
    }
  }
  .profile {
    outline: unset;
    // padding: 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    // &:hover {
    //   background-color: rgba(0, 0, 0, 0.04);
    // }
    cursor: pointer;
    &-info {
      height: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: 14px;
        color: #000;
      }
      .account {
        font-size: 12px;
        color: #7b7b7b;
      }
    }
  }
</style>
