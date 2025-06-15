// 接口

export function useUpload(option = {}) {
  const {
    accept = 'image/*',
    data = {},
    limit = 20,
    maxFileSize = 16,
    multiple = false,
    name = 'file',
    onSuccess = () => { },
    onError = () => { }
  } = option

  // 响应式数据
  const fileList = ref(multiple ? [] : '')
  const loading = ref(false)

  function beforeUpload(file) {
    // 校验文件类型：虽然 accept 属性限制了用户在文件选择器中可选的文件类型，但仍需在上传时再次校验文件实际类型，确保符合 accept 的规则
    const acceptTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptTypes.some(type => {
      // 如果是 image/*，检查 MIME 类型是否以 "image/" 开头
      if (type === 'image/*') {
        return file.type.startsWith('image/');
      }
      // 如果是扩展名 (.png, .jpg)，检查文件名是否以指定扩展名结尾
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      // 如果是具体的 MIME 类型 (image/png, image/jpeg)，检查是否完全匹配
      return file.type === type;
    });
    if (!isValidType) {
      ElMessage.warning(`上传文件的格式不正确，仅支持：${accept}`);
      return false;
    }
    // 限制文件大小
    if (file.size > maxFileSize * 1024 * 1024) {
      ElMessage.warning('上传图片不能大于' + maxFileSize + 'M');
      return false;
    }
    return true;
  }

  const httpRequest = options => {
    return new Promise((resolve, reject) => {
      const file = options.file;

      const formData = new FormData();
      formData.append(name, file);

      // 处理附加参数
      Object.keys(data).forEach(key => {
        formData.append(key, props.data[key]);
      });

      loading.value = true
      try {
        // const res = await upload(formData)
        fileList.value = multiple ? [...fileList.value, res.url] : response.url
        // onSuccess(res)
      } catch (error) {
        onError(error)
        ElMessage.error('上传失败: ' + error.message)
      } finally {
        loading.value = false
      }
    });
  };

  const onExceed = () => {
    ElMessage.warning('最多只能上传' + limit + '张图片');
  }

  return {
    fileList,
    loading,
    uploadProps: {
      ...option,
      beforeUpload,
      httpRequest,
      onExceed,

    }
  }
}