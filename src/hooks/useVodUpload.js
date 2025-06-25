import { getFileVodSign, saveManageFile } from '@/api/index';

const USERDATA = '{"Vod":{}}';
const REGION = 'cn-shanghai';
const USERID = '1303984639806000';
export function useVodUpload(option = {}) {
  const {
    accept = 'video/*',
    maxFileSize = 500,
    limit = 1,
    onSuccess: customSuccess,
    onError: customError
  } = option

  const uploader = ref(null);
  const percentage = ref(0);
  const statusText = ref('');

  function beforeUpload(file) {
    // 校验文件类型
    const acceptTypes = accept.split(',');
    const isValidType = acceptTypes.some(type => {
      const normalizedType = type.trim().toLowerCase();
      if (normalizedType === 'video/*') {
        return file.type.startsWith('video/');
      }
      if (normalizedType.startsWith('.')) {
        return file.name.toLowerCase().endsWith(normalizedType);
      }
      return file.type === normalizedType;
    });
    if (!isValidType) {
      ElMessage.warning(`仅支持上传 ${accept} 格式的文件`);
      return false;
    }
    // 校验文件大小
    if (file.size > maxFileSize * 1024 * 1024) {
      ElMessage.warning('上传文件大小不能超过' + maxFileSize + 'M');
      return false;
    }
    return true;
  }

  const onExceed = () => {
    ElMessage.warning('最多只能上传' + limit + '张图片');
  }

  const onSuccess = (res) => {
    customSuccess(res)
    // ElMessage.success('上传成功')
  }

  const onError = (err) => {
    customError(err)
    ElMessage.error('上传失败: ' + err.message)
  }

  const httpRequest = options => {
    const file = options.file;
    return new Promise(async (resolve, reject) => {
      if (uploader.value) {
        uploader.value.stopUpload();
        percentage.value = 0;
        statusText.value = '';
      }
      // 创建一个新的Promise用于等待上传完成
      let uploadResolve, uploadReject;
      const uploadPromise = new Promise((res, rej) => {
        uploadResolve = res;
        uploadReject = rej;
      });
      uploader.value = createUploader(uploadResolve, uploadReject);
      // 选择文件
      uploader.value.addFile(file, null, null, null, USERDATA);
      // 开始上传
      uploader.value.startUpload();

      try {
        // 等待上传完成
        const result = await uploadPromise;
        resolve(result);
      } catch (error) {
        reject(error);
      }
    })
  };

  const createUploader = (uploadResolve, uploadReject) => {
    let signData;
    return new AliyunUpload.Vod({
      timeout: 60000,
      partSize: Math.round(1048576),
      parallel: 5,
      retryCount: 3,
      retryDuration: 2,
      region: REGION,
      userId: USERID,
      localCheckpoint: true, //此参数是禁用服务端缓存，不影响断点续传

      // 添加文件成功
      addFileSuccess: (uploadInfo) => {
        statusText.value = '添加文件成功, 等待上传...';
      },

      // 开始上传
      onUploadstarted: async (uploadInfo) => {
        const { file } = uploadInfo;
        try {
          const data = await getFileVodSign({ fileName: file.name, transcoding: 'N' })
          const { uploadAuth, uploadAddress, videoId } = data
          signData = data;
          uploader.value.setUploadAuthAndAddress(
            uploadInfo,
            uploadAuth,
            uploadAddress,
            videoId
          );
          statusText.value = '文件开始上传...';
        } catch (error) {
          ElMessage.error('获取上传凭证失败')
          console.error('获取上传凭证失败:', error)
        }
      },

      // 文件上传成功
      onUploadSucceed: async (uploadInfo) => {
        const { file } = uploadInfo;
        try {
          // 记录文件信息到数据库
          const params = {
            id: signData.fileId,
            filePath: signData.fileUrl,
            newName: signData.newName,
            oldName: file.name,
            fileSize: file.size,
            format: '',
            isSaveThumbnail: 'Y'
          };
          await saveManageFile(params);
          // 调用resolve返回上传结果
          uploadResolve({ ...signData, fileName: file.name, fileSize: file.size });
          statusText.value = '文件上传成功!';
          ElMessage.success('文件上传成功!')
        } catch (error) {
          uploadReject(error);
          ElMessage.error('保存文件信息失败')
          console.error('保存文件信息失败:', error)
        }
      },

      // 文件上传失败
      onUploadFailed: (uploadInfo, code, message) => {
        statusText.value = '文件上传失败!';
        uploadReject(new Error(message));
      },

      // 取消文件上传
      onUploadCanceled: (uploadInfo, code, message) => {
        statusText.value = '文件已暂停上传';
      },

      // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
      onUploadProgress: (uploadInfo, totalSize, progress) => {
        percentage.value = Math.ceil(progress * 100);
        statusText.value = '文件上传中...';
      },

      onUploadTokenExpired: () => {
        statusText.value = '文件上传超时...';
      },

      // 全部文件上传结束
      onUploadEnd: () => {
        statusText.value = '文件上传完毕';
      }
    });
  };

  onUnmounted(() => {
    if (uploader.value) {
      uploader.value.stopUpload();
      percentage.value = 0;
      statusText.value = '';
    }
  });

  return {
    uploader,
    percentage,
    statusText,
    uploadProps: {
      ...option,
      beforeUpload,
      httpRequest,
      onExceed,
      onSuccess,
      onError
    },
  }
}