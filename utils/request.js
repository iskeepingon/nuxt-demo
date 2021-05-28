/**
 * ajax请求封装
 * 1、调用客户端的加解密方法
 * 2、统一处理请求头，将post转成form-urlencoded的形式
 * 3、ajax请求默认设置，如过期时间、跨域携带cookie
 * 4、统一处理响应信息
 */
// import Vue from 'vue'
import querystring from 'querystring' // 使用体积更小的querystring替代qs以进行表单提交
import axios from 'axios'

// import vueJsonp from 'vue-jsonp' // 引入jsonp方法

/**
 *  自定义配置新建一个 axios 实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  baseURL: '',
  // 将post转成form-urlencoded的形式, 否则post过去的数据会是json形式，php无法识别
  transformRequest: [
    (data) => {
      data = querystring.stringify(data)
      return data
    }
  ],
  timeout: 10000, // 请求超时时间
  responseType: 'text',
  withCredentials: true // 跨域携带cookie
})
service.defaults.retry = 1
service.defaults.retryDelay = 1000

// vue-jsonp的调用方式和axios一致
// 因为vue-json是一个vue插件，所以需要用hack的方式主动调用install方法进行安装
// 添加jsonp方法, 默认超时时间:10s
// vueJsonp.install(service, 10000)

/**
 * 对http请求拦截(不加密)
 */
service.interceptors.request.use((config) => {
  return config
}, (err) => {
  return Promise.reject(err)
})

/**
 * 对http请求返回值拦截进行解密
 */
service.interceptors.response.use(
  (rst) => {
    const data = rst
    if (data.status >= 500) {
      // window.vm.$OcToast('网络不给力，请检查网络设置')
      return Promise.reject(new Error('Network Error'))
    } else {
      return Promise.resolve(data.data)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
