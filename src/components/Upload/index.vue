<template>
  <el-upload
    class="custom-upload-drag"
    v-model="modelValue"
    v-bind="uploadProps"
    :show-file-list="!drag"
  >
    <template v-if="drag">
      <div class="previrw-wrapper" v-if="modelValue">
        <el-image
          :src="
            modelValue ||
            'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          "
        />
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

    <template #tip v-if="!drag">
      <div class="el-upload__tip text-red">
        最大上传大小: {{ maxFileSize }}MB
      </div>
    </template>
  </el-upload>
</template>

<script setup>
  import { useUpload } from '@/hooks/useUpload';

  const props = defineProps({
    drag: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    /**
     * 最大文件大小（单位：M）
     */
    maxFileSize: {
      type: Number,
      default: 16
    },
    /**
     * 请求携带的额外参数
     */
    data: {
      type: Object,
      default: () => ({})
    }
  });

  const emit = defineEmits(['onSuccess']);

  const modelValue = defineModel('modelValue', {
    type: String,
    default: ''
  });

  const { uploadProps } = useUpload({
    ...props,
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
