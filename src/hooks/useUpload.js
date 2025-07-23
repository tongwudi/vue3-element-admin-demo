import { getFileSign, saveManageFile } from '@/api/index';
import axios from 'axios';

const PATH = 'MediaLibrary/Image'
export function useUpload(option = {}) {
  const {
    accept = 'image/*',
    maxFileSize = 16,
    limit = 1,
    onSuccess: customSuccess,
    onRemove: customRemove
  } = option

  // 响应式数据
  const loading = ref(false)

  function beforeUpload(file) {
    // 校验文件类型
    const acceptTypes = accept.split(',');
    const isValidType = acceptTypes.some(type => {
      const normalizedType = type.trim().toLowerCase()
      if (normalizedType === 'image/*') {
        return file.type.startsWith('image/');
      }
      // 如果是扩展名 (.png, .jpg)，检查文件名是否以指定扩展名结尾
      if (normalizedType.startsWith('.')) {
        return file.name.toLowerCase().endsWith(normalizedType);
      }
      // 如果是具体的 MIME 类型 (image/png, image/jpeg)，检查是否完全匹配
      return file.type === normalizedType;
    });
    if (!isValidType) {
      ElMessage.warning(`仅支持上传 ${accept} 格式的文件`);
      return false;
    }
    // 校验文件大小
    if (file.size > maxFileSize * 1024 * 1024) {
      ElMessage.warning('上传图片大小不能超过' + maxFileSize + 'M');
      return false;
    }
    return true;
  }

  const onExceed = () => {
    ElMessage.warning('最多只能上传' + limit + '张图片');
  }

  const onError = (err) => {
    ElMessage.error('上传失败: ' + err.message)
  }

  const onSuccess = (res, uploadFile) => {
    const { uid, name, size } = uploadFile
    customSuccess({ ...res, uid, name, size })
    // ElMessage.success('上传成功')
  }

  const onRemove = () => {
    customRemove()
  }

  const httpRequest = options => {
    loading.value = true
    return new Promise(async (resolve, reject) => {
      const file = options.file;
      try {
        const signData = await uploadToOSS(PATH, file)
        resolve(signData)
      } catch (err) {
        reject(err)
      } finally {
        loading.value = false
      }
    })
  };

  return {
    loading,
    uploadProps: {
      ...option,
      beforeUpload,
      httpRequest,
      onExceed,
      onError,
      onSuccess,
      onRemove
    }
  }
}

export async function uploadToOSS(path, file) {
  // 1.获取OSS上传凭证
  const signData = await getFileSign({ path, fileName: file.name })
  // 2.上传文件到OSS
  const formData = new FormData()
  formData.append('name', signData.newName)
  formData.append('key', signData.dir + signData.newName)
  formData.append('policy', signData.policy)
  formData.append('OSSAccessKeyId', signData.accessid)
  formData.append('success_action_status', '200')
  formData.append('signature', signData.signature)
  formData.append('file', file)
  await axios.post(signData.host, formData)
  // 3.记录文件信息到数据库
  const params = {
    id: signData.fileId,
    filePath: signData.dir,
    newName: signData.newName,
    oldName: file.name,
    fileSize: file.size,
    format: '',
    isSaveThumbnail: 'Y'
  }
  await saveManageFile(params);
  // 返回数据
  return signData
}