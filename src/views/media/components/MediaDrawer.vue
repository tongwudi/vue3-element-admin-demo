<template>
  <el-drawer
    size="100%"
    v-bind="$attrs"
    :show-close="false"
    class="media-drawer"
    header-class="drawer-header"
  >
    <template #header>
      <span class="drawer-header_title">课程编辑</span>
      <el-row style="width: 100%" justify="space-between" align="middle">
        <el-link :icon="ArrowLeft" underline="never" @click="handleClose">
          返回
        </el-link>
        <el-row>
          <el-button link>预览效果</el-button>
          <el-button @click="handleSave">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">发布</el-button>
        </el-row>
      </el-row>
    </template>

    <el-form
      ref="formRef"
      label-width="65px"
      label-position="top"
      require-asterisk-position="right"
      :model="form"
      :rules="rules"
    >
      <div class="drawer-body">
        <div class="drawer-body_left">
          <div class="wrapper">
            <el-form-item label="课程名" prop="title">
              <el-input v-model="form.title" placeholder="请输入课程名" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input
                v-model="form.desc"
                placeholder="副标题、关键词或者简单描述，可不填"
              />
            </el-form-item>
            <WangEditor
              ref="wangEditorRef"
              height="400px"
              v-model="form.content"
            />
            <el-form-item
              style="margin-top: 18px"
              label-position="top"
              label="章节"
            >
              <el-tree
                style="width: 100%"
                :data="dataSource"
                node-key="id"
                highlight-current
                :expand-on-click-node="false"
                draggable
              >
                <template #default="{ node, data }">
                  <div
                    class="custom-tree-node"
                    @mouseover="node.visibleButtons = true"
                    @mouseleave="node.visibleButtons = false"
                  >
                    <el-input
                      v-if="node.inputVisible"
                      ref="inputRef"
                      size="small"
                      v-model="inputValue"
                      @keyup.enter="handleInputConfirm(node, data)"
                      @blur="handleInputConfirm(node, data)"
                    />
                    <span v-else @click="showInput(node)">
                      {{ node.label }}
                    </span>
                    <div v-show="node.visibleButtons">
                      <el-button link :icon="EditPen"></el-button>
                      <el-button type="danger" link :icon="Remove"></el-button>
                      <el-button
                        type="primary"
                        link
                        :icon="CirclePlus"
                      ></el-button>
                    </div>
                  </div>
                </template>
              </el-tree>
            </el-form-item>
          </div>
        </div>
        <div class="drawer-body_right">
          <el-form-item>
            <div class="upload">
              <el-icon :size="24"><Plus /></el-icon>
              <span>选择封面</span>
            </div>
          </el-form-item>
          <el-form-item label="收费">
            <el-switch v-model="form.aa" />
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-tree-select
              style="width: 100%"
              v-model="form.category"
              :data="dataSource"
              node-key="id"
            />
          </el-form-item>
          <el-form-item label="权重设置" prop="category">
            <el-select style="width: 100%" v-model="form.category">
              <el-option label="默认" value="0" />
              <el-option label="高" value="1" />
              <el-option label="中" value="2" />
              <el-option label="低" value="3" />
              <el-option label="自定义" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="自定义权重" prop="num">
            <el-input-number
              style="width: 100%"
              v-model="form.num"
              :precision="0"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="发布时间" prop="time">
            <el-date-picker
              style="width: 100%"
              v-model="form.time"
              type="date"
              placeholder="选择时间"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup>
  import WangEditor from '@/components/WangEditor/index.vue';
  import {
    ArrowLeft,
    Remove,
    EditPen,
    CirclePlus,
    Plus
  } from '@element-plus/icons-vue';

  const emit = defineEmits(['close']);

  const formRef = ref(null);
  const form = ref({
    title: '',
    category: 4
  });
  const rules = reactive({
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    category: [{ required: true, message: '请选择上级分类', trigger: 'change' }]
  });
  const wangEditorRef = ref(null);
  const dataSource = ref([
    {
      id: 1,
      label: 'Level one 1',
      children: [
        {
          id: 4,
          label: 'Level two 1-1',
          children: [
            {
              id: 9,
              label: 'Level three 1-1-1'
            },
            {
              id: 10,
              label: 'Level three 1-1-2'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: 'Level one 2',
      children: [
        {
          id: 5,
          label: 'Level two 2-1'
        },
        {
          id: 6,
          label: 'Level two 2-2'
        }
      ]
    },
    {
      id: 3,
      label: 'Level one 3',
      children: [
        {
          id: 7,
          label: 'Level two 3-1'
        },
        {
          id: 8,
          label: 'Level two 3-2'
        }
      ]
    }
  ]);

  const inputRef = ref(null);
  const inputValue = ref('');

  const showInput = node => {
    node.inputVisible = true;
    nextTick(() => {
      inputValue.value = node.label;
      inputRef.value?.input?.focus();
    });
  };

  const handleInputConfirm = (node, data) => {
    if (inputValue.value) {
      data.label = inputValue.value;
    }
    node.inputVisible = false;
    inputValue.value = '';
  };

  const handleClose = () => {
    emit('close');
  };

  const handleSave = () => {};

  const handleSubmit = async () => {
    await formRef.value.validate(valid => {
      if (valid) {
        console.log('submit!');
      }
    });
  };
</script>

<style lang="scss">
  .media-drawer {
    background-color: #eff1f5 !important;
    .el-drawer__body {
      padding: 0;
    }
    .drawer-header {
      height: 60px;
      padding: 0 20px;
      margin-bottom: 0;
      background-color: #fff;
      box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
      z-index: 9;
      position: relative;
      &_title {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
      }
    }
    .drawer-body {
      display: flex;
      gap: 10px;
      &_left {
        flex: 1;
        .wrapper {
          padding: 20px;
          background-color: #fff;
        }
      }
      &_right {
        height: calc(100vh - 60px);
        padding: 20px;
        overflow: auto;
        background-color: #f9f9f9;
      }
    }
  }
</style>
<style scoped>
  .upload {
    width: 320px;
    height: 240px;
  }
</style>
