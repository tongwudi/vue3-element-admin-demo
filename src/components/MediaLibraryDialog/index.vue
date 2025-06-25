<template>
  <el-dialog
    style="height: 80%"
    width="1250px"
    class="library-dialog"
    v-model="visible"
    title="媒体库"
    align-center
    append-to-body
    destroy-on-close
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <component :is="curComponent" v-bind="$attrs" @select="handleSelectRow" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          :disabled="mediaInfo == null"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import mediaLibrary from '@/views/media-library/index.vue';

  const visible = defineModel('modelValue', {
    type: Boolean,
    default: false
  });

  const emit = defineEmits(['confirm']);

  const curComponent = shallowRef(mediaLibrary);
  const mediaInfo = ref(null);

  const handleSelectRow = row => {
    mediaInfo.value = row;
  };

  const handleConfirm = () => {
    const { fileUrl } = mediaInfo.value;
    emit('confirm', fileUrl);
    closeDialog();
  };

  const closeDialog = () => {
    mediaInfo.value = null;
    visible.value = false;
  };
</script>

<style>
  .library-dialog .el-dialog__body {
    height: calc(100% - 40px - 48px);
  }
</style>
