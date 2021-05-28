/**
 * 节流：n秒内只能执行一次
 * @param {*} fn 回调函数
 * @param {*} interval 单位是毫秒
 */
export function _usThrottle (fn, interval) {
  let last
  interval = interval || 400

  return function usThrottleResult (...args) {
    const th = this
    const now = +new Date()
    // 修改系统时间后，节流函数会把小于上次事件时间戳的事件过滤,故增加now - last > 0判断
    if (last && Math.abs(now - last) < interval) {
      // empty
    } else {
      last = now
      // fn(...args);
      fn.apply(th, args)
    }
  }
}

// 点击统计
// @param target 点击对象
// @param withCurrentPage 点击链接后附上当前页面链接
// @returns {boolean}
//
export const clickCount = function (target, name) {
  // 统计代码
  const code = name || 'ajax4' // 如 ajax56
  let tjURL = '//union2.50bang.org/web/' + code + '?uId2=SPTNPQRLSX' +
    '&r=' + encodeURIComponent(location.href) +
    '&fBL=' + screen.width + '*' + screen.height
  // 附加当前页面链接
  let lO = encodeURIComponent(target)
  // 使用别名
  const alias = target.alias || ''
  if (alias) {
    lO = encodeURIComponent(alias)
  }
  // 增加tj标记
  const tj = target.tj
  if (tj) {
    lO = encodeURIComponent(tj)
  }
  // 自定义链接名称
  tjURL += '&lO=' + lO
  const _dh = document.createElement('script')
  _dh.setAttribute('type', 'text/javascript')
  _dh.setAttribute('src', tjURL)
  document.getElementsByTagName('head')[0].appendChild(_dh)
  return true
}

// 动态引入js
export const createJs = function (src) {
  const ss = document.createElement('script')
  ss.type = 'text/javascript'
  ss.src = src
  document.body.appendChild(ss)
}

/**
 * 将数字转成中文
 * 例：1001 -> 一千零一
 */
const numChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const numUnit = ['', '十', '百', '千']
const numSection = ['', '万', '亿', '万亿', '亿亿']

function formatSection (num) {
  const arr = (num + '').split('').reverse()
  let str = ''
  for (let i = 0; i < arr.length; i++) { // 将0-9转化为零到九
    const char = arr[i] === 0 ? numChar[0] : (numChar[arr[i]] + numUnit[i]) // 当数字为0时不加权位，非零加权位
    str = char + str
  }
  const s = str.replace(/零+/g, '零').replace(/零+$/, '') // 将多个零合并为一个零，并剔除尾端的零
  return s
}

// 将字符串按个数拆分
function formatNumLen (num, str) {
  const len = Math.ceil(str.length / num)
  const arr = []
  for (let i = 0; i < len; i++) {
    const reverseStr = str.split('').reverse().join('')
    const s = reverseStr.slice(i * num, i * num + num).split('').reverse().join('')
    arr.unshift(s)
  }
  return arr
}

/**
 * 数字转换中文
 * @param {number} num 数字
 * @return {string}
 */
export function numberTranToCN (num) {
  const arr = formatNumLen(4, num + '') // 将数字每四个拆分一次
  const list = []
  for (let i = 0; i < arr.length; i++) {
    const str = formatSection(arr[i])
    list.push(str)
  }
  const reverseList = list.reverse()
  for (let j = 0; j < reverseList.length; j++) {
    reverseList[j] += numSection[j]
  }
  return reverseList.reverse().join('')
}

/**
 * 生成随记uuid
 * @returns {String}
 */
function createUUID () {
  const s = []
  const hexDigits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < 40; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 62), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  // s[8] = s[13] = s[18] = s[23] = "_";
  const uuid = s.join('')
  return uuid
}

/**
 * 获取uuid
 * @returns {String}
 */
export function getUUID () {
  let uuid = window.localStorage.getItem('uuid')
  if (!uuid) {
    uuid = createUUID()
    window.localStorage.setItem('uuid', uuid)
  }
  return uuid
}
