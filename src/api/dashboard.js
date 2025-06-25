import request from '@/utils/request'

const Dashboard = {
  // 管理后台汇总数据查询 - 新增用户分页查询
  queryLatestFollowPage(params) {
    return request({
      url: '/api/resource/query/wowwechatmanagesummary/queryLatestFollowPage',
      method: "GET",
      params
    })
  },


  // 管理后台汇总数据查询 - 最新数据查询
  queryLatestData() {
    return request({
      url: '/api/resource/query/wowwechatmanagesummary/queryLatestData',
      method: "GET"
    })
  },

  // 管理后台汇总数据查询 - 访问量top5
  queryAccessRanking5(params) {
    return request({
      url: '/api/resource/query/wowwechatmanagesummary/queryAccessRanking5',
      method: "GET",
      params
    })
  },

  // 文章 - 列表条件查询
  queryArticlesList(data) {
    return request({
      url: '/api/resource/query/wowarticle/queryList',
      method: "POST",
      data
    })
  },
}

export default Dashboard