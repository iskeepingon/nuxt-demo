<template>
  <div class="page-index">
    <div class="nav-wrap">
      <div class="w1200 clearfix">
        <div class="nav-links">
          <!--<div class="nav-link clearfix">
            <div class="nav-left">频道：</div>
            <div class="nav-right">
              <a v-for="item in condition.channel" :key="item.key" href="javascript:void(0);"
                 :class="{ active: conditionParams.channel === item.key ? true : false }"
                 @click="setCondition('channel', item.key)"
              >{{ item.val }}</a>
            </div>
          </div>-->
          <div v-show="conditionParams.channel == '0'" class="nav-link clearfix">
            <div class="nav-left">
              作品分类：
            </div>
            <div class="nav-right">
              <a
                v-for="item in condition.category"
                :key="item.key"
                href="javascript:void(0);"
                :class="{ active: conditionParams.category === item.key ? true : false }"
                @click="setCondition('category', item.key)"
              >{{ item.val }}</a>
            </div>
          </div>
          <div v-show="conditionParams.channel == '1' || conditionParams.channel == '2'" class="nav-link clearfix">
            <div class="nav-left">
              作品分类：
            </div>
            <div class="nav-right">
              <a
                v-for="item in condition.category"
                v-show="item.parent==undefined || item.parent == conditionParams.channel"
                :key="item.key"
                href="javascript:void(0);"
                :class="{ active: conditionParams.category === item.key ? true : false }"
                @click="setCondition('category', item.key)"
              >{{ item.val }}</a>
            </div>
          </div>
          <div class="nav-link clearfix">
            <div class="nav-left">
              字数：
            </div>
            <div class="nav-right">
              <a
                v-for="item in condition.words_total"
                :key="item.key"
                href="javascript:void(0);"
                :class="{ active: conditionParams.words_total === item.key ? true : false }"
                @click="setCondition('words_total', item.key)"
              >{{ item.val }}</a>
            </div>
          </div>
          <div class="nav-link clearfix">
            <div class="nav-left">
              状态：
            </div>
            <div class="nav-right">
              <a
                v-for="item in condition.status"
                :key="item.key"
                href="javascript:void(0);"
                :class="{ active: conditionParams.status === item.key ? true : false }"
                @click="setCondition('status', item.key)"
              >{{ item.val }}</a>
            </div>
          </div>
          <div class="nav-link clearfix">
            <div class="nav-left">
              更新时间：
            </div>
            <div class="nav-right">
              <a
                v-for="item in condition.date"
                :key="item.key"
                href="javascript:void(0);"
                :class="{ active: conditionParams.date === item.key ? true : false }"
                @click="setCondition('date', item.key)"
              >{{ item.val }}</a>
            </div>
          </div>
        </div>
        <div class="nav-links-right">
          <iframe
            src="//www.2345.com/wmlvy/pc/pageu6505951.html"
            width="210"
            height="210"
            frameborder="0"
            scrolling="no"/>
        </div>
      </div>
    </div>
    <template v-if="listDataForView.length>0">
      <div class="condition">
        <div class="w1200 condition-link clearfix">
          <div class="condition-left">
            排序：
          </div>
          <div class="condition-right">
            <a
              v-for="item in condition.sortType"
              :key="item.key"
              href="javascript:void(0);"
              :class="{ active: conditionParams.sortType === item.key ? true : false }"
              @click="setCondition('sortType', item.key)"
            >{{ item.val }}</a>
          </div>
        </div>
      </div>
      <div class="book-list w1200 clearfix">
        <div v-for="(arr, index) in listDataForView" :key="'line' + index" class="book-item-wrap-3 clearfix">
          <div v-for="item in arr" :key="item.id" class="book-item-wrap">
            <div class="book-item">
              <router-link :to="{ path: 'book', query: {id: item.book_id} }" target="_blank" class="clearfix">
                <img v-lazy="item.cover" :title="item.name">
                <div class="book-info">
                  <h3>{{ item.name }}</h3>
                  <h4>
                    <span>{{ item.category }}·{{ item.tags }}</span><b/><span>{{
                      item.full_flag == 1 ? '连载中' : '完结'
                    }}</span><b/><span>{{ item.words_total | fontNumFormate }}万字</span>
                  </h4>
                  <p>{{ item.brief }}</p>
                  <div class="time">
                    <span>{{ item.author }}</span><span>{{ item.src_updated * 1000 | timeFormate }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="listDataForView.length==0&&isLoaded" class="book-list-no-data w1200">
      <div class="book-list-no-data-info">
        <i/><span>没有找到符合条件的书<br>请重新筛选试试哦</span>
      </div>
    </div>
    <div v-if="totalPage" class="page-wrap w1200">
      <!-- 分页 -->
      <Pager
        :total-page="totalPage"
        :current-page="conditionParams.page"
        :init-page="1"
        :show-jump="true"
        :show-prev="true"
        :show-next="true"
        @go-page="goPage"
      />
    </div>
  </div>
</template>

<script>

import { ApiNovelList } from '@/api/index/index.js'
// import Pager from '@/components/Page.vue'

export default {
  name: 'Index',
  components: {
    // Pager,
  },
  filters: {
    fontNumFormate (value) {
      return value ? (value / 10000).toFixed(2) : 0
    },
    timeFormate (value) {
      const valueTime = new Date(value)
      const gap = Date.now() - valueTime.getTime()
      if (gap < 24 * 60 * 60 * 1000) {
        const hour = Math.floor(gap / (60 * 60 * 1000))
        return (hour < 1 ? 1 : hour) + '小时前'
      } else if (gap >= 24 * 60 * 60 * 1000 && gap < 7 * 24 * 60 * 60 * 1000) {
        const day = Math.floor(gap / (24 * 60 * 60 * 1000))
        return day + '天前'
      } else if (gap >= 7 * 24 * 60 * 60 * 1000 && gap < 30 * 24 * 60 * 60 * 1000) {
        const week = Math.floor(gap / (7 * 24 * 60 * 60 * 1000))
        return week + '周前'
      }
      return valueTime.getFullYear() + '年' + (valueTime.getMonth() + 1) + '月' + valueTime.getDate() + '日'
    }
  },
  data () {
    return {
      conditionParams: {
        channel: '0',
        words_total: '0',
        status: '0',
        date: '0',
        category: '0',
        page: 1,
        sortType: '0'
      },
      condition: {
        channel: [
          {
            key: '0',
            val: '全部'
          },
          {
            key: '1',
            val: '男频'
          },
          {
            key: '2',
            val: '女频'
          }
        ],
        words_total: [
          {
            key: '0',
            val: '全部'
          },
          {
            key: '1',
            val: '30万字以下'
          },
          {
            key: '2',
            val: '30-50万'
          },
          {
            key: '3',
            val: '50-100万'
          },
          {
            key: '4',
            val: '100-200万'
          },
          {
            key: '5',
            val: '200万以上'
          }
        ],
        status: [
          {
            key: '0',
            val: '全部'
          },
          {
            key: '1',
            val: '连载中'
          },
          {
            key: '2',
            val: '完本'
          }
        ],
        date: [
          {
            key: '0',
            val: '全部'
          },
          {
            key: '1',
            val: '3日内'
          },
          {
            key: '2',
            val: '一周内'
          },
          {
            key: '3',
            val: '两周内'
          },
          {
            key: '4',
            val: '30日内'
          }
        ],
        category: [
          {
            key: '0',
            val: '全部'
          },
          {
            key: '1',
            val: '玄幻',
            parent: '1'
          },
          {
            key: '2',
            val: '军史',
            parent: '1'
          },
          {
            key: '3',
            val: '仙侠',
            parent: '1'
          },
          {
            key: '4',
            val: '悬疑',
            parent: '1'
          },
          {
            key: '5',
            val: '穿越',
            parent: '2'
          },
          {
            key: '6',
            val: '都市',
            parent: '1'
          },
          {
            key: '7',
            val: '游戏',
            parent: '1'
          },
          {
            key: '8',
            val: '幻想',
            parent: '2'
          },
          {
            key: '9',
            val: '科幻',
            parent: '1'
          },
          {
            key: '10',
            val: '现代言情',
            parent: '2'
          },
          {
            key: '11',
            val: '古代言情',
            parent: '2'
          },
          {
            key: '12',
            val: '纯爱',
            parent: '2'
          }
        ],
        sortType: [
          {
            key: '0',
            val: '更新时间'
          },
          {
            key: '1',
            val: '小编推荐'
          }
        ]
      },
      listData: [],
      totalPage: 0,
      isLoaded: false
    }
  },
  computed: {
    listDataForView () {
      const arr = []
      let tmp = []
      for (let i = 0; i < this.listData.length; i++) {
        tmp.push(this.listData[i])
        if (tmp.length === 3 || i === this.listData.length - 1) {
          arr.push(tmp)
          tmp = []
        }
      }
      return arr
    }
  },
  watch: {
    $route () {
      this.setParams()
      this.setTitle()
      this.getNovelList()
    }
  },
  mounted () {
    this.setParams()
    this.setTitle()
    this.getNovelList()
  },
  methods: {
    setParams () {
      const keys = Object.keys(this.$route.query)
      keys.forEach((key) => {
        const value = this.$route.query[key]
        this.setCondition(key, String(value))
      })
    },
    setTitle () {
      if (typeof this.$route.query.channel === 'undefined') {
        document.title = '2345小说-书库'
      } else if (this.$route.query.channel === 0) {
        document.title = '2345小说-书库'
      } else if (this.$route.query.channel === 1) {
        document.title = '2345小说-男频'
      } else if (this.$route.query.channel === 2) {
        document.title = '2345小说-女频'
      }
    },
    setCondition (key, value) {
      if (this.conditionParams[key] === value) {
        return
      }
      const tmp = JSON.parse(JSON.stringify(this.$route.query))
      const query = Object.assign({}, tmp, { [key]: value })
      this.$router.replace({
        path: '/',
        query
      })
      this.conditionParams.page = 1
      this.$set(this.conditionParams, key, value)
      if (key === 'channel') {
        this.conditionParams.category = '0'
      }
    },
    goPage (value) {
      if (value > 0 && value <= this.totalPage && value !== this.conditionParams.page) {
        this.conditionParams.page = value
        this.getNovelList()
      }
    },
    getNovelList () {
      const params = this.conditionParams
      this.isLoaded = false
      // debugger
      ApiNovelList(params).then((res) => {
        // debugger
        if (res.code === 200) {
          this.listData = res.data.list || []
          this.totalPage = res.data.totalPage
          this.isLoaded = true
        }
      }).catch((err) => {
        // console.log(err)
        // debugger
      })
    }
  }

}
</script>

<style lang="scss">
.w1200 {
  width: 1200px;
  margin: 0 auto;
  min-width: 1200px;
}

.page-index {
  .nav-wrap {
    background-color: #f8f8f8;

    .nav-links {
      padding: 20px 0;
      float: left;
      width: 948px;

      .nav-link {
        padding: 10px 0 0;

        .nav-left {
          width: 86px;
          text-align: right;
          float: left;
          height: 26px;
          line-height: 26px;
          color: #666666;
          font-size: 14px;
        }

        .nav-right {
          float: left;
          width: 862px;

          a {
            float: left;
            height: 26px;
            line-height: 26px;
            padding: 0 16px;
            font-size: 14px;
            color: #222222;
            margin-bottom: 10px;

            &.active {
              background: #0a85ff;
              background-image: linear-gradient(90deg,
                #4fa7ff 0%,
                #0a85ff 100%);
              border-radius: 4px;
              color: #fff;

              &:hover {
                color: #fff;
              }
            }

            &:hover {
              color: #0091ff;
            }
          }
        }

        .nav-right1 {
          float: left;

          a {
            float: left;
            display: block;
            width: 88px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 4px;
            border: solid 1px #e6e6e6;
            position: relative;
            z-index: 0;
            color: #666666;

            &:last-child {
              margin-left: -1px;
            }

            &.active {
              z-index: 1;
              border-color: rgba(48, 151, 253, 0.7);
              color: #0091ff;
            }
          }
        }
      }
    }

    .nav-links-right {
      width: 210px;
      height: 210px;
      float: right;
      margin-top: 7px;
    }
  }

  .condition {
    padding: 20px 0;

    .condition-link {
      .condition-left {
        float: left;
        height: 32px;
        line-height: 32px;
        color: #666666;
      }

      .condition-right {
        float: left;

        a {
          float: left;
          display: block;
          width: 88px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 4px 0 0 4px;
          border: solid 1px #e6e6e6;
          position: relative;
          z-index: 0;
          color: #666666;
          font-size: 14px;

          &:last-child {
            margin-left: -1px;
            border-radius: 0 4px 4px 0;
          }

          &.active {
            z-index: 1;
            border-color: rgba(48, 151, 253, 0.7);
            color: #0091ff;
          }

          &:hover {
            color: #0091ff;
          }
        }
      }
    }
  }

  .book-list {
    .book-item-wrap-3 {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      &:last-child {
        border-bottom: 0;
      }

      .book-item-wrap {
        width: 400px;
        float: left;
        padding: 16px 0 24px;

        .book-item {
          width: 374px;
          height: 154px;

          img {
            float: left;
            width: 116px;
            height: 154px;
            border-radius: 4px;
          }

          .book-info {
            float: left;
            width: 238px;
            margin-left: 20px;
            padding-right: 4px;
            box-sizing: border-box;

            h3 {
              height: 30px;
              line-height: 30px;
              font-size: 18px;
              color: #333333;
              font-weight: bold;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            h4 {
              height: 32px;
              line-height: 32px;
              font-size: 12px;
              color: #999999;

              b {
                margin: 11px 10px 0;
                width: 1px;
                height: 10px;
                display: inline-block;
                vertical-align: top;
                background: #d8d8d8;
              }
            }

            p {
              font-size: 14px;
              line-height: 19px;
              height: 38px;
              color: #666666;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              margin: 6px 0;
            }

            .time {
              padding-top: 22px;
              line-height: 16px;
              font-size: 12px;
              color: #999999;

              span {
                padding-right: 20px;
              }
            }
          }

          &:hover {
            background: #fafafa;

            .book-info {
              h3 {
                color: #0091ff;
              }
            }
          }
        }
      }
    }
  }

  .book-list-no-data {
    text-align: center;
    min-height: 400px;
    padding-top: 80px;

    .book-list-no-data-info {
      display: inline-block;
      position: relative;
      margin-left: 214px;
      width: 140px;
      height: 148px;
      font-size: 14px;
      line-height: 26px;
      color: #95b4d8;

      i {
        position: absolute;
        top: 0;
        left: -214px;
        width: 214px;
        height: 148px;
        //background: url(../../assets/images/library_pic.png);
      }

      span {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translate(0, -50%);
        text-align: left;
      }
    }
  }

  .page-wrap {
    margin-top: -14px;
    padding-bottom: 40px;
  }

  .recommend-list-header {
    height: 60px;
    font-weight: bold;
    font-size: 26px;
    line-height: 60px;
    color: #222222;
  }
}
</style>
