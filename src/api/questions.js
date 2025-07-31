import request from '@/utils/request'

const Questions = {
  // 列表-分页条件查询
  queryPage(params) {
    return request({
      url: '/api/resource/query/wowquestion/queryPage',
      method: "GET",
      params,
    })
  },

  // 列表-根据id编辑公开状态
  editOpen(data) {
    return request({
      url: '/api/resource/manage/wowquestion/editOpen',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 列表-新增
  add(data) {
    return request({
      url: '/api/resource/manage/wowquestion/add',
      method: "POST",
      data
    })
  },

  // 列表-根据id删除
  deleteById(data) {
    return request({
      url: '/api/resource/manage/wowquestion/deleteById',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 问题-根据id查询详情
  queryQuestionById(params) {
    return request({
      url: '/api/resource/query/wowquestion/queryDetailById',
      method: "GET",
      params
    })
  },

  // 回答-根据问题id查询列表
  queryAnswerList(params) {
    return request({
      url: '/api/resource/query/wowquestionanswer/queryList',
      method: "GET",
      params
    })
  },

  // 回答-根据id查询详情
  queryAnswerById(params) {
    return request({
      url: '/api/resource/query/wowquestionanswer/queryDetailById',
      method: "GET",
      params
    })
  },

  // 回答-新增
  addAnswer(data) {
    return request({
      url: '/api/resource/manage/wowquestionanswer/add',
      method: "POST",
      data,
    })
  },

  // 回答-根据id更新
  updateAnswerById(data) {
    return request({
      url: '/api/resource/manage/wowquestionanswer/updateById',
      method: "POST",
      data,
    })
  },

  // 分类-根据id查询其子集树形结构
  queryTreeById(params) {
    return request({
      url: '/api/resource/query/wowquestionclassification/queryTreeById',
      method: "GET",
      params,
    })
  },

  // 分类-新增
  addTreeById(data) {
    return request({
      url: '/api/resource/manage/wowquestionclassification/add',
      method: "POST",
      data,
    })
  },

  // 分类-更新
  updateTreeById(data) {
    return request({
      url: '/api/resource/manage/wowquestionclassification/updateById',
      method: "POST",
      data,
    })
  },

  // 分类-删除
  deleteTreeById(data) {
    return request({
      url: '/api/resource/manage/wowquestionclassification/deleteById',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

}

export default Questions