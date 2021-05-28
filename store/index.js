import { ApiNovelList, ApiNovelDetail, getNovelCatalog, getNovelContent, sendReadRecord } from '@/api/index/index'

export const state = () => ({
  masterUserInfo: null,
  userInfo: null,
  config: null
})

export const mutations = {
  SET_MASTER_USER_INFO: (state, obj) => {
    state.masterUserInfo = obj
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch, commit, state }, { req }) {
    if (req.headers.cookie !== undefined) {
      let arr = req.headers.cookie.split(';').filter(function (value, index, array) {
        return value.indexOf('hello-blog-token=') !== -1
      })
      if (arr.length !== 0) {
        // 获取token
        const tokenName = arr[0].split('=')[0].trim()
        const tokenValue = arr[0].split('=')[1].trim()
        if (tokenName === 'hello-blog-token' && tokenValue !== null && tokenValue !== undefined && tokenValue !== '') {
          commit('SET_TOKEN', tokenValue)
        } else {
          // 未登录状态
          return
        }

        try {
          await dispatch('getInfo', { Authorization: tokenValue })
        } catch (error) {
          console.log(error)
        }
      }

    } else {
      commit('SET_USER_INFO', null)
      commit('SET_TOKEN', null)
    }

    // await dispatch('getConfigList')
    // await dispatch('fetchMasterInfo')

  }
}
