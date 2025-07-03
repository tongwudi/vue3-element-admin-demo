<template>
  <div class="card-box">
    <el-form
      ref="formRef"
      label-width="80px"
      label-position="left"
      require-asterisk-position="right"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="资源" prop="fileUrl">
        <VodUpload
          v-if="curTab == 'AUDIO_VIDEO'"
          v-model="form.fileUrl"
          v-bind="uploadProps"
          @onSuccess="getFileData"
        />
        <UploadImage
          v-else
          v-model="form.fileUrl"
          v-bind="uploadProps"
          @onSuccess="getFileData"
        />
      </el-form-item>
      <el-form-item label="文件名" prop="name" v-if="form.fileUrl">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="上传目录">
        <el-tag>{{ curNode.name }}</el-tag>
      </el-form-item>
      <!-- <el-form-item label="标签管理">
        <div class="tags">
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            effect="dark"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="inputRef"
            size="small"
            v-model="inputValue"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else size="small" :icon="Plus" @click="showInput">
            添加
          </el-button>
        </div>
      </el-form-item> -->
    </el-form>
    <el-row justify="center">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-row>
  </div>
</template>

<script setup>
  import UploadImage from '@/components/Upload/index.vue';
  import VodUpload from '@/components/Upload/VodUpload.vue';
  // import { Plus } from '@element-plus/icons-vue';
  import MediaLibrary from '@/api/media-library';

  const emit = defineEmits(['change']);

  const curNode = inject('currentNode');
  const curTab = inject('currentTab');

  const formRef = ref();
  const form = ref({});
  const rules = reactive({
    fileUrl: [{ required: true, message: '请先上传文件', trigger: 'blur' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
  });

  const uploadProps = computed(() => {
    const obj = {
      IMAGE: {
        accept: 'image/*',
        maxFileSize: 16,
        drag: true
      },
      AUDIO_VIDEO: {
        accept: 'video/*',
        maxFileSize: 500
      },
      DOCUMENT: {
        accept: '.pdf,.doc,.xls,.ppt,.doc,.xlsx,.pptx',
        maxFileSize: 20,
        drag: false
      }
    };
    return obj[curTab.value];
  });

  const getFileData = file => {
    form.value.fileId = file.fileId;
    form.value.name = file.fileName;
    form.value.fileSize = file.fileSize;
  };

  const getDetail = async id => {
    const res = await MediaLibrary.queryDetailById({ id });
    form.value = res;
  };

  const handleCancel = () => {
    emit('change', { type: 'library' });
  };

  const handleSubmit = () => {
    if (!formRef.value) return;
    formRef.value.validate(async valid => {
      if (!valid) return;
      const params = {
        ...form.value,
        classificationId: curNode.value.id == 'all' ? '' : curNode.value.id,
        mediaType: curTab.value
      };
      const fetch = form.value.id
        ? MediaLibrary.updateFileById
        : MediaLibrary.addFile;
      await fetch(params);
      ElMessage.success(form.value.id ? '更新成功' : '添加成功');
      handleCancel();
    });
  };

  // const inputRef = ref(null);
  // const inputVisible = ref(false);
  // const inputValue = ref('');
  // const dynamicTags = ref([]);

  // const showInput = () => {
  //   inputVisible.value = true;
  //   nextTick(() => {
  //     inputRef.value?.input?.focus();
  //   });
  // };

  // const handleInputConfirm = () => {
  //   if (inputValue.value) {
  //     dynamicTags.value.push(inputValue.value);
  //   }
  //   inputVisible.value = false;
  //   inputValue.value = '';
  // };

  // const handleClose = tag => {
  //   dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  // };

  defineExpose({ getDetail });
</script>

<style lang="scss" scoped>
  .card-box {
    border-top: 0;
  }
  // .tags {
  //   display: flex;
  //   gap: 5px;
  // }
</style>
