<template>
  <el-drawer
    size="100%"
    v-model="visible"
    :show-close="false"
    :close-on-press-escape="false"
    class="media-drawer"
    header-class="drawer-header"
    @open="handleOpen"
  >
    <template #header>
      <span class="drawer-header_title">
        课程{{ form.id ? '编辑' : '创建' }}
      </span>
      <el-row style="width: 100%" justify="space-between" align="middle">
        <el-link :icon="ArrowLeft" underline="never" @click="handleClose">
          返回
        </el-link>
        <el-row>
          <!-- <el-button link>预览效果</el-button> -->
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
              <div class="upload" @click="openLibraryDialog('IMAGE')">
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
            <el-form-item label="收费" prop="charge">
              <el-switch
                v-model="form.charge"
                inactive-value="N"
                active-value="Y"
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
          </div>
        </div>
        <div class="drawer-body_right">
          <div class="wrapper">
            <el-form-item label="课程名" prop="title">
              <el-input v-model="form.title" placeholder="请输入课程名" />
            </el-form-item>
            <el-form-item label="副标题" prop="keyWord">
              <el-input
                v-model="form.keyWord"
                placeholder="副标题、关键词或者简单描述，可不填"
              />
            </el-form-item>
            <el-form-item label="课程介绍" prop="content">
              <WangEditor
                ref="editorRef"
                v-model="form.content"
                @customBrowseAndUpload="customBrowseAndUpload"
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <template #label>
                <el-row justify="space-between">
                  <span>章节</span>
                  <div>
                    <el-button type="primary" link @click="appendChapter()">
                      添加章节
                    </el-button>
                    <el-button
                      type="primary"
                      link
                      @click="showChapterDialog = true"
                    >
                      添加媒体
                    </el-button>
                  </div>
                </el-row>
              </template>
              <el-tree
                style="width: 100%"
                ref="chapterTreeRef"
                :data="chapterTreeData"
                node-key="id"
                :props="{ label: 'name' }"
                highlight-current
                default-expand-all
                :expand-on-click-node="false"
              >
                <template #default="{ node, data }">
                  <div
                    class="custom-tree-node"
                    @mouseover="node.visibleButtons = true"
                    @mouseleave="node.visibleButtons = false"
                  >
                    <div style="display: flex; align-items: center; gap: 5px">
                      <template v-if="data.type == 'media'">
                        <el-icon><VideoCamera /></el-icon>
                      </template>
                      <el-input
                        v-if="node.inputVisible"
                        ref="inputRef"
                        size="small"
                        v-model="inputValue"
                        @keyup.enter="handleInputConfirm(node, data)"
                        @blur="handleInputConfirm(node, data)"
                      />
                      <span v-else @click="showInput(node)">
                        {{ node.label }}
                      </span>
                    </div>

                    <div v-show="node.visibleButtons">
                      <el-button
                        v-if="data.type == 'media'"
                        link
                        :icon="EditPen"
                      ></el-button>
                      <el-button
                        type="danger"
                        link
                        :icon="Remove"
                        @click="removeChapter(node, data)"
                      ></el-button>
                      <el-button
                        v-if="data.type != 'media'"
                        type="primary"
                        link
                        :icon="CirclePlus"
                        @click="appendChapter(data)"
                      ></el-button>
                    </div>
                  </div>
                </template>
              </el-tree>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </el-drawer>

  <MediaLibraryDialog
    v-model="showDialog"
    is-dialog
    :active-tab="activeTab"
    @confirm="handleChoose"
  />

  <ChapterDialog
    v-model="showChapterDialog"
    :option="chapterTreeData"
    :source="chapterSource"
    @open-library="openLibraryDialog"
    @confirm="handleSaveChapter"
  />
</template>

<script setup>
  import WangEditor from '@/components/WangEditor/index.vue';
  import MediaLibraryDialog from '@/components/MediaLibraryDialog/index.vue';
  import ChapterDialog from './ChapterDialog.vue';
  import {
    ArrowLeft,
    VideoCamera,
    EditPen,
    Remove,
    CirclePlus
  } from '@element-plus/icons-vue';
  import Media from '@/api/media';
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

  const activeTab = ref('IMAGE');

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
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ validator: validatorContent, trigger: 'change' }]
  });
  const treeData = ref([]);
  const showDialog = ref(false);

  const chapterTreeRef = ref();
  const chapterTreeData = ref([]);
  const showChapterDialog = ref(false);
  const chapterSource = ref({});

  const inputRef = ref(null);
  const inputValue = ref('');

  const showInput = node => {
    node.inputVisible = true;
    nextTick(() => {
      inputValue.value = node.label;
      inputRef.value?.input?.focus();
    });
  };

  const handleInputConfirm = (node, data) => {
    if (inputValue.value) {
      data.name = inputValue.value;
    }
    node.inputVisible = false;
    inputValue.value = '';
  };

  const handleOpen = () => {
    resetForm();
    getData();
  };

  const getTreeData = async () => {
    const res = await Media.queryTreeById({ id: '' });
    treeData.value = res;
  };

  const getDetail = async () => {
    const res = await Media.queryDetailById({ id: props.row.id });
    const content = await fetchTxtContent(res.introductionFileUrl);
    form.value = { ...res, weightValue: +res.weightValue, content };
  };

  const getChapterTreeData = async () => {
    const res = await Media.queryChapterTreeById({ id: '' });
    chapterTreeData.value = res;
  };

  const getData = () => {
    const queue = props.row.id ? [getDetail(), getChapterTreeData()] : [];
    Promise.all([getTreeData(), ...queue]);
  };

  const changeWeight = () => {
    form.value.weightValue = null;
  };

  let cachedInsertFn = null;
  const customBrowseAndUpload = insertFn => {
    cachedInsertFn = insertFn;
    showDialog.value = true;
  };

  const handleChoose = (url, info) => {
    if (cachedInsertFn) {
      cachedInsertFn(url);
      cachedInsertFn = null;
      return;
    }
    if (showChapterDialog.value) {
      chapterSource.value = { ...info };
      return;
    }
    form.value.coverImgUrl = url;
  };

  const openLibraryDialog = tab => {
    activeTab.value = tab;
    showDialog.value = true;
  };

  const appendChapter = data => {
    if (!data) {
      const node = chapterTreeRef.value.getCurrentNode();
      node ? append(node) : append();
      return;
    }
    append(data);
  };

  const append = data => {
    const timeStamp = Date.now();
    const newChild = { id: timeStamp, name: `新建目录`, children: [] };
    if (!data) {
      chapterTreeData.value.push(newChild);
      return;
    }
    if (!data.children) {
      data.children = [];
    }
    const isMedia = data.children.some(v => v.type === 'media');
    if (isMedia) {
      ElMessage.warning('该章节子项不全是目录，不能添加子目录');
      return;
    }
    data.children.push(newChild);
    chapterTreeData.value = [...chapterTreeData.value];
  };

  const removeChapter = (node, data) => {
    const hasChild = data.children?.length > 0;
    ElMessageBox.confirm(
      `确定删除 < ${node.label} > ${hasChild ? '及所有子' : ''}分类吗？`,
      '警告',
      { type: 'warning' }
    )
      .then(async () => {
        await Media.deleteChapterTreeById({ id: data.id });
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        chapterTreeData.value = [...chapterTreeData.value];
        ElMessage.success('删除成功');
      })
      .catch(() => {});
  };

  const handleSaveChapter = async () => {
    const params = {};
    await Media.addChapterTreeById(params);
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
    await Media.editStatus(params);
    form.value.status = params.status;
    ElMessage.success('状态修改成功');
  };

  const uplpadBlobToOSS = content => {
    return new Promise(async (resolve, reject) => {
      try {
        const blob = new Blob([content], {
          type: 'text/html; charset=utf-8'
        });
        const path = 'Media/File';
        // 生成文件名
        blob.name = `media-${Date.now()}.txt`;
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
        introductionFileId: res.fileId,
        introductionFileUrl: res.fileUrl
      };
      const fetch = id ? Media.updateById : Media.add;
      await fetch(params);
      ElMessage.success(id ? '更新成功' : '创建成功');
      reset();
      emit('submit');
    });
  };
</script>

<style lang="scss">
  .media-drawer {
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
        width: 360px;
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
      &_right {
        flex: 1;
        margin-left: 380px;
        .wrapper {
          padding: 20px;
          background-color: #fff;
        }
      }
    }
  }
</style>
<style scoped>
  .upload {
    width: 320px;
    height: 240px;
  }
</style>
