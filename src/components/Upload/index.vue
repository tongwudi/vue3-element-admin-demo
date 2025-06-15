<template>
  <el-upload
    class="custom-upload-drag"
    v-model="modelValue"
    v-bind="uploadProps"
    drag
    :show-file-list="false"
  >
    <div class="previrw-wrapper" v-if="modelValue">
      <el-image
        :src="
          modelValue ||
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        "
      />
    </div>
    <template v-else>
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">将文件拖放到此处或<em>单击上传</em></div>
      <div class="el-upload__tip">最大上传大小: 16MB</div>
      <!-- <div class="el-upload__tip" v-if="multiple">上传数量限制: 20张</div> -->
    </template>
  </el-upload>
</template>

<script setup>
  import { useUpload } from '@/hooks/useUpload';

  const props = defineProps({
    limit: {
      type: Number,
      default: 20
    },
    /**
     * 最大文件大小（单位：M）
     */
    maxFileSize: {
      type: Number,
      default: 16
    },
    /**
     * 上传图片格式，默认支持所有图片(image/*)，指定格式示例：'.png,.jpg,.jpeg,.gif,.bmp'
     */
    accept: {
      type: String,
      default: 'image/*'
    },
    /**
     * 请求携带的额外参数
     */
    data: {
      type: Object,
      default: () => ({})
    }
  });

  const modelValue = defineModel('modelValue', {
    type: String,
    default: ''
  });

  const { uploadProps, fileList } = useUpload(props);
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
