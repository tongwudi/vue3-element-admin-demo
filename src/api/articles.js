import request from '@/utils/request'

const Articles = {
  // 列表-分页条件查询
  queryPage(params) {
    return request({
      url: '/api/resource/query/wowarticle/queryPage',
      method: "GET",
      params,
    })
  },

  // 列表-删除
  deleteById(data) {
    return request({
      url: '/api/resource/manage/wowarticle/deleteById',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 文章-根据id查询详情
  queryDetailById(params) {
    return request({
      url: '/api/resource/query/wowarticle/queryDetailById',
      method: "GET",
      params,
    })
  },

  // 文章-新增
  add(data) {
    return request({
      url: '/api/resource/manage/wowarticle/add',
      method: "POST",
      data,
    })
  },

  // 文章-根据id更新
  updateById(data) {
    return request({
      url: '/api/resource/manage/wowarticle/updateById',
      method: "POST",
      data,
    })
  },

  // 文章-修改状态
  editStatus(data) {
    return request({
      url: '/api/resource/manage/wowarticle/editStatus',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 分类-根据id查询其子集树形结构
  queryTreeById(params) {
    return request({
      url: '/api/resource/query/articleclassification/queryTreeById',
      method: "GET",
      params,
    })
  },

  // 分类-新增
  addTreeById(data) {
    return request({
      url: '/api/resource/manage/articleclassification/add',
      method: "POST",
      data,
    })
  },

  // 分类-更新
  updateTreeById(data) {
    return request({
      url: '/api/resource/manage/articleclassification/updateById',
      method: "POST",
      data,
    })
  },

  // 分类-删除
  deleteTreeById(data) {
    return request({
      url: '/api/resource/manage/articleclassification/deleteById',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
}

export default Articles