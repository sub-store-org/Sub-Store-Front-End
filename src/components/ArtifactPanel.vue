<template>
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
    lock-scroll
  >
    <nut-form :model-value="editPanelData" ref="ruleForm">
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
          readonly
          @click="sourceSelectorIsVisible = true"
          type="text"
        />
        <nut-cascader
          :title="$t('syncPage.selectSource.title')"
          v-model:visible="sourceSelectorIsVisible"
          v-model="sourceModel"
          @change="sourceChange"
          :options="sourceOptions"
        ></nut-cascader>
      </nut-form-item>
      <nut-form-item :label="$t(`syncPage.addArtForm.platform.label`)">
        <nut-radiogroup
          direction="horizontal"
          v-model="editPanelData.platform"
          class="artifact-radio-group"
        >
          <nut-radio label="Surge">Surge</nut-radio>
          <nut-radio label="QX">Quantumult X</nut-radio>
          <nut-radio label="Loon">Loon</nut-radio>
          <nut-radio label="Clash">Clash</nut-radio>
          <nut-radio label="Stash">Stash</nut-radio>
          <nut-radio label="ShadowRocket">ShadowRocket</nut-radio>
        </nut-radiogroup>
      </nut-form-item>
    </nut-form>
  </nut-dialog>
</template>

<script lang="ts" setup>
  import { useArtifactsStore } from '@/store/artifacts';
  import { useSubsStore } from '@/store/subs';
  import { Dialog, Toast } from '@nutui/nutui';
  import { computed, ref, toRaw, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';

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
    source: '',
    type: 'subscription',
    platform: 'Surge',
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
    return options;
  });

  const displayType = computed(() => {
    const typeValue = editPanelData.value.type;
    return sourceOptions.value.find(item => item.value === typeValue).text;
  });

  const displayName = computed(() => {
    const typeValue = editPanelData.value.type;
    const typeObj = sourceOptions.value.find(item => item.value === typeValue);
    return typeObj.children.find(
      item => item.value === editPanelData.value.source
    ).text;
  });

  const sourceChange = v1 => {
    editPanelData.value.type = v1[0];
    editPanelData.value.source = v1[1];
    sourceInput.value = displayType.value + ' - ' + displayName.value;
  };

  const onClickNameInput = () => {
    if (isEditMode.value) {
      Toast.warn('同步订阅配置的名称不支持修改', { duration: 1000 });
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
</script>

<style lang="scss">
  .artifact-panel {
    .nut-dialog {
      width: 80vw;

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
                padding: 12px 8px;
                border-color: var(--divider-color);
              }

              .artifact-radio-group {
                display: grid;
                grid-template-columns: 1fr 1fr;

                .nut-radio {
                  margin: 20px 0 0 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
