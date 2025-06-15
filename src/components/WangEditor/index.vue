<template>
  <div style="border: 1px solid var(--el-border-color)">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :mode="mode"
      :default-config="toolbarConfig"
      style="border-bottom: 1px solid var(--el-border-color)"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="modelValue"
      :style="{ height: height, overflowY: 'hidden' }"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css';
  import { Toolbar, Editor } from '@wangeditor/editor-for-vue';

  defineProps({
    mode: {
      type: String,
      // defaul: 默认模式 - 集成了 wangEditor 所有功能
      // simpl: 简洁模式 - 仅有部分常见功能，但更加简洁易用
      default: 'default'
    },
    height: {
      type: String,
      default: '400px'
    }
  });

  // 双向绑定
  const modelValue = defineModel('modelValue', {
    type: String,
    required: false
  });

  // 编辑器实例，必须用 shallowRef，重要！
  const editorRef = shallowRef();

  // 工具栏配置
  const toolbarConfig = ref({
    excludeKeys: ['fullScreen', 'todo', 'code', 'codeBlock', 'codeSelectLang'],
    insertKeys: {
      keys: []
    }
  });

  // 编辑器配置
  const editorConfig = ref({
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
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
    setHtml(html) {
      editorRef.value?.setHtml(html);
    }
  });
</script>
