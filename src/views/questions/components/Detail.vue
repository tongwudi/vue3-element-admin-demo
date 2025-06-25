<template>
  <el-card shadow="never">
    <template #header>
      <el-link :icon="ArrowLeft" underline="never" @click="handleCancel">
        返回
      </el-link>
    </template>

    <el-card shadow="never">
      <template #header>
        <div class="question-header">
          <el-avatar
            shape="square"
            :size="24"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span>{{ question.userName }}</span>
          <span class="time">{{ question.createTime }}</span>
          <el-tag
            style="margin-left: auto"
            :type="renderStatus(question.replyStatus).type"
          >
            {{ renderStatus(question.replyStatus).text }}
          </el-tag>
        </div>
      </template>
      <div class="question-body">{{ question.content }}</div>
    </el-card>

    <div class="answer-list" v-show="!isReply && answerList.length > 0">
      <el-timeline hide-timestamp>
        <el-timeline-item v-for="answer in answerList" :key="answer.id">
          <div class="item-top">
            <el-avatar
              shape="square"
              :size="24"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <span>{{ answer.answerUserName }}</span>
            <span class="time">{{ answer.createTime }}</span>
            <el-button type="primary" link @click="handleReply(answer)">
              编辑
            </el-button>
          </div>
          <div class="item-bottom">{{ answer.content }}</div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>

  <el-card v-show="!isReply && answerList.length == 0">
    <div class="no-answer">
      <span>目前没有答复</span>
      <el-button type="primary" link @click="handleReply()">添加答复</el-button>
    </div>
  </el-card>

  <el-card v-show="isReply">
    <el-form
      ref="formRef"
      require-asterisk-position="right"
      label-width="80px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="回复人员" prop="answerUserId">
        <el-select
          style="width: 200px"
          v-model="form.answerUserId"
          placeholder="请选择管理员作答"
          @change="handleChange"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="回复内容" prop="content">
        <el-input
          style="width: 400px"
          v-model="form.content"
          type="textarea"
          :rows="10"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="isReply = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
  import Questions from '@/api/questions';
  import { ArrowLeft } from '@element-plus/icons-vue';
  import Member from '@/api/member';

  const props = defineProps({
    params: {
      type: Object,
      default: () => ({})
    }
  });

  const emit = defineEmits(['change']);

  const isReply = ref(false);

  const question = ref({});
  const answerList = ref([]);
  const options = ref([]);

  const formRef = ref();
  const form = ref({});
  const rules = reactive({
    answerUserId: [
      { required: true, message: '请选择回复人员', trigger: 'change' }
    ],
    content: [{ required: true, message: '请输入回复内容', trigger: 'change' }]
  });

  const renderStatus = status => {
    const obj = {
      ANSWERED: { type: 'success', text: '已回答' },
      NOANSWER: { type: 'danger', text: '待回答' }
    };
    return obj[status] || obj.NOANSWER;
  };

  const handleQuery = () => {
    Promise.all([getQuestionDetail(), getAnswerData()]);
  };

  const getQuestionDetail = async () => {
    const res = await Questions.queryDetailById({ id: props.params?.id });
    question.value = res || {};
  };

  const getAnswerData = async () => {
    const res = await Questions.queryAnswerList({ id: props.params?.id });
    answerList.value = res || [];
  };

  const getOptions = async () => {
    const res = await Member.querySupportPage();
    options.value = res.records;
  };

  const handleReply = answer => {
    isReply.value = true;
    getOptions();
    form.value = answer || {};
  };

  const handleChange = val => {
    const obj = options.value.find(item => item.id === val);
    form.value.answerUserName = obj?.name || '';
  };

  const handleCancel = () => {
    emit('change', { type: 'list' });
  };

  const handleSubmit = () => {
    formRef.value.validate(async valid => {
      if (!valid) return;
      const { id, ...obj } = form.value;
      const params = { ...obj, id };
      const fetch = id ? Questions.updateAnswerById : Questions.addAnswer;
      await fetch(params);
      ElMessage.success(id ? '更新成功' : '提交成功');
      handleQuery();
      isReply.value = false;
    });
  };

  onMounted(() => {
    handleQuery();
  });
</script>

<style lang="scss" scoped>
  .el-card + .el-card {
    margin-top: 20px;
  }

  .el-timeline-item:last-child {
    padding-bottom: 0;
  }

  .question-header,
  .answer-list .item-top {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    .time {
      color: #ccc;
    }
  }

  .question-body,
  .answer-list .item-bottom {
    font-size: 14px;
    color: #515a6e;
  }

  .answer-list {
    padding: 20px 10px 0;
    .item-bottom {
      margin-top: 10px;
    }
  }

  .no-answer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
