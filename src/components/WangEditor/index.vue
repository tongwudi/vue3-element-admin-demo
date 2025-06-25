<template>
  <div
    style="border: 1px solid var(--el-border-color); width: 100%; z-index: 99"
  >
    <!-- 工具栏 -->
    <Toolbar
      style="border-bottom: 1px solid var(--el-border-color)"
      :default-config="toolbarConfig"
      :editor="editorRef"
    />
    <!-- 编辑器 -->
    <Editor
      :style="{ height: height, overflowY: 'hidden' }"
      :default-config="editorConfig"
      v-model="modelValue"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css';
  import { Toolbar, Editor } from '@wangeditor/editor-for-vue';

  defineProps({
    height: {
      type: String,
      default: '400px'
    }
  });

  const emit = defineEmits(['customBrowseAndUpload']);

  // 双向绑定
  const modelValue = defineModel('modelValue', {
    type: String,
    default: ''
  });

  // 编辑器实例，必须用 shallowRef，重要！
  const editorRef = shallowRef();

  // 工具栏配置
  const toolbarConfig = ref({
    excludeKeys: ['todo', 'code', 'codeBlock', 'codeSelectLang', 'group-video']
  });

  // 编辑器配置
  const editorConfig = ref({
    placeholder: '请输入内容...',
    html: '',
    MENU_CONF: {
      uploadImage: {
        // 自定义选择图片
        customBrowseAndUpload(insertFn) {
          emit('customBrowseAndUpload', insertFn);
        },
        // 自定义上传
        customUpload(file, insertFn) {}
      }
    }
  });

  // 记录 editor 实例，重要！
  const handleCreated = editor => {
    editorRef.value = editor;
    // 查询编辑器注册的所有菜单 key （可能有的不在工具栏上）
    // console.log(editor.getAllMenuKeys());
  };

  // 组件销毁时，也及时销毁编辑器，重要！
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });

  defineExpose({
    clear() {
      return editorRef.value.clear();
    },
    isEmpty() {
      return editorRef.value.isEmpty();
    }
  });
</script>
