<template>
  <div class="page-wrapper">
    <p class="More-title">
      {{ $t(`themeSettingPage.themeSettingTitle`) }}
    </p>

    <nut-cell-group>
      <nut-cell :title="$t(`moreSettingPage.simple`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="SimpleSwitch"
            size="mini"
            @change="setSimpleMode"
          />
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.isSimpleReicon`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awSimpleReicon"
            size="mini"
            @change="setSimpleReicon"
          />
        </template>
      </nut-cell>
      <nut-cell
        :title="$t(`moreSettingPage.isSimpleShowRemarks`)"
        class="cell-item"
      >
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awSimpleShowRemark"
            size="mini"
            @change="setSimpleShowRemark"
          />
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.islr`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="LeftRight"
            size="mini"
            @change="setLeftRight"
          />
        </template>
      </nut-cell>

      <nut-cell :title="$t(`moreSettingPage.isDefaultIcon`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awIsDefaultIcon"
            size="mini"
            @change="setIsDefaultIcon"
          />
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.isShowIcon`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awIsShowIcon"
            size="mini"
            @change="setIsShowIcon"
          />
        </template>
      </nut-cell>
      <nut-cell
        :title="$t(`moreSettingPage.isSubItemMenuFold`)"
        class="cell-item"
      >
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awIsSubItemMenuFold"
            size="mini"
            @change="setIsSubItemMenuFold"
          />
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.isEditorCommon`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awEditorCommon"
            size="mini"
            @change="setEditorCommon"
          />
        </template>
      </nut-cell>

      <nut-cell :title="$t(`moreSettingPage.showFloatingRefreshButton`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awShowFloatingRefreshButton"
            size="mini"
            @change="setShowFloatingRefreshButton"
          />
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.showFloatingAddButton`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awShowFloatingAddButton"
            size="mini"
            @change="setShowFloatingAddButton"
          />
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.displayPreviewInWebPage`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awDisplayPreviewInWebPage"
            size="mini"
            @change="setDisplayPreviewInWebPage"
          />
        </template>
      </nut-cell>

      <nut-cell :title="$t(`moreSettingPage.tabBar2`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awtabBar2"
            size="mini"
            @change="settabBar2"
          />
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.tabBar`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="awtabBar"
            size="mini"
            @change="settabBar"
          />
        </template>
      </nut-cell>
      <nut-cell
          class="cell-item"
          :title="$t(`moreSettingPage.subProgress.title`)"
          :desc="subProgressStyleName"
          @click="()=>{showSubProgressPicker=true}"
          is-link
        >
      </nut-cell>
      <nut-picker
        v-model="subProgressStyleValue"
        v-model:visible="showSubProgressPicker"
        :columns="[
        { text: $t(`moreSettingPage.subProgress.hidden`), value: 'hidden' },
        { text: $t(`moreSettingPage.subProgress.background`), value: 'background' }
      ]"
        :title="$t(`moreSettingPage.subProgress.title`)"
        @confirm="subProgressStyleConfirm"
      >
      </nut-picker>
    </nut-cell-group>

    <nut-cell-group>
      <nut-cell :title="$t(`themeSettingPage.auto`)" class="cell-item">
        <template v-slot:link>
          <nut-switch
            class="my-switch"
            v-model="autoSwitch"
            size="mini"
            @change="autoSwitchIsChange"
          />
        </template>
      </nut-cell>

      <template v-if="theme.auto">
        <nut-cell
          class="cell-item"
          :title="$t(`themeSettingPage.dark`)"
          :desc="themeDes.darkDes"
          @click="openPicker('dark')"
          is-link
        >
        </nut-cell>

        <nut-cell
          class="cell-item"
          :title="$t(`themeSettingPage.light`)"
          :desc="themeDes.lightDes"
          @click="openPicker('light')"
          is-link
        >
        </nut-cell>
      </template>

      <nut-cell
        v-else
        class="cell-item"
        :title="$t(`themeSettingPage.themeSettingTitle`)"
        :desc="themeDes.nameDes"
        @click="openPicker('name')"
        is-link
      />
    </nut-cell-group>
    <nut-picker
      v-model="selectedValue"
      v-model:visible="showThemePicker"
      :columns="pickerColumn"
      :title="$t(`themeSettingPage.themePicker.title`)"
      :cancel-text="$t(`themeSettingPage.themePicker.cancel`)"
      :ok-text="$t(`themeSettingPage.themePicker.confirm`)"
      @confirm="confirm"
    />
    <nut-cell-group>
      <nut-cell
          :title="$t(`moreSettingPage.clearFrontEndData.label`)"
          class="change-themes"
          @click.stop="clearFrontEndData"
          is-link
        ></nut-cell>
      <nut-cell
          :title="$t(`moreSettingPage.clearData.label`)"
          class="change-themes"
          @click.stop="clearData"
          is-link
        ></nut-cell>
    </nut-cell-group>
  
  </div>
</template>

<script lang="ts" setup>
  import { initStores } from "@/utils/initApp";
  import { Dialog, Toast } from '@nutui/nutui';
  import { useSettingsStore } from '@/store/settings';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/global';
  import { useMousePicker } from '@/hooks/useMousePicker';
  import { useThemes } from '@/hooks/useThemes';
  import { computed, ref, toRaw, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useAppNotifyStore } from "@/store/appNotify";
  import { useSettingsApi } from "@/api/settings";
  // import { Dialog } from '@nutui/nutui';

  const { t } = useI18n();
  const settingsStore = useSettingsStore();
  const globalStore = useGlobalStore();
  const {
    // env,
    // isSimpleMode,
    // isLeftRight,
    ishostApi,
    // isIconColor,
    // isDefaultIcon,
    // isEditorCommon,
    // isSimpleReicon,
    // showFloatingRefreshButton,
    // istabBar,
    // istabBar2,
    // subProgressStyle,
  } = storeToRefs(globalStore);
  // 外观设置
  const { changeAppearanceSetting } = settingsStore;
  const { appearanceSetting } = storeToRefs(settingsStore);
  const { showNotify } = useAppNotifyStore();

  const InputHostApi = ref('');
  const autoSwitchSync = ref(false);
  const SimpleSwitch = ref(false);
  const LeftRight = ref(false);
  const awIsDefaultIcon = ref(false);
  const awIsShowIcon = ref(true);
  const awIsSubItemMenuFold = ref(true);
  const awEditorCommon = ref(false);
  const awSimpleReicon = ref(true);
  const awSimpleShowRemark = ref(false);
  const awShowFloatingRefreshButton = ref(false);
  const awShowFloatingAddButton = ref(true);
  const awDisplayPreviewInWebPage = ref(true);
  const awtabBar = ref(true);
  const awtabBar2 = ref(true);
  // const isEditing = ref(false);
  const isInit = ref(false);
  const subProgressStyleValue = ref(['hidden']);

  const pickerType = ref('');
  const autoSwitch = ref(false);
  const showThemePicker = ref(false);
  // const isEditLoading = ref(false);
  const showSubProgressPicker = ref(false);

  const subProgressStyleName = computed(() => {
    return t(`moreSettingPage.subProgress.${subProgressStyleValue.value}`)
  })
  const subProgressStyleConfirm = ({ selectedValue }) => {
    // globalStore.setSubProgressStyle(selectedValue[0]);
    const data = {
      ...appearanceSetting.value,
      subProgressStyle: selectedValue[0]
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };
  const setSimpleMode = (isSimpleMode: boolean) => {
    // globalStore.setSimpleMode(isSimpleMode);
    const data = {
      ...appearanceSetting.value,
      isSimpleMode: isSimpleMode
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setLeftRight = (isLeftRight: boolean) => {
    // globalStore.setLeftRight(isLeftRight);
    const data = {
      ...appearanceSetting.value,
      isLeftRight: isLeftRight
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setIsDefaultIcon = (isDefaultIcon: boolean) => {
    // globalStore.setIsDefaultIcon(isDefaultIcon);
    const data = {
      ...appearanceSetting.value,
      isDefaultIcon: isDefaultIcon
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setIsShowIcon = (isShowIcon: boolean) => {
    // globalStore.setIsDefaultIcon(isDefaultIcon);
    const data = {
      ...appearanceSetting.value,
      isShowIcon: isShowIcon
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setIsSubItemMenuFold = (isSubItemMenuFold: boolean) => {
    // globalStore.setIsDefaultIcon(isDefaultIcon);
    const data = {
      ...appearanceSetting.value,
      isSubItemMenuFold: isSubItemMenuFold
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setEditorCommon = (isEditorCommon: boolean) => {
    // globalStore.setEditorCommon(isEditorCommon);
    const data = {
      ...appearanceSetting.value,
      isEditorCommon: isEditorCommon
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setSimpleReicon = (isSimpleReicon: boolean) => {
    // globalStore.setSimpleReicon(isSimpleReicon);
    const data = {
      ...appearanceSetting.value,
      isSimpleReicon: isSimpleReicon
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setSimpleShowRemark = (isSimpleShowRemark: boolean) => {
    // globalStore.setSimpleReicon(isSimpleReicon);
    const data = {
      ...appearanceSetting.value,
      isSimpleShowRemark: isSimpleShowRemark
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setShowFloatingRefreshButton = (showFloatingRefreshButton: boolean) => {
    // globalStore.setShowFloatingRefreshButton(showFloatingRefreshButton);
    const data = {
      ...appearanceSetting.value,
      showFloatingRefreshButton: showFloatingRefreshButton
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setShowFloatingAddButton = (showFloatingAddButton: boolean) => {
    const data = {
      ...appearanceSetting.value,
      showFloatingAddButton: showFloatingAddButton
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  const setDisplayPreviewInWebPage = (displayPreviewInWebPage: boolean) => {
    const data = {
      ...appearanceSetting.value,
      displayPreviewInWebPage: displayPreviewInWebPage
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };
  const settabBar = (istabBar: boolean) => {
    // globalStore.settabBar(istabBar);
    const data = {
      ...appearanceSetting.value,
      istabBar: istabBar
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };
  const settabBar2 = (istabBar2: boolean) => {
    // globalStore.settabBar2(istabBar2);
    const data = {
      ...appearanceSetting.value,
      istabBar2: istabBar2
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };

  
  
  // 主题设置 
  const { changeTheme } = settingsStore;
  const { theme } = storeToRefs(settingsStore);
  const { pickerList, pickerLightList, pickerDarkList, isAuto } = useThemes();
  useMousePicker();
  const selectedValue = ref(['dark']);

  const themeDes = computed(() => {
    const lightItem = pickerLightList.value.find(
      item => item.value === theme.value.light
    );
    const darkItem = pickerDarkList.value.find(
      item => item.value === theme.value.dark
    );
    const nameItem = pickerList.value.find(
      item => item.value === theme.value.name
    );

    return {
      lightDes: lightItem ? lightItem.text : '',
      darkDes: darkItem ? darkItem.text : '',
      nameDes: nameItem ? nameItem.text : '',
    };
  });
  const openPicker = (type: 'dark' | 'light' | 'name') => {
    showThemePicker.value = true;
    pickerType.value = type;
    selectedValue.value = [toRaw(theme.value[type])];
  };

  const pickerColumn = computed(() => {
    switch (pickerType.value) {
      case 'dark':
        return toRaw(pickerDarkList.value);
      case 'light':
        return toRaw(pickerLightList.value);
      case 'name':
        return toRaw(pickerList.value);
    }
  });

  const confirm = ({ selectedValue }) => {
    const data = { ...theme.value };
    data[pickerType.value] = selectedValue[0] ?? pickerColumn.value[0].value;
    changeTheme({ theme: data });
  };

  const autoSwitchIsChange = (val: boolean) => {
    const data = { ...theme.value };
    data.auto = val;
    changeTheme({ theme: data });
  };

  const setDisplayInfo = () => {
    InputHostApi.value = ishostApi.value
      ? ishostApi.value.slice(0, 9) + '************'
      : t(`moreSettingPage.yhostapi`);
  };
  const clearData = () => {
    Dialog({
      title: t('moreSettingPage.clearData.title'),
      content: t('moreSettingPage.clearData.content'),
      onCancel: () => {},
      onOk: async () => {
        try {
            const res = await useSettingsApi().restoreSettings({ content: JSON.stringify({
              settings: {
                istabBar2: false
              }
            }) });
            if (res?.data?.status === "success") {
              await initStores(false, true, true);
              showNotify({
                type: "success",
                title: t(`moreSettingPage.clearData.succeed`),
              });
            } else {
              throw new Error('clear data failed')
            }
        } catch (e) {
          showNotify({
            type: "danger",
            title: t(`moreSettingPage.clearData.failed`),
          });
          console.error(e);
        } 
      },
      popClass: 'auto-dialog',
      cancelText: t('moreSettingPage.clearData.cancel'),
      okText: t('moreSettingPage.clearData.conform'),
      closeOnPopstate: true,
      lockScroll: false,
    });
  };
  const clearFrontEndData = () => {
    Dialog({
      title: t('moreSettingPage.clearFrontEndData.title'),
      content: t('moreSettingPage.clearFrontEndData.content'),
      onCancel: () => {},
      onOk: async () => {
        try {
          localStorage.clear()
          window.location.reload()
        } catch (e) {
          showNotify({
            type: "danger",
            title: t(`moreSettingPage.clearFrontEndData.failed`),
          });
          console.error(e);
        } 
      },
      popClass: 'auto-dialog',
      cancelText: t('moreSettingPage.clearFrontEndData.cancel'),
      okText: t('moreSettingPage.clearFrontEndData.conform'),
      closeOnPopstate: true,
      lockScroll: false,
    });
  };

  // const exitEditMode = () => {
  //   setDisplayInfo();
  //   isEditing.value = false;
  //   isEditLoading.value = false;
  // };

  // const toggleEditMode = async () => {
  //   isEditLoading.value = true;
  //   console.log(`location.protocol`, location.protocol);
  //   console.log(`InputHostApi`, InputHostApi.value);
  //   if (
  //     location.protocol === 'https:' &&
  //     !/^(https):\/\/\S+$|^http:\/\/(localhost|127\.0\.0\.1)/.test(
  //       InputHostApi.value
  //     ) &&
  //     isEditing.value &&
  //     InputHostApi.value !== ''
  //   ) {
  //     console.log('InputHostApi失败');
  //     Dialog({
  //       title: t(`moreSettingPage.InputHostApi.title`),
  //       content: t(`moreSettingPage.InputHostApi.content`),
  //       popClass: 'auto-dialog',
  //       noCancelBtn: true,
  //       okText: t(`editorPage.subConfig.pop.errorBtn`),
  //       closeOnClickOverlay: true,
  //     });
  //     isEditing.value = false;
  //     isEditLoading.value = false;
  //     setDisplayInfo();
  //   } else {
  //     if (isEditing.value) {
  //       globalStore.sethostApi(InputHostApi.value);
  //       setDisplayInfo();
  //     } else {
  //       InputHostApi.value = ishostApi.value;
  //     }
  //     isEditLoading.value = false;
  //     isEditing.value = !isEditing.value;
  //   }
  // };

  // const clearEditor = () => {
  //   Dialog({
  //     title: t('editorPage.subConfig.pop.clearTitle'),
  //     content: t('editorPage.subConfig.pop.clearDes'),
  //     popClass: 'auto-dialog',
  //     okText: t(`editorPage.subConfig.pop.clearConfirm`),
  //     cancelText: t(`editorPage.subConfig.pop.clearCancel`),
  //     onOk: () => {
  //       InputHostApi.value = '';
  //     },
  //     closeOnClickOverlay: true,
  //   });
  // };

  watchEffect(() => {
    SimpleSwitch.value = appearanceSetting.value.isSimpleMode;
    LeftRight.value = appearanceSetting.value.isLeftRight;
    awIsDefaultIcon.value = appearanceSetting.value.isDefaultIcon;
    awIsShowIcon.value = appearanceSetting.value.isShowIcon;
    awIsSubItemMenuFold.value = appearanceSetting.value.isSubItemMenuFold;
    awEditorCommon.value = appearanceSetting.value.isEditorCommon;
    awSimpleReicon.value = appearanceSetting.value.isSimpleReicon;
    awSimpleShowRemark.value = appearanceSetting.value.isSimpleShowRemark;
    awShowFloatingRefreshButton.value = appearanceSetting.value.showFloatingRefreshButton;
    awShowFloatingAddButton.value = appearanceSetting.value.showFloatingAddButton;
    awDisplayPreviewInWebPage.value = appearanceSetting.value.displayPreviewInWebPage;
    awtabBar.value = appearanceSetting.value.istabBar;
    awtabBar2.value = appearanceSetting.value.istabBar2;
    subProgressStyleValue.value = [appearanceSetting.value.subProgressStyle];
    // SimpleSwitch.value = isSimpleMode.value;
    // LeftRight.value = isLeftRight.value;
    // awIconColor.value = isIconColor.value;
    // awIsDefaultIcon.value = isDefaultIcon.value;
    // awEditorCommon.value = isEditorCommon.value;
    // awEditorCommon.value = isEditorCommon.value;
    // awSimpleReicon.value = isSimpleReicon.value;
    // awShowFloatingRefreshButton.value = showFloatingRefreshButton.value;
    // awtabBar.value = istabBar.value;
    // awtabBar2.value = istabBar2.value;
    // subProgressStyleValue.value = [subProgressStyle.value];
    autoSwitch.value = isAuto();
    if (!isInit.value) {
      setDisplayInfo();
      isInit.value = true;
    }
  });
</script>

<style lang="scss" scoped>
  .page-wrapper {
    min-height: 100%;
    padding: 0 var(--safe-area-side);
    // padding: var(--safe-area-side);
    // display: flex;
    // min-width: 100%;
    flex-direction: column;
    align-items: center;
    //margin-bottom: 80px;

    .cell-item {
      box-shadow: none;
      background: var(--card-color);

      border-radius: var(--item-card-radios);
      font-weight: bold;
      display: flex;
      align-items: center;

      :deep(.nut-cell__value) {
        font-weight: normal;
        color: var(--lowest-text-color);
      }
    }

    .cell-group {
      width: 100%;

      :deep(.nut-cell-group__warp) {
        border-radius: var(--item-card-radios);
        overflow: hidden;
      }
    }
  }

  .desc-title {
    // display: block;
    padding: 0 10px;
    color: var(--comment-text-color);
    font-size: 12px;
    // line-height: 20px;
    margin-top: 8px;
    margin-bottom: 20px;
    text-align: left;
  }

  .desc-about {
    // width: 100%;
    // display: block;
    padding: 100px 5px 320px;
    color: var(--comment-text-color);
    font-size: 12px;
    // line-height: 20px;
    margin-top: 8px;
    margin-bottom: 20px;
    text-align: left;
  }

  .desc-about span {
    display: inline-block;
    padding: 6px 0 0 0;
  }

  .desc-title a,
  .desc-about a {
    color: var(--primary-color);
  }

  .env-block {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: var(--lowest-text-color);
    opacity: 0.3;
  }

  .More-title {
    border-radius: var(--item-card-radios);
    padding: 0 13px;
    color: var(--comment-text-color);
    font-size: 14px;
    line-height: 16px;
    margin-top: 16px;
    // margin-bottom: 30px;
    text-align: left;
    font-weight: bold;
  }

  .More-title:not(:first-child) {
    margin-top: 36px;
  }

  .profile-block {
    width: 100%;

    .config-card {
      margin-top: 10px;
      width: 100%;
      padding: 15px;
      border-radius: var(--item-card-radios);
      color: var(--second-text-color);
      background: var(--card-color);

      .title-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h1 {
        font-size: 14px;
        padding: 8px 0;
        margin-bottom: 8px;
      }

      .config-input-wrapper {
        // padding: 0 0px;

        .input.nut-input-disabled {
          :deep(input):disabled {
            -webkit-text-fill-color: var(--lowest-text-color);
          }
        }

        .input {
          background: transparent;
          padding: 5px;
          color: var(--second-text-color);

          :deep(img) {
            width: 16px;
            height: 16px;
            margin-right: 6px;
            opacity: 0.2;
            filter: brightness(var(--img-brightness));
          }

          &:not(:first-child) {
            margin-top: 8px;
          }
        }
      }

      .config-btn-wrapper {
        margin-top: -9px;
        display: flex;
        justify-content: flex-end;

        .cancel-btn {
          margin-left: 8px;
          background: transparent;
        }

        .save-btn {
          margin-left: 8px;
        }
      }
    }

    .info {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        max-width: 64%;

        .avatar-normal {
          :deep(img) {
            width: 72%;
          }
        }

        .name {
          margin-left: 12px;
          font-size: 18px;
          font-weight: bold;
          max-width: 64%;
          display: flex;
          flex-direction: column;

          p.title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--primary-text-color);
          }

          .des {
            margin-top: 6px;
            font-size: 12px;
            font-weight: normal;
            display: flex;
            flex-direction: column;
            color: var(--comment-text-color);
          }
        }
      }

      .actions {
        margin-left: 12px;
        display: flex;
        flex-direction: column;

        svg {
          margin-right: 4px;
        }

        .upload-btn,
        .download-btn {
          padding: 0 12px;
          width: 116px;
        }

        .upload-btn {
          background: transparent;
        }

        .download-btn {
          margin-top: 12px;
        }
      }
    }

    .change-themes {
      // color: var(--comment-text-color);
      box-shadow: none;
      font-weight: bold;
    }
  }

  .hostapi-comment {
    font-size: 12px;
    color: var(--comment-text-color);
    margin-top: 8px;
  }
</style>
