<template>
  <div class="dashboard">
    <div class="update-time">更新时间: 2025-06-06 08:28:23</div>

    <el-row :gutter="15">
      <el-col :sm="24" :lg="12">
        <div class="section">
          <div class="section-header">
            <span>快捷方式</span>
          </div>
          <div class="section-body">
            <div class="shortcuts">
              <el-card shadow="hover" body-class="shortcuts-item">
                <el-icon :size="30"><Document /></el-icon>
                <div class="text">
                  内容管理<el-icon :size="12"><CaretRight /></el-icon>
                </div>
              </el-card>
              <el-card shadow="hover" body-class="shortcuts-item">
                <el-icon :size="30"><Document /></el-icon>
                <div class="text">
                  VR管理<el-icon :size="12"><CaretRight /></el-icon>
                </div>
              </el-card>
              <el-card shadow="hover" body-class="shortcuts-item">
                <el-icon :size="30"><Document /></el-icon>
                <div class="text">
                  课程管理<el-icon :size="12"><CaretRight /></el-icon>
                </div>
              </el-card>
              <el-card shadow="hover" body-class="shortcuts-item">
                <el-icon :size="30"><Plus /></el-icon>
              </el-card>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-header_left">
              <span>新增用户</span>
            </div>
            <el-button size="small" type="primary" link @click="goPage">
              设置权限
            </el-button>
          </div>
          <div class="section-body">
            <!-- <div class="list" v-show="userList.length > 0"> -->
            <div class="list">
              <div class="list-item" v-for="item in 10">
                <div class="list-item_left">
                  <el-avatar
                    :size="24"
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  />
                  <span class="name">物理</span>
                </div>
                <div class="list-item_right">
                  <span class="date">2025-06-03</span>
                  <span class="follow">关注</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span>文件下载量排行榜</span>
            <div class="section-header_right">
              <div class="tabs">
                <span
                  :class="{ active: downRanks == 'WEEK' }"
                  @click="switchDownRanks('WEEK')"
                >
                  周榜
                </span>
                <el-divider direction="vertical" />
                <span
                  :class="{ active: downRanks == 'MONTH' }"
                  @click="switchDownRanks('MONTH')"
                >
                  月榜
                </span>
                <el-divider direction="vertical" />
                <span
                  :class="{ active: downRanks == 'ALL' }"
                  @click="switchDownRanks('ALL')"
                >
                  总榜
                </span>
              </div>
              <el-select style="width: 100px" v-model="downRank">
                <el-option
                  v-for="item in downOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="section-body">
            <div class="list">
              <div class="list-item" v-for="item in 5">
                <span class="title">1553236069.thumbnail.png</span>
                <el-progress
                  style="width: 250px"
                  :percentage="50"
                  :stroke-width="4"
                  :format="percentage => percentage"
                />
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :sm="24" :lg="12">
        <div class="section">
          <div class="section-header">
            <span>最新数据</span>
            <el-button size="small" type="primary" link>更多数据</el-button>
          </div>
          <div class="section-body">
            <div class="data">
              <el-card shadow="hover" body-class="data-item">
                <el-statistic :value="totalUserCount" />
                <div class="text">总用户</div>
                <div class="circle-box" style="background-color: #2d8cf0">
                  <el-icon><UserFilled /></el-icon>
                </div>
              </el-card>
              <el-card shadow="hover" body-class="data-item">
                <el-statistic :value="countTodayVisit" />
                <div class="text">今日访问量</div>
                <div class="circle-box" style="background-color: #19be6b">
                  <el-icon><UserFilled /></el-icon>
                </div>
              </el-card>
              <el-card shadow="hover" body-class="data-item">
                <el-statistic :value="countTotalQuestion" />
                <div class="text">问题数量</div>
                <div class="circle-box" style="background-color: #ff9900">
                  <el-icon><UserFilled /></el-icon>
                </div>
              </el-card>
              <el-card shadow="hover" body-class="data-item">
                <el-statistic :value="countTotalArticle" />
                <div class="text">内容量</div>
                <div class="circle-box" style="background-color: #ed3f14">
                  <el-icon><UserFilled /></el-icon>
                </div>
              </el-card>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span>访问量统计</span>
            <el-select style="width: 100px" v-model="visitDateRange">
              <el-option
                v-for="item in visitDateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="section-body">
            <el-card shadow="hover">
              <ECharts :options="visitChartOptions" style="height: 260px" />
            </el-card>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span>访问量排行榜</span>
            <div class="section-header_right">
              <div class="tabs">
                <span
                  :class="{ active: visitRanksParams.timeType == 'WEEK' }"
                  @click="switchVisitRankings('WEEK')"
                >
                  周榜
                </span>
                <el-divider direction="vertical" />
                <span
                  :class="{ active: visitRanksParams.timeType == 'MONTH' }"
                  @click="switchVisitRankings('MONTH')"
                >
                  月榜
                </span>
                <el-divider direction="vertical" />
                <span
                  :class="{ active: visitRanksParams.timeType == 'ALL' }"
                  @click="switchVisitRankings('ALL')"
                >
                  总榜
                </span>
              </div>
              <el-select
                style="width: 100px"
                v-model="visitRanksParams.contentType"
                @change="switchVisitRankType"
              >
                <el-option
                  v-for="item in visitOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="section-body">
            <!-- <div class="list" v-show="visitRanksData.length > 0"> -->
            <div class="list">
              <div class="list-item" v-for="item in 5">
                <span class="title">请问，怎么购买你们的产品（零售的）</span>
                <span class="num">204</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import ECharts from '@/components/ECharts/index.vue';
  import { UserFilled } from '@element-plus/icons-vue';
  // import {
  //   queryLatestFollowPage,
  //   queryLatestData,
  //   queryAccessRanking5
  // } from '@/api/index';

  const router = useRouter();

  // 新增用户
  const userList = ref([]);

  const goPage = () => {
    router.push('/member/index');
  };
  // const fetchAddUsersData = async () => {
  //   const res = await queryLatestFollowPage();
  //   userList.value = res.records || [];
  // };

  // 文件下载量排行榜
  const downOptions = [
    { value: 5, label: '前5名' },
    { value: 10, label: '前10名' },
    { value: 20, label: '前20名' }
  ];
  const downRanks = ref('WEEK');
  const downRank = ref(5);

  const switchDownRanks = val => {
    downRanks.value = val;
  };

  // 最新数据
  const statsData = ref({
    totalUserCount: 1922,
    countTodayVisit: 120,
    countTotalQuestion: 54,
    countTotalArticle: 889
  });
  const totalUserCount = useTransition(() => +statsData.value.totalUserCount);
  const countTodayVisit = useTransition(() => +statsData.value.countTodayVisit);
  const countTotalQuestion = useTransition(
    () => +statsData.value.countTotalQuestion
  );
  const countTotalArticle = useTransition(
    () => +statsData.value.countTotalArticle
  );
  // const fetchStatsData = async () => {
  //   const res = await queryLatestData();
  //   Object.assign(statsData.value, res);
  // };

  // 访问量排行榜
  const visitOptions = [
    { value: 'QUESTIONANSWER', label: '微问答' },
    { value: 'ARTICLE', label: '微文章' },
    { value: 'LESSON', label: '微讲堂' }
  ];
  const visitRanksParams = reactive({
    contentType: 'QUESTIONANSWER',
    timeType: 'WEEK'
  });
  const visitRanksData = ref([]);

  const switchVisitRankings = val => {
    visitRanksParams.timeType = val;
    // fetchVisitRanksData();
  };
  const switchVisitRankType = val => {
    visitRanksParams.contentType = val;
    // fetchVisitRanksData();
  };
  // const fetchVisitRanksData = async () => {
  //   const res = await queryAccessRanking5(visitRanksParams);
  //   visitRanksData.value = res.records || [];
  // };

  // 访问量统计
  const visitDateOptions = [
    { value: 7, label: '近7天' },
    { value: 30, label: '近30天' },
    { value: 90, label: '近90天' }
  ];
  const visitDateRange = ref(7);
  const visitChartOptions = ref({});

  const fetchVisitStatsData = async () => {
    const data = {
      dates: [
        '2025-05-31',
        '2025-06-01',
        '2025-06-02',
        '2025-06-03',
        '2025-06-04',
        '2025-06-05',
        '2025-06-06'
      ],
      list: [1974, 1439, 1435, 4422, 4698, 5131, 3274]
    };
    updateVisitChartOptions(data);
  };
  const updateVisitChartOptions = data => {
    visitChartOptions.value = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '10%',
        left: '1%',
        right: '5%',
        bottom: '4%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.dates
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: 'line',
          data: data.list,
          smooth: true,
          itemStyle: {
            color: '#4080FF'
          },
          lineStyle: {
            color: '#4080FF'
          }
        }
      ]
    };
  };

  watch(
    () => visitDateRange.value,
    () => {
      fetchVisitStatsData();
    }
  );

  onMounted(() => {
    // fetchAddUsersData();
    // fetchStatsData();
    fetchVisitStatsData();
    // fetchVisitRanksData();
  });
</script>

<style lang="scss" scoped>
  .update-time {
    line-height: 48px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    color: gray;
    background-color: #fff;
    border: 1px solid #e4e7ed;
  }
  .section {
    &-header {
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      .section-header_left,
      .section-header_right {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .tabs > span {
        cursor: pointer;
        &.active {
          font-size: 14px;
          color: #000;
        }
      }
      .more {
        color: #80848f;
        &:hover,
        &:active {
          color: #2d8cf0;
        }
      }
    }
  }

  .shortcuts {
    display: flex;
    flex-wrap: wrap;
    margin: -5px;
    :deep(.el-card) {
      flex: 0 0 calc(25% - 10px);
      margin: 5px;
    }
    :deep(.shortcuts-item) {
      height: 120px;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 15px;
      cursor: pointer;
      .text {
        height: 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 5px;
        color: #80848f;
      }
    }
  }

  .list {
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #e4e7ed;
    &-item {
      height: 48px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      &:not(:last-child) {
        border-bottom: 1px solid #e9eaec;
      }
      .list-item_left {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .list-item_right {
        line-height: 48px;
        display: flex;
        gap: 5px;
      }
      .title {
        line-height: 48px;
        font-size: 14px;
      }
      .name {
        font-size: 14px;
      }
      .date {
        font-size: 12px;
        color: #989898;
      }
      .follow {
        font-size: 12px;
        color: #ccc;
      }
      .num {
        line-height: 48px;
        font-size: 14px;
        color: #80848f;
      }
    }
  }

  .data {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    :deep(.el-card) {
      flex: 0 0 calc(50% - 5px);
    }
    :deep(.data-item) {
      height: 150px;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      position: relative;
      .text {
        line-height: 20px;
        font-size: 12px;
        color: #80848f;
      }
      .circle-box {
        width: 30px;
        height: 30px;
        position: absolute;
        left: 15px;
        top: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        .el-icon {
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .el-statistic {
    --el-statistic-content-font-size: 42px;
    --el-statistic-content-color: #9499a8;
  }
</style>
