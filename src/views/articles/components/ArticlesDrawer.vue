<template>
  <el-drawer
    size="100%"
    v-model="visible"
    :show-close="false"
    :close-on-press-escape="false"
    class="articles-drawer"
    header-class="drawer-header"
  >
    <template #header>
      <span class="drawer-header_title">
        文章{{ form.id ? '编辑' : '创建' }}
      </span>
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
          <el-button v-if="form.id" @click="handleChangeStatus">
            转为{{ form.status == 'PUBLISHED' ? '草稿' : '发布' }}
          </el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ form.id ? '更新' : '保存' }}
          </el-button>
        </el-row>
      </el-row>
    </template>

    <el-form
      ref="formRef"
      label-position="top"
      require-asterisk-position="right"
      :model="form"
      :rules="rules"
      @input.native="handleInputChange"
    >
      <div class="drawer-body">
        <div class="drawer-body_left">
          <div class="wrapper">
            <el-form-item>
              <div class="upload" @click="showDialog = true">
                <div v-if="!form.coverImgUrl" class="upload-wrapper">
                  <el-icon :size="24"><Plus /></el-icon>
                  <span>选择封面</span>
                </div>
                <template v-else>
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="form.coverImgUrl"
                  />
                </template>
              </div>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input
                v-model="form.summary"
                type="textarea"
                placeholder="请输入摘要"
              />
            </el-form-item>
            <el-form-item label="分类" prop="classificationTypeId">
              <el-tree-select
                style="width: 100%"
                v-model="form.classificationTypeId"
                :data="treeData"
                :props="{ label: 'name' }"
                default-expand-all
                node-key="id"
              />
            </el-form-item>
            <el-form-item label="权重设置" prop="weight">
              <el-select
                style="width: 100%"
                v-model="form.weight"
                @change="changeWeight"
              >
                <el-option label="默认" value="DEFAULT" />
                <el-option label="高" value="HEIGHT" />
                <el-option label="中" value="MEDIUM" />
                <el-option label="低" value="LOW" />
                <el-option label="自定义" value="CUSTOM" />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.weight == 'CUSTOM'"
              label="自定义权重"
              prop="weightValue"
            >
              <el-input-number
                style="width: 100%"
                v-model="form.weightValue"
                :precision="0"
                :step="1"
              />
            </el-form-item>
            <!-- <el-form-item label="发布时间" prop="time">
              <el-date-picker
                style="width: 100%"
                v-model="form.time"
                type="date"
                placeholder="选择时间"
              />
            </el-form-item> -->
            <el-form-item label="收费" prop="charge">
              <el-switch
                v-model="form.charge"
                inactive-value="N"
                active-value="Y"
              />
            </el-form-item>
            <el-form-item label="需要口令" prop="password">
              <el-switch
                v-model="form.password"
                inactive-value="N"
                active-value="Y"
              />
            </el-form-item>
            <el-form-item label="置顶" prop="top">
              <el-switch
                v-model="form.top"
                inactive-value="N"
                active-value="Y"
              />
            </el-form-item>
            <!-- <el-form-item label="原文链接">
              <el-input v-model="form.describe" />
            </el-form-item>
            <el-form-item label="别名">
              <el-input v-model="form.describe" />
            </el-form-item> -->
          </div>
        </div>
        <div class="drawer-body_center">
          <div class="wrapper">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="副标题" prop="description">
              <el-input
                v-model="form.description"
                placeholder="副标题、关键词或者简单描述，可不填"
              />
            </el-form-item>
            <el-form-item prop="content">
              <WangEditor ref="editorRef" v-model="form.content" />
            </el-form-item>
          </div>
        </div>
        <div class="drawer-body_right" v-show="openPreview">
          <!-- <div class="preview-action">
            <span>手机端样式预览</span>
            <el-switch size="large" v-model="isPhoneStyle">
              <template #active-action>
                <span>是</span>
              </template>
              <template #inactive-action>
                <span>否</span>
              </template>
            </el-switch>
          </div> -->
          <!-- <div class="phone" v-show="isPhoneStyle"> -->
          <div class="phone">
            <img class="shell" src="@/assets//icons/mobile.svg" />
            <div class="screen">
              <div class="screen-wrapper">
                <h3 class="title" v-show="form.title">{{ form.title }}</h3>
                <div class="desc" v-show="form.description">
                  {{ form.description }}
                </div>
                <div v-html="form.content"></div>
              </div>
            </div>
          </div>
          <!-- <div class="common" v-show="!isPhoneStyle">
            <h3 class="title" v-show="form.title">{{ form.title }}</h3>
            <div class="desc" v-show="form.description">
              {{ form.description }}
            </div>
            <div class="content" v-html="form.value"></div>
          </div> -->
        </div>
      </div>
    </el-form>
  </el-drawer>

  <MediaLibraryDialog v-model="showDialog" is-dialog @confirm="handleChoose" />
</template>

<script setup>
  import WangEditor from '@/components/WangEditor/index.vue';
  import MediaLibraryDialog from '@/components/MediaLibraryDialog/index.vue';
  import { ArrowLeft } from '@element-plus/icons-vue';
  import Articles from '@/api/articles';
  import { fetchTxtContent } from '@/utils/index';
  import { uploadToOSS } from '@/hooks/useUpload';

  const props = defineProps({
    row: {
      type: Object,
      default: () => ({})
    }
  });

  const emit = defineEmits(['submit']);

  const visible = defineModel('modelValue', {
    type: Boolean,
    default: false
  });

  const editorRef = ref();
  const validatorContent = (rule, value, callback) => {
    if (!value || editorRef.value.isEmpty()) {
      callback(new Error('请输入内容'));
    } else {
      callback();
    }
  };

  const formRef = ref(null);
  const form = ref({});
  const rules = reactive({
    title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    content: [{ validatorContent, trigger: 'blur' }]
  });
  const treeData = ref([]);
  const showDialog = ref(false);

  const showPreviewBtn = ref(false);
  const openPreview = ref(false);

  // const isPhoneStyle = ref(true);
  const width = useWindowSize().width;
  const WIDTH_DESKTOP = 1440;
  watchEffect(() => {
    const isDesktop = width.value >= WIDTH_DESKTOP;
    showPreviewBtn.value = isDesktop;
    !showPreviewBtn.value && (openPreview.value = false);
  });

  const getTreeData = async () => {
    const res = await Articles.queryTreeById({ id: '' });
    treeData.value = res;
  };

  const getDetail = async () => {
    const res = await Articles.queryDetailById({ id: props.row.id });
    const content = await fetchTxtContent(res.contentJsonUrl);
    form.value = { ...res, weightValue: +res.weightValue, content };
  };

  const getData = () => {
    const queue = props.row.id ? [getDetail()] : [];
    Promise.all([getTreeData(), ...queue]);
  };

  const changeWeight = val => {
    form.value.weightValue = null;
  };

  const handleChoose = url => {
    form.value.coverImgUrl = url;
  };

  const resetForm = () => {
    if (!formRef.value) return;
    formRef.value.resetFields();
  };

  let isDirty = false; // 表单是否有修改
  const handleInputChange = () => {
    isDirty = true;
  };

  const reset = () => {
    resetForm();
    visible.value = false;
    isDirty = false;
  };

  const handleClose = () => {
    if (!isDirty) {
      reset();
      return;
    }
    ElMessageBox.confirm(`系统可能不会保存您所做的更改`, '离开此页面？', {
      type: 'warning'
    })
      .then(() => {
        reset();
      })
      .catch(err => () => {});
  };

  const handleChangeStatus = async () => {
    const { id, status } = form.value;
    const params = {
      id,
      status: status == 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    };
    await Articles.editStatus(params);
    form.value.status = params.status;
    ElMessage.success('状态修改成功');
  };

  const uplpadBlobToOSS = content => {
    return new Promise(async (resolve, reject) => {
      try {
        const blob = new Blob([content], {
          type: 'text/html; charset=utf-8'
        });
        const path = 'Articles/File';
        // 生成文件名
        blob.name = `articles-${Date.now()}.txt`;
        const signData = await uploadToOSS(path, blob);
        resolve({ ...signData, fileName: blob.name });
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSubmit = () => {
    if (!formRef.value) return;
    formRef.value.validate(async valid => {
      if (!valid) return;
      const { id, content, status, ...obj } = form.value;
      const res = await uplpadBlobToOSS(content);
      const params = {
        ...obj,
        id,
        status: status || 'DRAFT',
        contentJsonId: res.fileId,
        contentJsonUrl: res.fileUrl
      };
      const fetch = id ? Articles.updateById : Articles.add;
      await fetch(params);
      ElMessage.success(id ? '更新成功' : '创建成功');
      reset();
      emit('submit');
    });
  };

  watch(visible, val => {
    if (!val) {
      form.value = {};
      return;
    }
    getData();
  });
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
      box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.05);
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
        width: 300px;
        height: calc(100vh - 60px);
        position: fixed;
        left: 0;
        top: 60px;
        background-color: #f9f9f9;
        overflow: auto;
        .wrapper {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
      }
      &_center {
        flex: 1;
        margin-left: 320px;
        .wrapper {
          padding: 20px;
          background-color: #fff;
        }
      }
      &_right {
        display: flex;
        flex-direction: column;
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
    }
    // .preview-action {
    //   width: 100%;
    //   display: flex;
    //   padding: 10px 30px;
    //   justify-content: space-between;
    //   align-items: center;
    //   background-color: #f9f9f9;
    // }
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
    // .common {
    //   width: 414px;
    //   padding: 10px;
    //   background-color: #fff;
    //   box-sizing: content-box;
    //   overflow: auto;
    // }
    // .common,
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
