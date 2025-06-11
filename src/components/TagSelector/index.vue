<template>
  <div class="tag-selector">
    <div class="tag-level1">
      <el-tag
        size="large"
        effect="dark"
        v-for="tag in level1Tags"
        :key="tag.value"
        :type="selectedLevel1 == tag[selectedKey] ? 'primary' : 'info'"
        @click="selectLevel1(tag)"
      >
        {{ tag.label }}
      </el-tag>
    </div>

    <div class="tag-level2" v-show="level2Tags.length > 0">
      <el-tag
        size="large"
        effect="dark"
        v-for="tag in level2Tags"
        :key="tag.value"
        :type="selectedLevel2 == tag[selectedKey] ? 'primary' : 'info'"
        @click="selectLevel2(tag)"
      >
        {{ tag.label }}
      </el-tag>
    </div>

    <div class="tag-level3" v-show="level3Tags.length > 0">
      <el-tag
        size="large"
        effect="dark"
        v-for="tag in level3Tags"
        :key="tag.value"
        :type="selectedLevel3 == tag[selectedKey] ? 'primary' : 'info'"
        @click="selectLevel3(tag)"
      >
        {{ tag.label }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    // 数据源
    tagsData: {
      type: Array,
      required: true,
      default: () => []
    },
    // 初始选中值
    initialLevel: {
      type: Array,
      default: () => []
    },
    selectedKey: {
      type: String,
      default: 'value'
    }
  });
  const emit = defineEmits(['change']);

  const selectedLevel1 = ref(props.initialLevel[0]);
  const selectedLevel2 = ref(props.initialLevel[1]);
  const selectedLevel3 = ref(props.initialLevel[2]);

  const level1Tags = computed(() => props.tagsData);
  const level2Tags = computed(() => {
    if (!selectedLevel1.value) return [];
    const level1Item = props.tagsData.find(
      item => item[props.selectedKey] === selectedLevel1.value
    );
    return level1Item?.children || [];
  });
  const level3Tags = computed(() => {
    if (!selectedLevel2.value) return [];
    const level2Item = level2Tags.value.find(
      item => item[props.selectedKey] === selectedLevel2.value
    );
    return level2Item?.children || [];
  });
  // 选择的路径
  const selectedPath = computed(() => {
    const path = [];
    if (selectedLevel1.value !== '') {
      const l1 = props.tagsData.find(
        item => item[props.selectedKey] === selectedLevel1.value
      );
      path.push(l1[props.selectedKey]);

      if (selectedLevel2.value && selectedLevel2.value !== '') {
        const l2 = level2Tags.value.find(
          item => item[props.selectedKey] === selectedLevel2.value
        );
        path.push(l2[props.selectedKey]);

        if (selectedLevel3.value && selectedLevel3.value !== '') {
          const l3 = level3Tags.value.find(
            item => item[props.selectedKey] === selectedLevel3.value
          );
          path.push(l3[props.selectedKey]);
        }
      }
    }
    return path;
  });

  watch(
    () => props.initialLevel,
    val => {
      selectedLevel1.value = val[0];
      selectedLevel2.value = val[1];
      selectedLevel3.value = val[2];
    }
  );

  // 选择处理方法
  const selectLevel1 = tag => {
    if (selectedLevel1.value == tag[props.selectedKey]) return;
    selectedLevel1.value = tag[props.selectedKey];
    selectedLevel2.value = '';
    selectedLevel3.value = '';
    emit('change', selectedPath.value);
  };

  const selectLevel2 = tag => {
    if (selectedLevel2.value == tag[props.selectedKey]) return;
    selectedLevel2.value = tag[props.selectedKey];
    selectedLevel3.value = '';
    emit('change', selectedPath.value);
  };

  const selectLevel3 = tag => {
    if (selectedLevel3.value == tag[props.selectedKey]) return;
    selectedLevel3.value = tag[props.selectedKey];
    emit('change', selectedPath.value);
  };
</script>

<style lang="scss" scoped>
  .tag-selector {
    > div + div {
      margin-top: 10px;
    }
    .tag-level1,
    .tag-level2,
    .tag-level3 {
      display: flex;
      gap: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
  }

  .el-tag {
    cursor: pointer;
  }

  .el-tag--info {
    color: #666;
    background-color: #fff;
    border-color: #fff;
    &:hover {
      background-color: #f4f4f4;
    }
  }
</style>
