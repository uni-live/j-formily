<template>
	<u-popup
		:show="show"
		:round="round"
		:close-on-click-overlay="closeOnClickOverlay"
		@close="closeHandler"
	>
		<u-toolbar
			v-if="showToolbar"
			:cancel-color="cancelColor"
			:confirm-color="confirmColor"
			:cancel-text="cancelText"
			:confirm-text="confirmText"
			:title="title"
			@cancel="cancel"
			@confirm="confirm"
		/>
		<view class="j-select position-relative">
			<view class="j-select_header">
				<view class="px-1">
					<view class="pb-3 py-2">
						<u-search
							v-if="isSearch"
							v-model="searchValue"
							:placeholder="placeholder"
							:shape="shape"
							:show-action="false"
							@change="onSearchChange"
						/>
					</view>

					<TreeSelectHeader
						:isre="isre"
						:data="tree_stack"
						:props="props"
						:scroll-left="scrollLeft"
						@back="backTree"
					/>
				</view>
			</view>
			<view class="j-select_content position-relative">
				<TreeSelectContent
					:data="tree"
					:props="props"
					:new-check-list="newCheckList"
					:scroll-left="scrollLeft"
					:key-code="keyCode"
					:is-check="isCheck"
					@click="handleClick"
				/>
				<view v-if="isLoading" class="j-select_loading">
					<u-loading-icon mode="circle" />
				</view>
			</view>
			<view v-if="loading" class="j-select_loading"> <u-loading-icon mode="circle" /> </view>
		</view>
	</u-popup>
</template>

<script>
import TreeSelectHeader from './tree-select-header.vue';
import TreeSelectContent from './tree-select-content.vue';
import props from './props';
import { cloneDeep } from 'lodash-es';
export default {
	name: 'tree-select',
	components: {
		TreeSelectHeader,
		TreeSelectContent,
	},
	mixins: [uni.$u.mpMixin, uni.$u.mixin, props],
	data() {
		return {
			searchValue: '',
			isLoading: false,
			isre: false,
			tree: [],
			newNum: 0,
			oldNum: 0,
			catchTreeNone: [],
			tree_stack: [1],
			searchResult: [],
			newCheckList: [],
			scrollLeft: 999,
			nodePathArray: [],
		};
	},
	computed: {
		keyCode() {
			return this.keyValue;
		},
	},
	watch: {
		treeNone: {
			handler: function(nVal) {
				this.tree = cloneDeep(nVal);
				this.catchTreeNone = cloneDeep(nVal);
			},
			immediate: true,
			deep: true,
		},
		checkList: {
			handler: function(nVal) {
				this.newCheckList = nVal;
			},
			immediate: true,
			deep: true,
		},
		show: {
			handler: function() {
				this.tree_stack = [1];
			},
			immediate: true,
		},
	},

	created() {
		this.Init();
	},
	methods: {
		// 初始化
		Init() {
			if (this.newCheckList.length !== 0) {
				let { tree_stack, props, catchTreeNone, newCheckList } = this;
				if (props.multiple) {
					if (props.checkStrictly) {
						this.checkAllChoose();
					}
				} else {
					this.getNodeRoute(catchTreeNone, newCheckList[0][this.keyCode]);
					let arr = this.nodePathArray.reverse();

					if (arr.length == 0) return;
					this.tree_stack = tree_stack.concat(arr);
					this.tree = this.tree_stack[this.tree_stack.length - 1].children;
				}
			}
		},
		// 点击项目处理
		handleClick(item, index) {
			let children = item[this.props.children];
			if (index > -1 && children && children.length > 0) {
				this.toChildren(item);
			} else if (this.props.multiple) {
				this.checkboxChange(item, index, item.bx, item.qx);
			} else {
				this.checkbox(item, index);
			}
		},
		// 获取路径
		getPath() {
			const { tree_stack, props } = this;
			const path = [...tree_stack].map((e) => {
				const item = Object.assign({}, e);
				delete item[props.children];
				return item;
			});
			return path.slice(1, path.length) || [];
		},
		//多选
		async checkboxChange(item, index, bx, qx) {
			let that = this;
			const { props } = that;
			if (!props.multiple) return;
			let findIdex = that.newCheckList.findIndex(
				(e) => item[this.keyCode] == e[this.keyCode]
			);

			const path = this.getPath();
			if (findIdex > -1) {
				//反选
				if (props.checkStrictly) {
					//关联子级
					if (item.user) {
						//用户
						that.newCheckList.splice(findIdex, 1);
					} else {
						//非用户，取消所有下一级
						that.getIdBydelete(item.children);
					}
				} else {
					that.newCheckList.splice(findIdex, 1);
				}
			} else {
				//选中
				if (!item.user && props.checkStrictly) {
					//选中下一级
					if (qx || bx) {
						//取消下级
						await that.getIdBydelete(item.children);
						item.qx = 0;
						item.bx = 0;
					} else {
						item.qx = 1;
						item.bx = 0;
						const { id, name, user } = item;
						const newObj = {
							id,
							name,
							user,
						};
						const pathList =
							this.tree_stack.length === 1 ? [newObj, ...path] : [...path, newObj];
						await that.chooseChild(item.children, pathList);
					}
					this.$forceUpdate();
					return;
				}
				that.newCheckList.push({ ...item, path });
			}
		},
		// 取消下一级的选中
		getIdBydelete(arr) {
			arr.forEach((e) => {
				if (e.user) {
					for (var i = 0; i < this.newCheckList.length; i++) {
						if (e[this.keyCode] == this.newCheckList[i][this.keyCode]) {
							this.newCheckList.splice(i, 1);
							break;
						}
					}
				} else {
					this.getIdBydelete(e.children);
				}
			});
		},

		// 关联下一级,选中
		chooseChild(arr, path) {
			let that = this;
			const oldPath = [...path];
			for (var i = 0, len = arr.length; i < len; i++) {
				let item = arr[i];
				let findIdex = that.newCheckList.findIndex(
					(e) => item[this.keyCode] == e[this.keyCode]
				);

				if (item.user) {
					if (findIdex == -1) {
						that.newCheckList.push({ ...item, path: oldPath });
					} else {
						that.newCheckList.splice(findIdex, 1, { ...item, path: oldPath });
					}
				} else {
					const newItem = { ...item };
					delete newItem[that.props.children];
					const newPath = [...oldPath, newItem];
					that.chooseChild(item.children, newPath);
				}
			}
		},

		// (tree为目标树，targetId为目标节点id)
		getNodeRoute(tree, targetId) {
			for (let index = 0; index < tree.length; index++) {
				if (tree[index].children) {
					let endRecursiveLoop = this.getNodeRoute(tree[index].children, targetId);
					if (endRecursiveLoop) {
						this.nodePathArray.push(tree[index]);
						return true;
					}
				}
				if (tree[index][this.keyCode] === targetId) {
					return true;
				}
			}
		},

		//单选
		checkbox(item) {
			const path = this.getPath();
			this.$set(this, 'newCheckList', [{ ...item, path }]);
		},
		//到下一级
		toChildren(item) {
			if (item.user) return;
			// var that = this
			this.isLoading = true;
			let children = this.props.children;

			if (
				!item.user &&
				item[children].length > 0 &&
				!(this.tree_stack[0][this.keyCode] == item[this.keyCode])
			) {
				this.tree = item[children];
				this.tree_stack.push(item);
			}
			this.$nextTick(() => {
				this.isLoading = false;
				this.scrollLeft += 200;
			});
			if (this.props.checkStrictly) this.checkAllChoose();
		},
		//搜索
		onSearchChange(val) {
			this.searchResult = [];
			this.search(this.catchTreeNone, val);
			this.isre = true;
			this.tree_stack.splice(1, 1000);
			this.isLoading = true;
			setTimeout(() => {
				this.tree = this.searchResult;
				this.isLoading = false;
			}, 300);
		},
		search(data, keyword) {
			let that = this;
			let { label, children } = that.props;
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i][label].indexOf(keyword) >= 0) {
					that.searchResult.push(data[i]);
				}
				if (!data[i].user && data[i][children].length > 0) {
					that.search(data[i][children], keyword);
				}
			}
		},

		checkAllChoose() {
			let o = false,
				t = true;
			this.tree.forEach((e, i) => {
				if (!e.user) {
					e.qx = o;
					e.bx = o;
					this.computAllNumber(e.children);
					if (this.newNum != 0 && this.oldNum != 0) {
						if (this.newNum == this.oldNum) {
							e.qx = t;
							e.bx = o;
						} else {
							e.qx = o;
							e.bx = t;
						}
					}
					if (this.newNum != 0 && this.oldNum == 0) {
						this.$set(this.tree[i], 'bx', o);
						this.$set(this.tree[i], 'qx', o);
					}
					this.$forceUpdate();
					this.newNum = 0;
					this.oldNum = 0;
				}
			});
		},

		computAllNumber(arr) {
			for (let j = 0; j < arr.length; j++) {
				var e = arr[j];
				this.checkSum(e[this.keyCode]);
				if (e.user) {
					this.newNum++;
				} else {
					this.computAllNumber(e.children);
				}
			}
		},

		checkSum(id) {
			for (let i = 0; i < this.newCheckList.length; i++) {
				if (id == this.newCheckList[i][this.keyCode]) {
					this.oldNum++;
					break;
				}
			}
		},

		//返回其它层
		backTree(item, index) {
			let that = this,
				tree_stack = that.tree_stack,
				max = 300;
			if (index === -1) {
				that.tree = that.catchTreeNone;
				that.tree_stack.splice(1, max);
				that.isre = false;
				this.searchValue = '';
			} else if (index === -2) {
				//搜索
				that.tree = that.searchResult;
				that.tree_stack.splice(1, max);
			} else {
				if (tree_stack.length - index > 2) {
					that.tree_stack.splice(index + 1, max);
				} else if (index !== tree_stack.length - 1) {
					that.tree_stack.splice(tree_stack.length - 1, 1);
				}
				that.tree = item[that.props.children];
			}
			if (this.props.checkStrictly) this.checkAllChoose();
			this.$forceUpdate();
		},

		// 关闭选择器
		closeHandler() {
			if (this.closeOnClickOverlay) {
				this.$emit('close');
			}
		},
		// 点击工具栏的取消按钮
		cancel() {
			this.$emit('cancel');
		},
		// 点击工具栏的确定按钮
		confirm() {
			this.$emit('confirm', this.newCheckList);
		},
	},
};
</script>
<style lang="scss" scoped>
@import url('./icon.css');
@import url('../../libs/css/free.css');

.j-select {
	overflow: hidden;
	&_header {
		width: 100%;
		background-color: #fff;
		overflow: hidden;
	}

	&_loading {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.87);
		z-index: 1000;
	}
	&_content {
		position: relative;
	}
}
</style>
<style lang="scss" scoped>
@import url('./icon.css');
</style>
