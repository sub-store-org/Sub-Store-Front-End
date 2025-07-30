<template>
  <!-- lock-scroll  -->
  <nut-dialog
    teleport="#app"
    pop-class="artifact-panel auto-dialog"
    :title="editPanelTitle"
    :cancelText="$t('syncPage.addArtForm.cancel')"
    :okText="$t('syncPage.addArtForm.confirm')"
    @ok="submit"
    @cancel="closePanel"
    closeOnPopstate
    visible
  >
    <nut-form :model-value="editPanelData" ref="ruleForm">
      <nut-form-item
        :label="$t(`editorPage.subConfig.basic.icon.label`)"
        prop="icon"
      >
        <nut-input
          input-align="left"
          class="nut-input-text"
          :placeholder="$t(`editorPage.subConfig.basic.icon.placeholder`)"
          v-model.trim="editPanelData.icon"
          type="text"
          left-icon="shop"
          @click-left-icon="iconTips"
        />
      </nut-form-item>
      <nut-form-item
        :label="$t(`editorPage.subConfig.basic.isIconColor.label`)"
        prop="isIconColor"
        class="icon-color"
      >
        <div class="switch-wrapper">
          <nut-switch v-model="isIconColor" />
        </div>
      </nut-form-item>
      <nut-form-item
        :label="$t(`syncPage.addArtForm.name.label`)"
        prop="name"
        :required="!isEditMode"
        :rules="[
          {
            required: true,
            message: $t(`syncPage.addArtForm.name.isRequired`),
          },
          {
            validator: nameValidator,
            message: $t(`syncPage.addArtForm.name.isValid`),
          },
          {
            validator: duplicateNameValidator,
            message: $t(`syncPage.addArtForm.name.isExist`),
          },
        ]"
      >
        <nut-input
          @click="onClickNameInput"
          input-align="left"
          class="nut-input-text"
          :placeholder="$t(`syncPage.addArtForm.name.placeholder`)"
          :disabled="isEditMode"
          v-model="editPanelData.name"
          @blur="customerBlurValidate('name')"
          type="text"
        />
      </nut-form-item>

      <nut-form-item
        :label="$t(`syncPage.addArtForm.displayName.label`)"
        prop="displayName"
      >
        <nut-input
          input-align="left"
          class="nut-input-text"
          :placeholder="$t(`syncPage.addArtForm.displayName.label`)"
          v-model="editPanelData.displayName"
          type="text"
        />
      </nut-form-item>

      <nut-form-item
        :label="$t(`syncPage.addArtForm.source.label`)"
        required
        prop="source"
        :rules="[
          {
            required: true,
            message: $t(`syncPage.addArtForm.source.isRequired`),
          },
        ]"
      >
        <nut-input
          input-align="left"
          class="nut-input-text"
          :placeholder="$t(`syncPage.addArtForm.source.placeholder`)"
          v-model="sourceInput"
          readonly style="color: var(--primary-text-color);"
          @click="sourceSelectorIsVisible = true"
          type="text"
        />
        <!-- readonly 只读 -->

        <Teleport to="#ztop">
          <nut-cascader
            :title="$t('syncPage.selectSource.title')"
            v-model:visible="sourceSelectorIsVisible"
            v-model="sourceModel"
            @change="sourceChange"
            :options="sourceOptions"
          ></nut-cascader>
        </Teleport>
      </nut-form-item>
      <template v-if="sourceInput && ['subscription', 'collection'].includes(editPanelData.type)">
        <div class="include-unsupported-proxy-wrapper">
          <div class="label" @click="includeUnsupportedProxyTips">
            <p>{{ $t(`syncPage.addArtForm.includeUnsupportedProxy.label`) }}</p>
            <nut-icon name="tips"></nut-icon>
          </div>
          <nut-switch v-model="editPanelData.includeUnsupportedProxy"/>
        </div>

        <nut-form-item :label="$t(`syncPage.addArtForm.platform.label`)">
          <nut-radiogroup
            direction="horizontal"
            v-model="editPanelData.platform"
            class="artifact-radio-group"
          >
            <nut-radio label="Stash">Stash</nut-radio>
            <nut-radio label="Egern">Egern</nut-radio>
            <nut-radio label="ClashMeta">Mihomo</nut-radio>
            <nut-radio label="Surfboard">Surfboard</nut-radio>
            <nut-radio label="Surge">Surge</nut-radio>
            <nut-radio label="SurgeMac">Surge(macOS) <a href="https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E" target="_blank">ⓘ</a></nut-radio>
            <nut-radio label="Loon">Loon</nut-radio>
            <nut-radio label="ShadowRocket">Shadowrocket</nut-radio>
            <nut-radio label="QX">Quantumult X<span name="tips" @click="qxTips">&nbsp;ⓘ</span></nut-radio>
            <nut-radio label="sing-box">sing-box</nut-radio>
            <nut-radio label="V2Ray">V2Ray</nut-radio>
            <nut-radio label="URI">URI</nut-radio>
            <nut-radio label="JSON">JSON</nut-radio>
            <nut-radio label="Clash">Clash(Deprecated)</nut-radio>
          </nut-radiogroup>
        </nut-form-item>
      </template>
    </nut-form>
  </nut-dialog>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router";
  import { useArtifactsStore } from '@/store/artifacts';
  import { useSubsStore } from '@/store/subs';
  import { Dialog, Toast } from '@nutui/nutui';
  import { computed, ref, toRaw, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  const router = useRouter();
  const { t } = useI18n();
  const artifactsStore = useArtifactsStore();
  const isInit = ref(false);
  const isEditMode = ref(false);
  const ruleForm = ref();

  const emit = defineEmits(['close']);

  const { name } = defineProps<{
    name: string;
  }>();

  const closePanel = () => {
    emit('close');
  };

  const editPanelTitle = computed(() => {
    return isEditMode.value
      ? t('syncPage.editArtForm.title')
      : t('syncPage.addArtForm.title');
  });

  const sourceInput = ref('');
  const sourceModel = ref([]);
  const editPanelData = ref<Artifact>({
    name: '',
    displayName: '',
    icon: '',
    isIconColor: true,
    source: '',
    type: 'file',
    platform: 'Stash',
    includeUnsupportedProxy: false,
  });
  const isIconColor = computed({
    get: () => editPanelData.value.isIconColor !== false,
    set: (value) => {
      editPanelData.value.isIconColor = value;
    },
  });
  const sourceSelectorIsVisible = ref(false);
  const sourceOptions = computed(() => {
    const subsNameList = useSubsStore().subs.map(sub => {
      return {
        name: sub.name,
        displayName: sub.displayName || sub['display-name'] || sub.name,
      };
    });
    const collectionNameList = useSubsStore().collections.map(collection => {
      return {
        name: collection.name,
        displayName:
          collection.displayName ||
          collection['display-name'] ||
          collection.name,
      };
    });
    const filesNameList = useSubsStore().files.map(file => {
      return {
        name: file.name,
        displayName: file.displayName || file['display-name'] || file.name,
      };
    });

    const options = [];
    if (subsNameList.length > 0) {
      options.push({
        value: 'subscription',
        text: t('specificWord.singleSub'),
        children: subsNameList.map(item => ({
          value: item.name,
          text: item.displayName,
        })),
      });
    }

    if (collectionNameList.length > 0) {
      options.push({
        value: 'collection',
        text: t('specificWord.collectionSub'),
        children: collectionNameList.map(item => ({
          value: item.name,
          text: item.displayName,
        })),
      });
    }
    if (filesNameList.length > 0) {
      options.push({
        value: 'file',
        text: t('specificWord.file'),
        children: filesNameList.map(item => ({
          value: item.name,
          text: item.displayName,
        })),
      });
    }
    return options;
  });

  const displayType = computed(() => {
    const typeValue = editPanelData.value.type;
    return sourceOptions.value.find(item => item.value === typeValue)?.text ?? t(`specificWord.unknown`);
  });

  const displayName = computed(() => {
    const typeValue = editPanelData.value.type;
    const typeObj = sourceOptions.value.find(item => item.value === typeValue);
    return typeObj?.children?.find(
      item => item.value === editPanelData.value.source
    )?.text ?? t(`specificWord.unknown`);
  });

  const sourceChange = v1 => {
    editPanelData.value.type = v1[0];
    editPanelData.value.source = v1[1];
    sourceInput.value = displayType.value + ' - ' + displayName.value;
  };

  const onClickNameInput = () => {
    if (isEditMode.value) {
      Toast.warn('同步配置的名称不支持修改', { duration: 1000 });
    }
  };
  const submit = () => {
    ruleForm.value.validate().then(async ({ valid, errors }: any) => {
      // 如果验证失败
      if (!valid) {
        Dialog({
          title: t(`syncPage.addArtForm.pop.errorTitle`),
          content: errors[0].message,
          popClass: 'auto-dialog',
          noCancelBtn: true,
          okText: t(`syncPage.addArtForm.pop.errorBtn`),
          // @ts-ignore
          closeOnClickOverlay: true,
        });
        return;
      }

      const data = toRaw(editPanelData.value);
      Toast.loading(t('syncPage.addArtForm.submitLoading'), {
        cover: true,
        id: 'add-artifact-loading',
      });
      if (isEditMode.value) {
        await artifactsStore.editArtifact(name, data);
      } else {
        await artifactsStore.createArtifact(data);
      }
      closePanel();
      Toast.hide('add-artifact-loading');
    });
  };

  const nameValidator = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (isEditMode.value) resolve(true);
      const isValid = /^[a-zA-Z\d._-]*$/.test(editPanelData.value.name);
      isValid ? resolve(true) : resolve(false);
    });
  };

  const duplicateNameValidator = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (isEditMode.value) resolve(true);
      const duplicate = artifactsStore.artifacts.find(
        artifact => artifact.name === editPanelData.value.name
      );
      duplicate ? resolve(false) : resolve(true);
    });
  };

  // 失去焦点触发验证
  const customerBlurValidate = (prop: string) => {
    ruleForm.value.validate(prop);
  };

  const includeUnsupportedProxyTips = () => {
    window.open('https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E');
    // const includeUnsupportedProxyTipsTitle = t(`syncPage.addArtForm.includeUnsupportedProxy.tips.title`)
    // const includeUnsupportedProxyTipsContent = t(`syncPage.addArtForm.includeUnsupportedProxy.tips.content`)
    // Dialog({
    //   title: includeUnsupportedProxyTipsTitle,
    //   content: includeUnsupportedProxyTipsContent,
    //   popClass: 'auto-dialog',
    //   okText: 'OK',
    //   noCancelBtn: true,
    //   closeOnPopstate: true,
    //   lockScroll: false,
    // });
  };
  const iconTips = () => {
    router.push(`/icon/collection`);
  };
  watchEffect(() => {
    if (!isInit.value && name) {
      const artifact = artifactsStore.artifacts.find(art => art.name === name);
      editPanelData.value = JSON.parse(JSON.stringify(toRaw(artifact)));
      sourceModel.value.push(
        editPanelData.value.type,
        editPanelData.value.source
      );
      sourceInput.value = displayType.value + ' - ' + displayName.value;
      isEditMode.value = true;
      isInit.value = true;
    }
  });
  const qxTips = () => {
    Toast.warn('由于 QX 资源解析器对 QX 格式的输入支持不完善, 请勿对 Sub-Store 链接启用资源解析器. 如果一定要用资源解析器, 请手动选择 V2Ray 输出, 将形如 ?target=V2Ray 的链接填入 QX', {
      duration: 5000
    });
  }
</script>

<style lang="scss">
  .artifact-panel {
    min-width: 350px;
    .include-unsupported-proxy-wrapper {
      flex-direction: row;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      padding: 0 8px 0 8px;
      .label {
        color: var(--comment-text-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          text-align: left;
          padding-right: 20px;
        }
        .nut-icon {
          flex-shrink: 0;
          margin-right: 6px;
        }
      }
    }
    .nut-dialog {
      width: 100%;
      .nut-dialog__content {
        max-height: 72vh !important;

        .nut-form {
          .nut-cell-group__warp {
            background: transparent;
            .nut-cell::after {
              border-color: transparent;
            }

            .nut-form-item {
              padding-left: 8px;
              padding-right: 8px;
              background: inherit;
              flex-direction: column;

              .nut-input {
                padding: 8px 8px;
                border-color: var(--divider-color);
              }

              .artifact-radio-group {
                display: grid;
                grid-template-columns: 1fr 1fr;

                .nut-radio {
                  margin: 20px 0 0 0;
                }
              }
              &.icon-color {
                flex-direction: row;
                justify-content: space-between;
                .nut-form-item__label {
                  width: auto;
                  padding-right: 20px;
                }
                :deep(.nut-form-item__label) {
                  width: auto;
                }
                .switch-wrapper {
                  display: flex;
                  justify-content: flex-end
                }
              }
            }
          }
        }
      }
    }
  }
  .nut-input-text{
    color: var(--divider-color);
  }
  .readonly{
    border-color: var(--divider-color);
  }
</style>
