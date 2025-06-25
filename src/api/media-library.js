import request from '@/utils/request'

const MediaLibrary = {
  // 列表-分页条件查询
  queryPage(params) {
    return request({
      url: '/api/resource/query/wow/resource/page',
      method: "GET",
      params,
    })
  },

  // 媒体资源-详情
  queryDetailById(params) {
    return request({
      url: '/api/resource/query/wow/resource/get',
      method: "get",
      params,
    })
  },

  // 媒体资源-新增
  addFile(data) {
    return request({
      url: '/api/resource/manage/wow/resource/add',
      method: "POST",
      data,
    })
  },

  // 媒体资源-更新
  updateFileById(data) {
    return request({
      url: '/api/resource/manage/wow/resource/update',
      method: "POST",
      data,
    })
  },

  // 媒体资源-删除
  deleteFile(data) {
    return request({
      url: '/api/resource/manage/wow/resource/delete',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },

  // 分类-根据id查询其子集树形结构
  getDirectoryTree(params) {
    return request({
      url: '/api/resource/query/wow/classification/getDirectoryTree',
      method: "GET",
      params,
    })
  },

  // 分类-新增
  addTreeById(data) {
    return request({
      url: '/api/resource/manage/wow/classification/add',
      method: "POST",
      data,
    })
  },

  // 分类-删除
  deleteTreeById(data) {
    return request({
      url: '/api/resource/manage/wow/classification/delete',
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
}

export default MediaLibrary