<template>
	<view class="j-select-content_container">
		<scroll-view
			scroll-y
			style="width: 100%; white-space: nowrap; min-height: 400px; height: 100px;"
			:scroll-left="scrollLeft"
		>
			<view
				v-for="(item, index) in data"
				:key="index"
				class="j-select-content_container_common"
				@click="handleClick(item, index)"
			>
				<label class="j-select-content_container_common_content">
					<view v-show="isCheck">
						<!-- 多选 -->
						<view
							v-if="props.multiple"
							class="j-select-content_checkbox"
							@click.stop="handleClick(item, -1)"
						>
							<span v-if="isSelect(item)">
								<i
									v-if="item.bx && newCheckList.length != 0"
									class="iconfont icon-checkbox-xuanzhongbufen u-primary"
								/>
								<i
									v-else
									class="iconfont icon-guifanduoxuanxuanzhong j-select-content_checkbox_txt u-primary"
								/>
							</span>
							<i
								v-else-if="item.qx"
								class="iconfont icon-guifanduoxuanxuanzhong j-select-content_checkbox_txt u-primary"
							/>
							<i
								v-else-if="item.bx"
								class="iconfont icon-checkbox-xuanzhongbufen j-select-content_checkbox_txt u-primary"
							/>
							<i
								v-else
								class="iconfont icon-guifanduoxuanweixuanzhong j-select-content_checkbox_txt u-info-disabled"
							/>
						</view>
						<!-- 单选 -->
						<view
							v-else-if="props.nodes ? (item.user ? true : false) : true"
							class="j-select-content_checkbox"
							@click.stop="handleClick(item, -1)"
						>
							<i
								v-if="radioSelect(item)"
								class="j-select-content_checkbox_txt iconfont icon-guifandanxuanxuanzhong u-primary"
							/>
							<i
								v-else
								class="j-select-content_checkbox_txt iconfont icon-guifandanxuanweixuanzhong u-info-disabled"
							/>
						</view>
					</view>
					<view class="j-select-content_container_common_content_lable-text">
						{{ item[props.label] }}
					</view>
					<view class="j-select-content_container_common_content_right">
						<i
							v-if="!item.user && item.children.length > 0"
							class="iconfont icon-youjiantou u-info-disabled"
						></i>
					</view>
				</label>
			</view>
		</scroll-view>
	</view>
</template>
<script>
export default {
	name: 'tree-select-content',
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		props: {
			type: Object,
			default: () => {
				return {
					label: 'name',
					children: 'children',
					multiple: false,
					checkStrictly: false, //不关联
				};
			},
		},
		isCheck: {
			type: Boolean,
			default: false,
		},
		newCheckList: {
			type: Array,
			default: () => [],
		},
		scrollLeft: {
			type: Number,
			default: 999,
		},
		keyCode: {
			type: String,
			default: 'value',
		},
	},
	computed: {
		isSelect() {
			return (item) => {
				const checkList = this.newCheckList;
				if (checkList.length == 0) {
					this.props.checkStrictly ? ((item.bx = 0), (item.qx = 0)) : '';
					return false;
				}
				const i =
					checkList.findIndex((e) => {
						return item[this.keyCode] == e[this.keyCode];
					}) > -1;
				return i && !item.qx;
			};
		},
		radioSelect() {
			const list = this.newCheckList;
			return (item) => {
				return list.length > 0 && item[this.keyCode] == list[0][this.keyCode];
			};
		},
	},
	methods: {
		handleClick(item, index) {
			this.$emit('click', item, index);
		},
	},
};
</script>
<style lang="scss" scoped>
@import url('./icon.css');
@import url('../../libs/css/free.css');

.j-select-content {
	&_container {
		overflow: hidden;
		height: 800rpx;

		&_common {
			background-color: #fff;
			border-bottom: 1rpx solid #f4f4f4;
			padding-left: 10rpx;
			&_content {
				display: flex;
				align-items: center;
				height: 60rpx;
				width: 100%;
				padding: 15rpx 0;
				position: relative;
				font-size: 32rpx;
				&_lable-text {
					margin-left: 16rpx;
					font-size: 30rpx;
					color: #5b5757;
					width: 500rpx;
					word-break: break-all;
				}
				&_right {
					position: absolute;
					right: 30rpx;
					color: #babdc3;
					font-size: 32rpx;
				}
			}
		}
	}

	&_checkbox {
		position: relative;
		margin-left: 10rpx;
		margin-right: 0px;
		display: flex;
		&_txt {
			font-size: 44rpx;
			width: 100%;
			height: 100%;
			display: flex;
		}
	}
}
</style>
