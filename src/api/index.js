import request from '@/utils/request'

// 登录（账号、手机号）
export const fatchLogin = (data) => {
  return request({
    url: '/api/login/username',
    method: "POST",
    data: data,
  })
}
// 登出
export const fatchLogout = () => {
  return request({
    url: '/api/user/query/logout',
    method: "GET",
  })
}

// 用户菜单权限树
export const getRoutes = () => {
  return request({
    url: '/api/user/query/permissons',
    method: "GET",
  })
}

// // 管理后台汇总数据查询 - 新增用户分页查询
// export const queryLatestFollowPage = (params) => {
//   return request({
//     url: '/api/resource/query/wowwechatmanagesummary/queryLatestFollowPage',
//     method: "GET",
//     params
//   })
// }


// // 管理后台汇总数据查询 - 最新数据查询
// export const queryLatestData = () => {
//   return request({
//     url: '/api/resource/query/wowwechatmanagesummary/queryLatestData',
//     method: "GET"
//   })
// }

// // 管理后台汇总数据查询 - 访问量top5
// export const queryAccessRanking5 = (params) => {
//   return request({
//     url: '/api/resource/query/wowwechatmanagesummary/queryAccessRanking5',
//     method: "GET",
//     params
//   })
// }


// // 文章 - 列表条件查询
// export const queryArticlesList = (data) => {
//   return request({
//     url: '/api/resource/query/wowarticle/queryList',
//     method: "POST",
//     data
//   })
// }