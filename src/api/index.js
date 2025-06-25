import request from '@/utils/request'

// 登录（账号、手机号）
export const fatchLogin = (data) => {
  return request({
    url: '/api/login/username',
    method: "post",
    data,
  })
}

// 登出（账号、手机号）
export const fatchLogout = () => {
  return request({
    url: '/api/user/query/logout',
    method: "get",
  })
}

// 用户菜单权限树
export const getRoutes = () => {
  return request({
    url: '/api/user/query/permissons',
    method: "GET",
  })
}

// 获取视频点播文件上传的地址和凭证(签名)
export const getFileVodSign = (params) => {
  return request({
    url: '/api/file/manage/file/vodSign',
    method: 'GET',
    params
  })
}

// 查看文件预览
export const previewFile = (params) => {
  return request({
    url: '/api/file/query/file/preview',
    method: 'GET',
    params
  })
}

// 获取单个文件签名
export const getFileSign = (params) => {
  return request({
    url: '/api/file/manage/file/sign',
    method: 'GET',
    params
  })
}

// 保存签名文件
export const saveManageFile = (data) => {
  return request({
    url: '/api/file/manage/file/save',
    method: 'POST',
    data
  })
}