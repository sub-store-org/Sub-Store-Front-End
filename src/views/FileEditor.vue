<template>
  <div class="page-wrapper">
    <!-- 基础表单 -->
    <div class="form-block-wrapper">
      <nut-form class="form" :model-value="form" ref="ruleForm">
        <!-- name -->
        <nut-form-item
          required
          :label="$t(`editorPage.subConfig.basic.name.label`)"
          prop="name"
          :rules="[
            {
              required: true,
              message: $t(`editorPage.subConfig.basic.name.isEmpty`),
            },
            {
              validator: nameValidator,
              message: $t(`editorPage.subConfig.basic.name.isInvalid`),
            },
          ]"
        >
          <input
            class="nut-input-text"
            @blur="customerBlurValidate('name')"
            v-model.trim="form.name"
            :placeholder="$t(`editorPage.subConfig.basic.name.placeholder`)"
            type="text"
          />
        </nut-form-item>
        <!-- displayName -->
        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.displayName.label`)"
          prop="displayName"
        >
          <input
            class="nut-input-text"
            v-model.trim="form.displayName"
            :placeholder="
              $t(`editorPage.subConfig.basic.displayName.placeholder`)
            "
            type="text"
          />
        </nut-form-item>
        <!-- icon -->
        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.icon.label`)"
          prop="icon"
        >
          <input
            class="nut-input-text"
            v-model.trim="form.icon"
            :placeholder="$t(`editorPage.subConfig.basic.icon.placeholder`)"
            type="text"
          />
        </nut-form-item>
          <nut-form-item
            :label="undefined"
            prop="content"
          >
            <nut-textarea
              class="textarea-wrapper"
              v-model="form.content"
              text-align="left"
              :autosize="{ maxHeight: 410, minHeight: 50 }"
              :placeholder="
                $t(`filePage.content.placeholder`)
              "
              type="text"
            />
          </nut-form-item>


    

      
      </nut-form>
    </div>

  </div>

  <div class="bottom-btn-wrapper">

    <nut-button
      @click="submit"
      class="submit-btn btn"
      type="primary"
      shape="square"
    >
      <font-awesome-icon icon="fa-solid fa-floppy-disk" />
      {{ $t('editorPage.subConfig.btn.save') }}
    </nut-button>
  </div>
</template>

<script lang="ts" setup>
  import { useSubsApi } from '@/api/subs';
  import { useFilesApi } from '@/api/files';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { useGlobalStore } from '@/store/global';
  import { useSubsStore } from '@/store/subs';

  import { initStores } from '@/utils/initApp';
  import { Dialog, Toast } from '@nutui/nutui';
  import { storeToRefs } from 'pinia';
  import {
    computed,
    provide,
    reactive,
    ref,
    shallowRef,
    toRaw,
    watchEffect,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const subsApi = useSubsApi();
  const filesApi = useFilesApi();
  const editType = route.params.editType as string;
  const configName = route.params.id as string;
  const subsStore = useSubsStore();
  const { showNotify } = useAppNotifyStore();

  const globalStore = useGlobalStore();
  const { bottomSafeArea } = storeToRefs(globalStore);
  const padding = bottomSafeArea.value + 'px';

  const file = computed(() => subsStore.getOneFile(configName));

  const isInit = ref(false);
  const ruleForm = ref<any>(null);
  const isget = ref(false);
  const form = reactive<any>({
    name: '',
    displayName: '',
    icon: '',
  });
  provide('form', form);


  watchEffect(() => {
    if (isInit.value) return;
    if (configName === 'UNTITLED') {
      // 标记 加载完成
      isInit.value = true;
      return;
    }

    const sourceData: any = toRaw(file.value);
    if (sourceData) {
      form.name = sourceData.name;
      form.displayName = sourceData.displayName || sourceData['display-name'];
      form.icon = sourceData.icon;

      form.content = sourceData.content;
      // 标记 加载完成
      isInit.value = true;
      return;
    }
  
  });


  const submit = () => {
    if (isget.value){
    showNotify({
        type: 'success',
        title: '请勿重复点击...',
      });
    return;
    }
    ruleForm.value.validate().then(async ({ valid, errors }: any) => {
      isget.value=true;
      // 如果验证失败
      if (!valid) {
        isget.value=false;
        Dialog({
          title: t(`editorPage.subConfig.pop.errorTitle`),
          content: errors[0].message,
          popClass: 'auto-dialog',
          noCancelBtn: true,
          okText: t(`editorPage.subConfig.pop.errorBtn`),
          // @ts-ignore
          closeOnClickOverlay: true,
        });
        return;
      }
      Toast.loading('...', { id: 'submits', cover: true, duration: 1500 });
      // 如果验证成功，开始保存/修改
      const data: any = JSON.parse(JSON.stringify(toRaw(form)));
      data['display-name'] = data.displayName;
      

      let res = null;

      if (configName === 'UNTITLED') {
        res = await filesApi.createFile(data);
        await subsStore.fetchSubsData();
        if (data.source === 'remote') await initStores(false, true, false);
      } else {
        res = await filesApi.editFile(configName, data);
    
        if (configName === data.name) {
          // @ts-ignore
          await subsStore.updateOneData(editType, configName);
        } else {
          await subsStore.fetchSubsData();
        }
      }

      if (res?.data?.status === 'success') {
        router.replace('/files').then(() => {
          if (res)
            showNotify({
              type: 'success',
              title: t(`editorPage.subConfig.pop.succeedMsg`),
            });

        });
  
      }
      isget.value=false;
      Toast.hide('submits');
    });
  };

  // 名称验证器
  const nameValidator = (val: string): Promise<boolean> => {
    return new Promise(resolve => {
      if (val === 'UNTITLED') resolve(false);
      if (/\//.test(val)) {
        resolve(false)
      }
      const nameList = subsStore.files.map(item => item.name);
      nameList.includes(val) && configName !== val
        ? resolve(false)
        : resolve(true);
    });
  };

  // 失去焦点触发验证
  const customerBlurValidate = (prop: string) => {
    ruleForm.value.validate(prop);
  };
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding: 0 var(--safe-area-side) calc(v-bind('padding') + 63px)
      var(--safe-area-side);

    :deep(.nut-cell-group__warp) {
      border-radius: var(--item-card-radios);
    }
  }

  .radio-wrapper {
    display: flex;
    justify-content: end;

    :deep(.nut-radio__button.false) {
      background: var(--divider-color);
      border-color: transparent;
      color: var(--second-text-color);
    }
  }

  .form-block-wrapper {
    position: relative;
  }

  .bottom-btn-wrapper {
    position: fixed;
    display: flex;
    justify-content: space-between;
    bottom: 0;
    width: 100%;
    padding: 8px var(--safe-area-side) calc(v-bind('padding') + 8px)
      var(--safe-area-side);
    z-index: 20;
    background: var(--background-color);
    border-top: 1px solid var(--divider-color);

    .btn {
      border-radius: 8px;
      padding: 4px 12px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        margin-right: 4px;
      }
    }

    // .compare-btn {
    //   background: transparent;
    //   width: 36%;
    // }

    .submit-btn {
      width: 100%;
    }
  }

  .ignore-failed-wrapper {
    flex-direction: row;
    justify-content: space-between;
    :deep(.nut-form-item__label) {
      width: auto;
    }
    .swtich-wrapper {
      display: flex;
      justify-content: end;
    }
  }

  .include-subs-wrapper {
    flex-direction: column;

    :deep(.nut-form-item__label) {
      width: 100%;
      margin-bottom: 12px;
    }

    .subs-checkbox-wrapper {
      flex-direction: row-reverse;

      .subs-checkbox {
        justify-content: space-between;
        margin-left: 16px;
        padding: 16px 0 0 0;

        &:not(:last-child) {
          padding: 16px 0 16px 0;
          border-bottom: 1px solid;
          border-color: var(--divider-color);
        }

        .sub-img-wrapper {
          max-width: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: var(--second-text-color);

          span {
            max-width: 56vw;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
          }

          .sub-item-customer-icon {
            margin-right: 12px;

            :deep(img) {
              object-fit: contain;

              &:not(.nut-icon__img) {
                filter: brightness(var(--img-brightness));
              }
            }
          }
        }
      }
    }
  }
</style>
