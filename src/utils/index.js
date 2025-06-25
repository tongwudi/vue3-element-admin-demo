/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export async function fetchTxtContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('网络响应不正常');
    return await response.text();
  } catch (error) {
    console.error('获取TXT内容失败:', error);
    return null;
  }
}