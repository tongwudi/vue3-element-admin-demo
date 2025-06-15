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
      <el-form-item label="资源">
        <UploadImage v-model="form.picUrl" />
      </el-form-item>
      <el-form-item label="上传目录">
        <el-tag>{{ node.label }}</el-tag>
      </el-form-item>
      <el-form-item label="标签管理">
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
      </el-form-item>
    </el-form>
    <el-row justify="center">
      <el-button @click="handleLibraryClick">取消</el-button>
      <el-button type="primary">确定</el-button>
    </el-row>
  </div>
</template>

<script setup>
  import UploadImage from '@/components/Upload/index.vue';
  import { Plus } from '@element-plus/icons-vue';

  const props = defineProps({
    node: {
      type: Object,
      default: () => ({})
    }
  });

  const emit = defineEmits(['change']);

  const form = ref({});
  const rules = ref([]);

  const inputRef = ref(null);
  const inputVisible = ref(false);
  const inputValue = ref('');
  const dynamicTags = ref([]);

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      inputRef.value?.input?.focus();
    });
  };
  const handleInputConfirm = () => {
    if (inputValue.value) {
      dynamicTags.value.push(inputValue.value);
    }
    inputVisible.value = false;
    inputValue.value = '';
  };
  const handleClose = tag => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  };

  const handleLibraryClick = () => {
    emit('change', { type: 'library' });
  };
</script>

<style lang="scss" scoped>
  .card-box {
    border-top: 0;
  }
  .tags {
    display: flex;
    gap: 5px;
  }
</style>
