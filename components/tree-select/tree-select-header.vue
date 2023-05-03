<template>
  <view class="j-select-header_title">
    <scroll-view
      class="flex"
      scroll-x
      style="width: 100%; white-space: nowrap; display: flex"
      :scroll-left="scrollLeft"
    >
      <view v-for="(item, index) in data" :key="index" class="d-inline-block">
        <view class="flex">
          <view
            v-if="index == 0"
            :class="[
              index == data.length - 1 && !isre
                ? 'u-info-disabled'
                : 'u-primary',
            ]"
            @click="backTree(item, -1)"
          >
            全部
          </view>
          <view
            v-if="index == 0 && isre"
            :class="[
              'flex mx-1',
              index == data.length - 1 && isre
                ? 'u-info-disabled'
                : 'u-primary',
            ]"
            @click="backTree(item, -2)"
          >
            <view class="iconfont icon-youjiantou u-info-disabled" />
            <view class="u-info-disabled ml-1">搜索结果</view>
          </view>
        </view>
        <view
          v-if="index != 0"
          class="flex mx-1"
          @click="backTree(item, index)"
        >
          <view class="iconfont icon-youjiantou u-info-disabled" />
          <view
            :class="[
              index == data.length - 1 ? 'u-info-disabled' : 'u-primary',
              'ml-1',
            ]"
          >
            {{ item[props.label] }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
  export default {
    name: 'tree-select-header',
    props: {
      data: {
        type: Array,
        default: () => [],
      },
      scrollLeft: {
        type: Number,
        default: 999,
      },
      isre: {
        type: Boolean,
        default: false,
      },
      props: {
        type: Object,
        default: () => {
          return {
            label: 'name',
            children: 'children',
            multiple: false,
            checkStrictly: false, //不关联
          }
        },
      },
    },
    methods: {
      backTree(item, index) {
        this.$emit('back', item, index)
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import url('./icon.css');
  @import url('../../libs/css/free.css');
  
  .j-select-header {
    &_title {
      height: 90rpx;
      padding: 0 32rpx;
      line-height: 90rpx;
      font-size: 30rpx;
      background-color: #f5f5f5;
      color: #606064;
    }
  }
</style>
