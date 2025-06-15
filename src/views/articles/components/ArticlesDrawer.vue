<template>
  <el-drawer
    size="100%"
    v-bind="$attrs"
    :show-close="false"
    class="articles-drawer"
    header-class="drawer-header"
  >
    <template #header>
      <span class="drawer-header_title">文章编辑</span>
      <el-row style="width: 100%" justify="space-between" align="middle">
        <el-link :icon="ArrowLeft" underline="never" @click="handleClose">
          返回
        </el-link>
        <el-row>
          <el-checkbox
            style="margin-right: 12px"
            v-show="showPreviewBtn"
            v-model="openPreview"
            label="开启右侧预览"
          />
          <el-button @click="handleSave">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">发布</el-button>
        </el-row>
      </el-row>
    </template>

    <el-form
      ref="formRef"
      label-width="100px"
      label-position="top"
      require-asterisk-position="right"
      :model="form"
      :rules="rules"
    >
      <div class="drawer-body">
        <div class="drawer-body_left">
          <el-form-item>
            <div class="upload">
              <el-icon :size="24"><Plus /></el-icon>
              <span>选择封面</span>
            </div>
          </el-form-item>
          <el-form-item label="摘要" prop="name">
            <el-input
              v-model="form.name"
              type="textarea"
              placeholder="请输入摘要"
            />
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-tree-select
              style="width: 100%"
              v-model="form.category"
              :data="dataSource"
              node-key="id"
            />
          </el-form-item>
          <el-form-item label="权重设置" prop="category">
            <el-select style="width: 100%" v-model="form.category">
              <el-option label="默认" value="0" />
              <el-option label="高" value="1" />
              <el-option label="中" value="2" />
              <el-option label="低" value="3" />
              <el-option label="自定义" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="自定义权重" prop="num">
            <el-input-number
              style="width: 100%"
              v-model="form.num"
              :precision="0"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="发布时间" prop="time">
            <el-date-picker
              style="width: 100%"
              v-model="form.time"
              type="date"
              placeholder="选择时间"
            />
          </el-form-item>
          <el-form-item label="收费">
            <el-switch v-model="form.aa" />
          </el-form-item>
          <el-form-item label="需要口令">
            <el-switch v-model="form.bb" />
          </el-form-item>
          <el-form-item label="置顶">
            <el-switch v-model="form.cc" />
          </el-form-item>
          <el-form-item label="原文链接">
            <el-input v-model="form.describe" />
          </el-form-item>
          <el-form-item label="别名">
            <el-input v-model="form.describe" />
          </el-form-item>
        </div>
        <div class="drawer-body_center">
          <div class="wrapper">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input
                v-model="form.desc"
                placeholder="副标题、关键词或者简单描述，可不填"
              />
            </el-form-item>
            <WangEditor v-model="form.value" height="400px" />
          </div>
        </div>
        <div class="drawer-body_right" v-show="openPreview">
          <div class="preview-action">
            <span>手机端样式预览</span>
            <el-switch size="large" v-model="isPhoneStyle">
              <template #active-action>
                <span>是</span>
              </template>
              <template #inactive-action>
                <span>否</span>
              </template>
            </el-switch>
          </div>
          <div class="phone" v-show="isPhoneStyle">
            <img class="shell" src="@/assets//icons/mobile.svg" />
            <div class="screen">
              <div class="screen-wrapper">
                <h3 class="title" v-show="form.title">{{ form.title }}</h3>
                <div class="desc" v-show="form.desc">{{ form.desc }}</div>
                <div class="content" v-html="form.value"></div>
              </div>
            </div>
          </div>
          <div class="common" v-show="!isPhoneStyle">
            <h3 class="title" v-show="form.title">{{ form.title }}</h3>
            <div class="desc" v-show="form.desc">{{ form.desc }}</div>
            <div class="content" v-html="form.value"></div>
          </div>
        </div>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup>
  import WangEditor from '@/components/WangEditor/index.vue';
  import { ArrowLeft } from '@element-plus/icons-vue';

  const emit = defineEmits(['close']);

  const formRef = ref(null);
  const form = ref({
    title: '',
    category: 4,
    describe: ''
  });
  const rules = reactive({
    title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择上级分类', trigger: 'change' }]
  });
  const dataSource = ref([
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
  ]);
  const showPreviewBtn = ref(false);
  const openPreview = ref(false);
  const isPhoneStyle = ref(true);
  const width = useWindowSize().width;
  const WIDTH_DESKTOP = 1440;
  watchEffect(() => {
    const isDesktop = width.value >= WIDTH_DESKTOP;
    showPreviewBtn.value = isDesktop;
    !showPreviewBtn.value && (openPreview.value = false);
  });

  const handleClose = () => {
    emit('close');
  };

  const handleSave = () => {};

  const handleSubmit = async () => {
    await formRef.value.validate(valid => {
      if (valid) {
        console.log('submit!');
      }
    });
  };
</script>

<style lang="scss">
  .articles-drawer {
    background-color: #eff1f5 !important;
    .el-drawer__body {
      padding: 0;
    }
    .drawer-header {
      height: 60px;
      padding: 0 20px;
      margin-bottom: 0;
      background-color: #fff;
      box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
      z-index: 9;
      position: relative;
      &_title {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
      }
    }
    .drawer-body {
      display: flex;
      gap: 10px;
      &_left {
        height: calc(100vh - 60px);
        padding: 20px;
        overflow: auto;
        background-color: #f9f9f9;
      }
      &_center {
        flex: 1;
        .wrapper {
          padding: 20px;
          background-color: #fff;
        }
      }
      &_right {
        display: flex;
        flex-direction: column;
      }
    }
    .preview-action {
      width: 100%;
      display: flex;
      padding: 10px 30px;
      justify-content: space-between;
      align-items: center;
      background-color: #f9f9f9;
    }
    .phone {
      padding: 10px;
      position: relative;
      .shell {
        width: 414px;
      }
      .screen {
        width: 375px;
        height: 667px;
        padding: 8px;
        position: absolute;
        top: 105px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 0 0 30px 30px;
        background-color: #fff;
        .screen-wrapper {
          height: 100%;
          overflow: auto;
        }
      }
    }
    .common {
      width: 414px;
      padding: 10px;
      background-color: #fff;
      box-sizing: content-box;
      overflow: auto;
      .title {
        font-size: 14px;
        line-height: 24px;
        margin: 12px 0;
        &::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          margin-top: 5px;
          background-color: #19cda6;
        }
      }
      .desc {
        font-size: 14px;
        margin-bottom: 12px;
        font-weight: 700;
        color: #19cda6;
      }
    }
    .common,
    .screen-wrapper {
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
      }
      &:hover::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
