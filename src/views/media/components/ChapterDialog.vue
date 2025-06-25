<template>
  <el-dialog
    v-model="visible"
    title="添加媒体"
    append-to-body
    destroy-on-close
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      label-position="top"
      require-asterisk-position="right"
      :model="form"
      :rules="rules"
    >
      <div class="chapter-dialog">
        <div class="chapter-dialog_top">
          <el-form-item label="图片">
            <div class="upload">
              <div
                v-if="!form.coverImgUrl"
                class="upload-wrapper"
                @click="openLibrary('IMAGE')"
              >
                <el-icon :size="24"><Plus /></el-icon>
                <span>选择封面</span>
              </div>
              <template v-else>
                <el-image
                  style="width: 100%; height: 100%"
                  :src="form.coverImgUrl"
                  @click="openLibrary('IMAGE')"
                />
              </template>
            </div>
          </el-form-item>
          <div>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="上级目录" prop="classificationTypeId">
              <el-tree-select
                style="width: 100%"
                v-model="form.classificationTypeId"
                :data="treeData"
                :props="{ label: 'name' }"
                default-expand-all
                node-key="id"
              />
            </el-form-item>
            <el-form-item label="媒体资源" prop="media">
              <el-input v-model="form.media" readonly>
                <template #prepend>
                  <el-button @click="openLibrary('AUDIO_VIDEO')">
                    {{ form.media ? '重选' : '从媒体库选择' }}
                  </el-button>
                </template>
                <template v-if="form.media" #append>03:00</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="chapter-dialog_bottom">
          <el-form-item label="描述" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="6" />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  const props = defineProps({
    option: {
      type: Array,
      default: () => []
    },
    source: {
      type: [String, Object]
    }
  });

  const visible = defineModel('modelValue', {
    type: Boolean,
    default: false
  });

  const emit = defineEmits(['openLibrary', 'confirm']);

  const formRef = ref(null);
  const form = ref({});
  const rules = reactive({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    classificationTypeId: [
      { required: true, message: '请选择上级目录', trigger: 'change' }
    ],
    media: [{ required: true, message: '请选择媒体资源', trigger: 'change' }]
  });
  const treeData = computed(() => [
    { name: '全部', id: 'all', children: props.option }
  ]);

  const handleConfirm = () => {
    if (!formRef.value) return;
    formRef.value.validate(async valid => {
      if (!valid) return;

      emit('confirm');
      closeDialog();
    });
  };

  const openLibrary = tabName => {
    emit('openLibrary', tabName);
  };

  const resetForm = () => {
    if (!formRef.value) return;
    formRef.value.resetFields();
  };

  const closeDialog = () => {
    resetForm();
    visible.value = false;
  };
</script>

<style lang="scss">
  .chapter-dialog {
    &_top {
      display: flex;
      gap: 20px;
    }
    .upload {
      width: 320px;
      height: 240px;
    }
  }
</style>
