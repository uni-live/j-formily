<template>
  <view class="flex flex-1 justify-center align-center mx-3" style="flex: 1">
    <!-- 小程序不支持 `v-bind`很是尴尬 -->
    <u-button
      :custom-style="getComputedStyle"
      :disabled="getSubmitBtnOptions.disabled"
      :hairline="getSubmitBtnOptions.hairline"
      :loading="actionButtonLoading"
      :form-type="getSubmitBtnOptions.formType"
      :loading-mode="getSubmitBtnOptions.loadingMode"
      :loading-size="getSubmitBtnOptions.loadingSize"
      :loading-text="getSubmitBtnOptions.loadingText"
      :open-type="getSubmitBtnOptions.openType"
      :plain="getSubmitBtnOptions.plain"
      :shape="getSubmitBtnOptions.shape"
      :size="getSubmitBtnOptions.size"
      :app-parameter="getSubmitBtnOptions.appParameter"
      :type="getSubmitBtnOptions.type"
      :hover-stop-propagation="getSubmitBtnOptions.hoverStopPropagation"
      :lang="getSubmitBtnOptions.lang"
      :session-from="getSubmitBtnOptions.sessionFrom"
      :send-message-title="getSubmitBtnOptions.sendMessageTitle"
      :send-message-path="getSubmitBtnOptions.sendMessagePath"
      :send-message-img="getSubmitBtnOptions.sendMessageImg"
      :show-message-card="getSubmitBtnOptions.showMessageCard"
      :data-name="getSubmitBtnOptions.dataName"
      :throttle-time="getSubmitBtnOptions.throttleTime"
      :hover-start-time="getSubmitBtnOptions.hoverStartTime"
      :hover-stay-time="getSubmitBtnOptions.hoverStayTime"
      :text="getSubmitBtnOptions.text"
      :icon="getSubmitBtnOptions.icon"
      :icon-color="getSubmitBtnOptions.iconColor"
      :color="getSubmitBtnOptions.color"
      @tap="handleSubmit"
    >
      <text>{{ getSubmitBtnOptions.text }}</text>
    </u-button>
  </view>
</template>

<script>
  import { isEmpty } from '../../libs/utils/is'
  import { JFORMSUBMITBUTTON_KEY } from './const'
  export default {
    name: 'j-form-action',
    inject: {
      JFORMSUBMITBUTTON_KEY,
    },
    props: {
      actionButtonLoading: {
        type: Boolean,
        default: false,
      },
      submitButtonOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    computed: {
      getSubmitBtnOptions() {
        const pack = this.submitButtonOptions
        if (isEmpty(pack?.text)) {
          pack.text = '提交'
        }

        return pack
      },
      getComputedStyle() {
        if (isEmpty(this.getSubmitBtnOptions.customStyle)) {
          return 'display: flex'
        }
        return ''
      },
    },
    methods: {
      // 提交
      handleSubmit() {
        const button = this.JFORMSUBMITBUTTON_KEY()
        button.handleSubmit()
      },
    },
  }
</script>

<style lang="scss" scoped>
	@import url('../../libs/css/free.css');
</style>
