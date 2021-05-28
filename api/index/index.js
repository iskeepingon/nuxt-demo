import request from '../../utils/request.js'

export function ApiNovelList (params) {
  return request({
    url: '/api/novel/index',
    method: 'post',
    data: params
  })
}

export function ApiNovelDetail (params) {
  return request({
    url: `/api/novel/detail/${params.id}`,
    method: 'get'
  })
}

/**
 * 文章目录
 * @param params
 * @returns {Promise}
 */
export function getNovelCatalog (bookId, params) {
  return request({
    url: `/api/novel/chapter/${bookId}`,
    method: 'get',
    params
  })
}

/**
 * 阅读页文章
 * @param params
 * @returns {Promise}
 */
export function getNovelContent (params) {
  return request({
    url: '/api/novel/content',
    method: 'post',
    data: params
  })
}

/**
 * 阅读量统计
 * @param params
 * @returns {Promise}
 */
export function sendReadRecord (params) {
  return request({
    url: '/api/novel/incr',
    method: 'post',
    data: params
  })
}
