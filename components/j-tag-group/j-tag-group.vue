<template>
  <view
    class="j-tree-select flex"
    :style="[$u.addStyle(customStyle)]"
    @tap.stop="onClick"
  >
    <view class="j-tree-select__tree-select flex-1">
      <view
        v-if="!innerValue || innerValue.length == 0"
        class="j-tree-select__tree-select--placeholder"
      >
        <text>{{ placeholder }}</text>
      </view>

      <view
        v-else
        class="j-tree-select__tree-select--item"
        :style="{ justifyContent: align }"
      >
        <view v-for="(item, index) in innerValue" :key="index" class="mr-1">
          <text v-if="isSingle">{{ item.label }}</text>
          <u-tag
            v-else
            :text="item.label"
            :type="type"
            :disabled="disabled"
            :size="size"
            :shape="shape"
            :bg-color="bgColor"
            :color="color"
            :border-color="borderColor"
            :close-color="closeColor"
            :closable="closable"
            :name="name"
            :plain-fill="plainFill"
            :plain="plain"
            :show="show"
            :icon="icon"
            @close="onClear(item, index)"
          />
        </view>
      </view>
    </view>
    <view class="j-tree-select__right-icon flex">
      <view v-if="isClearableIcon" @tap.stop="onClear()">
        <u-icon name="close-circle-fill" color="#c0c4cc" />
      </view>
      <u-icon name="arrow-right" />
    </view>
  </view>
</template>

<script>
  import props from './props'
  import { isEmpty } from '../../libs/utils/is'
  import tagProps from '@/uni_modules/uview-ui/components/u-tag/props'
  export default {
    name: 'j-tag-group',
    mixins: [uni.$u.mpMixin, uni.$u.mixin, tagProps, props],
    data() {
      return {
        innerValue: [], //格式 { label： 'xxx', value: 'xxx' }
        inputHeight: 70, // 高度
      }
    },
    computed: {
      isClearableIcon() {
		  if(this.disabled){
			  return !this.disabled
		  }else {
			  return this.clearable && !isEmpty(this.innerValue)
		  }
      },
      getStyle() {
        let style = {}
        // 如果没有自定义高度，就根据type为input还是textare来分配一个默认的高度
        style.minHeight = this.height
          ? this.height + 'rpx'
          : this.inputHeight + 'rpx'
        style = Object.assign(style, this.customStyle)
        return style
      },
      align() {
        if (this.inputAlign == 'right') {
          return 'flex-end'
        } else if (this.inputAlign == 'center') {
          return 'center'
        } else {
          return 'flex-start'
        }
      },
    },
    watch: {
      value: {
        handler: function (nVal) {
          this.innerValue = nVal
          this.emitEvent(nVal)
        },
        immediate: true,
		deep: true
      }
    },
    methods: {
      onClear(event) {
        if (event) {
          this.$emit('clear', event)
        } else {
          this.$emit('clear', [])
        }
      },
      onClick() {
        if (!this.disabled) {
          this.$emit('click', this.innerValue)
        }
      },
      // 内容发生变化，进行处理
      emitEvent(value) {
        this.innerValue = value
        this.$nextTick(() => {
          this.$emit('input', value)
          this.$emit('change', value)
          // 尝试调用u-form的验证方法
          uni.$u.formValidate(this, 'change')
        })
      },
    },
  }
</script>

<style scoped lang="scss">
   @import url('../../libs/css/free.css');
	
  .j-tree-select {
    position: relative;
    flex: 1;
    align-items: center;
    display: flex;
    flex-wrap: wrap;

    &--tag {
      margin-right: 10rpx;
    }

    &__tree-select {
      &--placeholder {
        font-size: 28rpx;
        color: #c0c4cc;
      }

      &--item {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-items: center;
      }
    }
  }
</style>
