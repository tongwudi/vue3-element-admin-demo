<template>
  <div class="login">
    <div class="login-box">
      <div class="brand">
        <img src="@/assets/img/login-logo.png" />
        <span>管理中心</span>
      </div>
      <el-card class="sign-card">
        <div class="card_tab">登录</div>
        <el-form ref="formRef" size="large" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              :prefix-icon="User"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              :prefix-icon="Lock"
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 100%"
              type="primary"
              :loading="loading"
              @click="login(formRef)"
            >
              登录
            </el-button>
          </el-form-item>
          <el-divider />
        </el-form>
        <div class="other-link">
          <el-button type="info" link>忘记密码</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
  import { User, Lock } from '@element-plus/icons-vue';
  import { fatchLogin } from '@/api/index';

  const router = useRouter();

  const formRef = ref(null);
  const form = ref({});
  const rules = reactive({
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  });
  const loading = ref(false);

  const login = async formEl => {
    if (!formEl) return;
    try {
      // 1. 表单验证
      const valid = await formEl.validate();
      if (!valid) return;

      loading.value = true;

      // 2. 执行登录
      const res = await fatchLogin({ ...form.value });
      localStorage.setItem('token', res.token);

      router.push('/');
    } finally {
      loading.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100vh;
    background: url('@/assets/img/login-bg.jpg') no-repeat 50% fixed;
    background-size: 1920px 1080px;
  }
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -64%);
    .brand {
      height: 60px;
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 70px;
      > img {
        height: 100%;
      }
      > span {
        line-height: 60px;
        font-size: 40px;
      }
    }
    .sign-card {
      width: 440px;
      background: url('../assets/img/login-bg.jpg') no-repeat 50% fixed;
      background-size: 1920px 1080px;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
      border: 1px solid hsla(0, 0%, 100%, 0.7);
      border-radius: 4px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: inherit;
        filter: blur(10px);
      }
    }
    .card_tab {
      text-align: center;
      margin-bottom: 24px;
      font-size: 18px;
    }
    .other-link {
      text-align: right;
    }
  }

  :deep(.el-card__body) {
    position: relative;
    padding: 20px 35px;
  }
  :deep(.el-input__wrapper) {
    background: hsla(0, 0%, 100%, 0.4);
  }

  .el-input--large,
  .el-button--large {
    height: 50px;
    font-size: 18px;
  }
  .el-button.is-link {
    --el-button-text-color: #d5d9dd;
  }
</style>
