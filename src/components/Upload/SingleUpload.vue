<template>
  <el-upload class="custom-upload-drag" v-bind="uploadProps">
    <template v-if="uploadProps.drag">
      <div class="previrw-wrapper" v-if="modelValue">
        <el-image :src="modelValue" />
      </div>
      <div v-else>
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖放到此处或<em>单击上传</em></div>
        <div class="el-upload__tip">最大上传大小: {{ maxFileSize }}MB</div>
      </div>
    </template>

    <template v-else>
      <el-button type="primary">选择文件</el-button>
    </template>

    <template #tip v-if="!uploadProps.drag">
      <div class="el-upload__tip">最大上传大小: {{ maxFileSize }}MB</div>
    </template>
  </el-upload>
</template>

<script setup>
  import { useUpload } from '@/hooks/useUpload';

  const props = defineProps({
    maxFileSize: {
      type: Number,
      default: 16
    }
  });
  const attrs = useAttrs();
  const modelValue = defineModel('modelValue');
  const emit = defineEmits(['onSuccess']);

  const { uploadProps } = useUpload({
    ...attrs,
    ...props,
    limit: 1,
    onSuccess: res => {
      modelValue.value = res.fileUrl;
      emit('onSuccess', res);
    },
    onRemove: () => {
      modelValue.value = '';
    }
  });
</script>

<style lang="scss" scoped>
  .custom-upload-drag {
    width: 100%;
    :deep(.el-upload-dragger) {
      height: 300px;
      display: flex;
      padding: 0;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  .previrw-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
  }
</style>
