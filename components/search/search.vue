<template>
  <u-popup
    :show="show"
    :round="round"
    :close-on-click-overlay="closeOnClickOverlay"
    @close="onClose"
  >
    <u-toolbar
      v-if="showToolbar"
      :cancel-color="cancelColor"
      :confirm-color="confirmColor"
      :cancel-text="cancelText"
      :confirm-text="confirmText"
      :title="title"
      @cancel="onCancel"
      @confirm="onConfirm"
    />

    <view class="mx-1 my-2">
      <u-search
        v-model="keyword"
        :placeholder="placeholder"
        :shape="shape"
        :focus="focus"
        :show-action="false"
        @change="onChange"
      />
    </view>
    <view class="search position-relative">
      <view class="u-padding-10 u-bg-gray" style="height: 100%">
        <scroll-view :scroll-y="true" :lower-threshold="50" @scrolltolower="handleScrolltolower" style="height: 100%">
          <u-cell-group>
            <u-cell
              v-for="(item, index) in options"
              :key="index"
              :title-style="{ color: index === selectIndex ? '#3c9cff' : '' }"
              :title="item.label"
              :arrow="false"
              :index="index"
              @click="onClick(item, index)"
            />
          </u-cell-group>
		  <u-loadmore :status="status" />
        </scroll-view>
      </view>
      <view v-if="loading" class="search_loading">
        <u-loading-icon mode="circle" />
      </view>
    </view>
  </u-popup>
</template>

<script>
  import props from './props.js'

  export default {
    name: 'j-search',
    mixins: [uni.$u.mpMixin, uni.$u.mixin, props],
    data() {
      return {
        keyword: '',
        list: [],
        selectValue: null,
        selectIndex: null,
      }
    },
    methods: {
      onClick(item, index) {
        this.selectValue = item
        this.selectIndex = index
        this.$emit('click', item, index)
        this.$emit('input', item, index)
      },
      onClose() {
        this.$emit('close')
      },
      onChange(e) {
        this.$u.debounce(() => {
          this.$emit('searchChange', e)
        }, 300)
      },
      onConfirm() {
        this.$emit('confirm', this.selectValue)
      },
      onCancel() {
        this.$emit('cancel')
      },
	  handleScrolltolower() {
		  if(this.status === 'loadmore'){
			  this.$emit('scrolltolower', keyword)
		  }
	  }
    },
  }
</script>
<style lang="scss">
   @import url('../../libs/css/free.css');
	
  .search {
    overflow: hidden;
    width: 100%;
    height: 800rpx;

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
  }
</style>
