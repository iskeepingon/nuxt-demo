<template>
	<div v-if="totalPage > 0 && newCurrentPage" class="pager-wrapper">
		<div class="pager-pages">
			<a class="pager-pages-a-prev" v-show="newCurrentPage > 1 && showPrev" @click="go(newCurrentPage - 1)"></a>
			<a :class="{ active: newCurrentPage === 1 ? true : false }" @click="go(1)">1</a>
			<strong v-show="pages[0] > 2" class="pager-pages-a-strong"></strong>
			<a
				v-for="page in pages"
				:key="page"
				:class="{ active: newCurrentPage === page ? true : false }"
				@click="go(page)"
			>{{ page }}</a>
			<strong v-show="pages[pages.length - 1] < totalPage - 1" class="pager-pages-a-strong"></strong>
			<a
				v-if="totalPage > 1"
				:class="{ active: newCurrentPage === totalPage ? true : false }"
				@click="go(totalPage)"
			>{{ totalPage }}</a>
			<a class="pager-pages-a-next"
				v-show="newCurrentPage < totalPage && showNext"
				@click="go(newCurrentPage + 1)"
			></a>
		</div>
		<div v-if="showJump" v-show="totalPage > 1" class="pager-jump">
			<span>{{ textTotal }}<em class="jump-total">{{ totalPage }}</em>{{ textJump }}</span>
			<input
				v-model="jumpPage"
				type="number"
				min="1"
				:max="totalPage"
				class="jump-input"
        @keyup.enter="go(jumpPage)"
			>
			<span>{{ textPage }}</span>
			<a @click="go(jumpPage)">{{ textSet }}</a>
		</div>
	</div>
</template>
<script>
/*
 * component pager 翻页页码组件
 */
export default {
	props: {
		currentPage: {
			type: Number,
			default: 1,
		},
		totalPage: { // 总页数
			type: Number,
			default: 1,
			required: true,
		},
		showItems: { // 显示出来的页数，如: 1 ... 34[5]67 ... 10
			type: Number,
			default: 5,
		},
		showPrev: { // 是否显示“上一页”
			type: Boolean,
		},
		showNext: { // 是否显示“下一页”
			type: Boolean,
		},
		showJump: { // 是否显示“跳转”
			type: Boolean,
		},
		initPage: {
			type: Number,
			default: 1,
		},
		mode: {
			type: String,
			default: 'event', // 'event' | 'query' | 'params'
		},
		routeName: {
			type: String,
			default: () => {
				return ''
			},
		},
		textPrevious: {
			type: String,
			default: '上一页',
		},
		textNext: {
			type: String,
			default: '下一页',
		},
		textPage: {
			type: String,
			default: '页',
		},
		textTotal: {
			type: String,
			default: '共',
		},
		textSet: {
			type: String,
			default: 'GO',
		},
		textJump: {
			type: String,
			default: '页 ，跳至',
		},
	},
	data() {
		return {
			jumpPage: '',
			newCurrentPage: this.currentPage,
		}
	},
	computed: {
		pages() {
			let getPages = (start, end) => {
				if (start <= 1 || start > end || start >= this.totalPage) {
					start = 2
				}
				if (end >= this.totalPage || end < start || end <= 1) {
					end = this.totalPage - 1
				}
				let arr = []
				for (let i = start; i <= end; i++) {
					arr.push(i)
				}
				return arr
			}
			let counts = this.showItems
			if (this.totalPage < counts + 2) {
				return getPages(2, this.totalPage)
			} else if (this.newCurrentPage <= Math.ceil(counts / 2)) {
				return getPages(2, counts)
			} else if (this.newCurrentPage >= this.totalPage - Math.floor(counts / 2)) {
				return getPages(this.totalPage + 1 - counts, this.totalPage - 1)
			} else {
				let half = Math.ceil(counts / 2) - 1
				let end = this.newCurrentPage + half
				if (counts % 2 === 0) {
					end++
				}
				return getPages(this.newCurrentPage - half, end)
			}
		},
	},
	watch: {
		currentPage() {
			this.newCurrentPage = this.currentPage
		},
		newCurrentPage(newVal) {
			this.jumpPage = newVal
		},
		initPage(newVal) {
			if (this.newCurrentPage !== newVal) {
				this.newCurrentPage = newVal
				this.$emit('updateCurrentPage', newVal)
			}
		},
	},
	created() {
		// this.newCurrentPage = this.initPage
		if (this.mode === 'params' && !this.routeName) {
			// console.log('need a route name when choose params mode in pager component')
		}
	},
	methods: {
		go(page) {
			if (page < 1) {
				page = 1
			}
			if (page > this.totalPage) {
				page = this.totalPage
			}
			if (page === this.newCurrentPage) {
				return
			}
			this.newCurrentPage = parseInt(page, 10)
			this.$emit('updateCurrentPage', parseInt(page, 10))

			if (this.mode === 'query') {
				let query = this.$route.query
				query.page = this.newCurrentPage
				this.$router.go({ query: query })
			} else if (this.mode === 'params') {
				let params = this.$route.params
				params.page = this.newCurrentPage
				this.$router.go({ name: this.routeName, params: params })
			} else {
				this.$emit('go-page', this.newCurrentPage)
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.pager-wrapper {
  text-align: center;
  padding-top: 50px;
  padding-bottom: 20px;
}
.pager-pages {
  display: inline-block;
  vertical-align: top;
  height: 28px;
  font-size: 0;
  .pager-pages-a-prev {
    background: url('~@/assets/images/front_icon_normal.png') no-repeat center;
    &:hover {
      background: url('~@/assets/images/front_icon_hover.png') no-repeat center;
    }
  }
  .pager-pages-a-next {
    background: url('~@/assets/images/next_normal.png') no-repeat center;
    &:hover {
      background: url('~@/assets/images/next_icon_hover.png') no-repeat center;
    }
  }
	.pager-pages-a-strong {
		background: url('~@/assets/images/ellipsis_icon.png') no-repeat center;
	}
}
.pager-pages a:not(.active),
.pager-jump a {
  cursor: pointer;
}
.pager-wrapper a {
  display: inline-block;
  vertical-align: top;
  $h: 28;
  height: $h + px;
  min-width: $h + px;
  line-height: $h - 2 + px;
  padding: 0 10px;
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  margin: 0 5px;
  color: #666;
  font-size: 14px;
  box-sizing: border-box;
}
.pager-wrapper strong {
  display: inline-block;
  vertical-align: top;
  $h: 28;
  height: $h + px;
  line-height: $h + px;
  padding: 0 10px;
  margin: 0 5px;
  color: #666;
  font-size: 14px;
}
.pager-wrapper a {
  border: 1px solid #ddd;
  border-radius: 2px;
  background-color: #fff;
  transition: all 0.2s;
  box-sizing: border-box;
}
.pager-wrapper a:hover {
  color: rgb(33, 150, 243);
  border-color: rgb(33, 150, 243);
}
.pager-wrapper .active {
  background: #3097fd;
  border-color: #3097fd;
  color: #fff;
}
.pager-wrapper .active:hover {
  background: #fafafa;
  color: #666;
}
.pager-jump {
  display: inline-block;
  vertical-align: top;
  height: 28px;
  margin-left: 20px;
}
.pager-jump span {
  line-height: 28px;
  font-size: 14px;
  vertical-align: top;
}
.pager-jump em {
  margin: 0 5px;
  font-style: normal;
}
.pager-jump .jump-input {
  width: 60px;
  height: 28px;
  padding: 5px;
  outline: none;
  border: 1px solid #ddd;
  font-size: 14px;
  vertical-align: top;
  box-sizing: border-box;
  margin: 0 5px;
  text-align: center;
}
.pager-jump .jump-input:focus {
  border-color: rgb(33, 150, 243);
}

</style>
