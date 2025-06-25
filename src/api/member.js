import request from '@/utils/request'

const Member = {
  // 用户-分页条件查询
  queryUserPage(params) {
    return request({
      url: '/api/resource/query/wowwechataccount/queryPage',
      method: "GET",
      params,
    })
  },

  // 用户-新增
  addUser(data) {
    return request({
      url: '/api/resource/manage/wowwechataccount/add',
      method: "POST",
      data,
    })
  },

  // 用户-条件查询
  queryUserList(params) {
    return request({
      url: '/api/resource/query/wowwechataccount/queryList',
      method: "GET",
      params,
    })
  },

  // 管理员-设置指定用户为技术支持管理员
  addUserToTchSupport(data) {
    return request({
      url: '/api/resource/manage/wowwechatsupport/addUserToTchSupport',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 管理员-分页条件查询
  querySupportPage(params) {
    return request({
      url: '/api/resource/query/wowwechatsupport/queryPage',
      method: "GET",
      params,
    })
  },

  // 管理员-根据id删除
  deleteSupport(data) {
    return request({
      url: '/api/resource/manage/wowwechatsupport/deleteById',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }
}

export default Member