<template>
  <div class="custom-upload-vod">
    <el-upload
      class="custom-upload-drag"
      v-model="modelValue"
      v-bind="uploadProps"
    >
      <el-button type="primary">选择文件</el-button>
      <template #tip>
        <div class="el-upload__tip text-red">
          最大上传大小: {{ maxFileSize }}MB
        </div>
      </template>
    </el-upload>

    <!-- <video :src="videoUrl" controls crossOrigin="anonymous"></video> -->
  </div>
</template>

<script setup>
  import { useVodUpload } from '@/hooks/useVodUpload';

  const props = defineProps({
    limit: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: 'video/*'
    },
    /**
     * 最大文件大小（单位：M）
     */
    maxFileSize: {
      type: Number,
      default: 500
    }
  });

  const emit = defineEmits(['onSuccess']);

  const modelValue = defineModel('modelValue', {
    type: String,
    default: ''
  });

  const { uploadProps } = useVodUpload({
    ...props,
    onSuccess: res => {
      // const fileRes = await previewFile({ id: res.fileId });
      // window.open(fileRes[0].url)
      modelValue.value = res.fileUrl;
      emit('onSuccess', res);
    },
    onRemove: () => {
      modelValue.value = '';
    }
  });

  // const statusClass = computed(() => {
  //   if (statusText.value.includes('成功')) return 'success';
  //   if (statusText.value.includes('失败')) return 'error';
  //   return 'info';
  // });

  // const videoUrl = ref('');

  // const initPlayer = () => {
  //   return new Aliplayer(
  //     {
  //       id: 'aliplayer',
  //       width: '400px',
  //       height: '300px',
  //       // definition: 'SD',
  //       defaultDefinition: 'SD',
  //       skinLayoutIgnore: [
  //         // 'bigPlayButton', // 隐藏大播放按钮
  //         // 'controlBar.fullScreenButton' // 隐藏控制条上的全屏按钮（通过点运算符进行子组件选择）
  //         'controlBar.subtitle', // 隐藏控制条上的点播按钮
  //         'controlBar.setting' // 隐藏控制条上的设置按钮
  //       ],
  //       source: videoUrl.value
  //     },
  //     player => {
  //       if (player._status === '')
  //         console.log(player, 'The player is created.');
  //     }
  //   );
  // };
</script>

<style lang="scss" scoped></style>
