import request from '@/utils/request'

const Media = {
  // 列表-分页条件查询
  queryPage(params) {
    return request({
      url: '/api/resource/query/wowcourse/queryPage',
      method: "GET",
      params,
    })
  },

  // 列表-删除
  deleteById(data) {
    return request({
      url: '/api/resource/manage/wowcourse/deleteById',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 课程-根据id查询详情
  queryDetailById(params) {
    return request({
      url: '/api/resource/query/wowcourse/queryDetailById',
      method: "GET",
      params,
    })
  },

  // 课程-新增
  add(data) {
    return request({
      url: '/api/resource/manage/wowcourse/add',
      method: "POST",
      data,
    })
  },

  // 课程-根据id更新
  updateById(data) {
    return request({
      url: '/api/resource/manage/wowcourse/updateById',
      method: "POST",
      data,
    })
  },

  // 课程-修改状态
  editStatus(data) {
    return request({
      url: '/api/resource/manage/wowcourse/editStatus',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 章节-根据id查询其子集树形结构
  queryChapterTreeById(params) {
    return request({
      url: '/api/resource/query/wowcoursechapter/queryTreeById',
      method: "GET",
      params,
    })
  },

  // 章节-新增
  addChapterTreeById(data) {
    return request({
      url: '/api/resource/manage/wowcoursechapter/add',
      method: "POST",
      data,
    })
  },


  // 章节-删除
  deleteChapterTreeById(data) {
    return request({
      url: '/api/resource/manage/wowcoursechapter/deleteById',
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
      url: '/api/resource/query/wowcourseclassification/queryTreeById',
      method: "GET",
      params,
    })
  },

  // 分类-新增
  addTreeById(data) {
    return request({
      url: '/api/resource/manage/wowcourseclassification/add',
      method: "POST",
      data,
    })
  },

  // 分类-更新
  updateTreeById(data) {
    return request({
      url: '/api/resource/manage/wowcourseclassification/updateById',
      method: "POST",
      data,
    })
  },

  // 分类-删除
  deleteTreeById(data) {
    return request({
      url: '/api/resource/manage/wowcourseclassification/deleteById',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
}

export default Media