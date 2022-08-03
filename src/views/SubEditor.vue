<template>
  <div class="page-wrapper">
    <!-- 基础表单 -->
    <div class="form-block-wrapper">
      <div class="sticky-title-wrapper">
        <p>{{ $t(`editorPage.subConfig.basic.label`) }}</p>
      </div>
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
              message: $t(`editorPage.subConfig.basic.name.isExist`),
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

        <template v-if="editType === 'subs'">
          <!-- source -->
          <nut-form-item
            required
            :label="$t(`editorPage.subConfig.basic.source.label`)"
            prop="source"
          >
            <div class="radio-wrapper">
              <nut-radiogroup direction="horizontal" v-model="form.source">
                <nut-radio shape="button" label="remote"
                  >{{ $t(`editorPage.subConfig.basic.source.remote`) }}
                </nut-radio>
                <nut-radio shape="button" label="local"
                  >{{ $t(`editorPage.subConfig.basic.source.local`) }}
                </nut-radio>
              </nut-radiogroup>
            </div>
          </nut-form-item>
          <!-- url / content -->
          <nut-form-item
            required
            v-if="form.source === 'remote'"
            :label="$t(`editorPage.subConfig.basic.url.label`)"
            prop="url"
            :rules="[
              {
                required: true,
                message: $t(`editorPage.subConfig.basic.url.isEmpty`),
              },
              {
                validator: urlValidator,
                message: $t(`editorPage.subConfig.basic.url.isIllegal`),
              },
            ]"
          >
            <nut-textarea
              class="textarea-wrapper"
              @blur="customerBlurValidate('url')"
              v-model="form.url"
              :autosize="{ maxHeight: 110, minHeight: 50 }"
              :placeholder="$t(`editorPage.subConfig.basic.url.placeholder`)"
              type="text"
            />
          </nut-form-item>
          <nut-form-item
            v-else-if="form.source === 'local'"
            :label="$t(`editorPage.subConfig.basic.content.label`)"
            prop="content"
          >
            <nut-textarea
              class="textarea-wrapper"
              v-model="form.content"
              :autosize="{ maxHeight: 110, minHeight: 50 }"
              :placeholder="
                $t(`editorPage.subConfig.basic.content.placeholder`)
              "
              type="text"
            />
          </nut-form-item>
          <!-- ua -->
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.ua.label`)"
            prop="ua"
            v-if="form.source === 'remote'"
          >
            <input
              class="nut-input-text"
              v-model.trim="form.ua"
              :placeholder="$t(`editorPage.subConfig.basic.ua.placeholder`)"
              type="text"
            />
          </nut-form-item>
        </template>
        <template v-else-if="editType === 'collections'">
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.subscriptions.label`)"
            prop="subscriptions"
            class="include-subs-wrapper"
          >
            <nut-checkboxgroup
              v-model="form.subscriptions"
              class="subs-checkbox-wrapper"
            >
              <nut-checkbox
                v-for="item in subsSelectList"
                :key="item[0]"
                :label="item[0]"
                text-position="left"
                class="subs-checkbox"
              >
                <div class="sub-img-wrapper">
                  <nut-avatar
                    class="sub-item-customer-icon"
                    v-if="item[2]"
                    size="32"
                    :url="item[2]"
                    bg-color=""
                  ></nut-avatar>
                  <span>{{ item[1] }}</span>
                </div>
              </nut-checkbox>
            </nut-checkboxgroup>
          </nut-form-item>
        </template>
      </nut-form>
    </div>

    <!-- 常用配置 -->
    <CommonBlock />

    <!-- 节点操作 -->
    <ActionBlock
      :checked="actionsChecked"
      :list="actionsList"
      @addAction="addAction"
      @deleteAction="deleteAction"
    />
  </div>

  <div class="bottom-btn-wrapper">
    <nut-button @click="compare" class="compare-btn btn" plain shape="square">
      <font-awesome-icon icon="fa-solid fa-eye" />{{
        $t('editorPage.subConfig.btn.compare')
      }}
    </nut-button>
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

  <CompareTable
    v-if="compareTableIsVisible"
    :name="configName"
    :compareData="compareData"
    @closeCompare="closeCompare"
  />
</template>

<script lang="ts" setup>
  import { useSubsApi } from '@/api/subs';
  import icon from '@/assets/icons/logo.svg';
  import { usePopupRoute } from '@/hooks/usePopupRoute';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { useGlobalStore } from '@/store/global';
  import { useSubsStore } from '@/store/subs';
  import { addItem, deleteItem } from '@/utils/actionsOperate';
  import { actionsToProcess } from '@/utils/actionsToPorcess';
  import { initStores } from '@/utils/initApp';
  import CompareTable from '@/views/CompareTable.vue';
  import ActionBlock from '@/views/editor/ActionBlock.vue';
  import CommonBlock from '@/views/editor/CommonBlock.vue';
  import ActionRadio from '@/views/editor/components/ActionRadio.vue';
  import FilterSelect from '@/views/editor/components/FilterSelect.vue';
  import HandleDuplicate from '@/views/editor/components/HandleDuplicate.vue';
  import Regex from '@/views/editor/components/Regex.vue';
  import Script from '@/views/editor/components/Script.vue';
  import { Dialog, Toast } from '@nutui/nutui';
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
  const editType = route.params.editType as string;
  const configName = route.params.id as string;
  const subsStore = useSubsStore();
  const { showNotify } = useAppNotifyStore();

  const { bottomSafeArea } = useGlobalStore();
  const padding = bottomSafeArea + 'px';

  const sub = computed(() => subsStore.getOneSub(configName));
  const collection = computed(() => subsStore.getOneCollection(configName));

  const subsSelectList = computed(() => {
    return subsStore.subs.map(item => {
      return [
        item.name,
        item.displayName || item['display-name'] || item.name,
        item.icon || icon,
      ];
    });
  });

  const compareTableIsVisible = ref(false);
  usePopupRoute(compareTableIsVisible);
  const compareData = ref();

  const isInit = ref(false);
  const ruleForm = ref<any>(null);
  const actionsChecked = reactive([]);
  const actionsList = reactive([]);

  const form = reactive<any>({
    name: '',
    displayName: '',
    icon: '',
    process: [
      {
        type: 'Quick Setting Operator',
      },
    ],
  });
  provide('form', form);

  // 排除非动作卡片
  const ignoreList = ['Quick Setting Operator'];

  watchEffect(() => {
    if (isInit.value) return;
    if (configName === 'UNTITLED') {
      // 新建时，初始化表单
      switch (editType) {
        case 'collections':
          form.subscriptions = [];
          break;
        case 'subs':
          form.source = 'remote';
          form.url = '';
          form.content = '';
          form.ua = '';
          break;
      }
      // 标记 加载完成
      isInit.value = true;
      return;
    }

    const sourceData: any = toRaw(sub.value) || toRaw(collection.value);
    const newProcess = JSON.parse(JSON.stringify(sourceData.process));
    form.name = sourceData.name;
    form.displayName = sourceData.displayName || sourceData['display-name'];
    form.icon = sourceData.icon;
    form.process = newProcess;

    switch (editType) {
      case 'collections':
        form.subscriptions = [];
        form.subscriptions.push(...sourceData.subscriptions);
        break;
      case 'subs':
        form.source = sourceData.source;
        form.url = sourceData.url;
        form.content = sourceData.content;
        form.ua = sourceData.ua;
        break;
    }

    if (sourceData.process.length > 0) {
      form.process.forEach(item => {
        const { type, id } = item;

        if (!ignoreList.includes(type)) {
          actionsChecked.push([id, true]);
          const action = {
            type,
            id,
            tipsDes: t(`editorPage.subConfig.nodeActions['${type}'].tipsDes`),
            component: null,
          };
          switch (type) {
            case 'Flag Operator':
            case 'Sort Operator':
            case 'Resolve Domain Operator':
              action.component = shallowRef(ActionRadio);
              break;
            case 'Region Filter':
            case 'Type Filter':
              action.component = shallowRef(FilterSelect);
              break;
            case 'Regex Filter':
            case 'Regex Sort Operator':
            case 'Regex Delete Operator':
            case 'Regex Rename Operator':
              action.component = shallowRef(Regex);
              break;
            case 'Handle Duplicate Operator':
              action.component = shallowRef(HandleDuplicate);
              break;
            case 'Script Filter':
            case 'Script Operator':
              action.component = shallowRef(Script);
              break;
            default:
              break;
          }
          actionsList.push(action);
        }
      });
    }
    // 标记 加载完成
    isInit.value = true;
    return;
  });

  const addAction = val => {
    addItem(form, actionsList, actionsChecked, val, t);
  };

  const deleteAction = id => {
    deleteItem(form, actionsList, actionsChecked, id);
  };

  const closeCompare = () => {
    compareTableIsVisible.value = false;
    router.back();
  };

  const compare = () => {
    ruleForm.value.validate().then(async ({ valid, errors }: any) => {
      // 如果验证失败
      if (!valid) {
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

      Toast.loading('生成节点对比中...', { id: 'compare', cover: true });
      const data: any = JSON.parse(JSON.stringify(toRaw(form)));
      data.process = actionsToProcess(data.process, actionsList, ignoreList);

      // 过滤掉预览开关关闭的操作
      actionsChecked.forEach(item => {
        if (!item[1]) {
          const index = data.process.findIndex(i => i.id === item[0]);
          if (index > -1) {
            data.process.splice(index, 1);
          }
        }
      });

      const type = editType === 'collections' ? 'collection' : 'sub';
      const res = await subsApi.compareSub(type, data);
      if (res.data.status === 'success') {
        compareData.value = res.data.data;
        compareTableIsVisible.value = true;
        Toast.hide('compare');
      }
    });
  };

  const submit = () => {
    ruleForm.value.validate().then(async ({ valid, errors }: any) => {
      // 如果验证失败
      if (!valid) {
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

      // 如果验证成功，开始保存/修改
      const data: any = JSON.parse(JSON.stringify(toRaw(form)));
      data['display-name'] = data.displayName;
      data.process = actionsToProcess(data.process, actionsList, ignoreList);

      // console.log('submit.....\n', data);

      let res = null;

      if (configName === 'UNTITLED') {
        res = await subsApi.createSub(editType, data);
        await subsStore.fetchSubsData();
        if (data.source === 'remote') await initStores(false, true, false);
      } else {
        let apiType = '';
        if (editType === 'subs') {
          apiType = 'sub';
        } else if (editType === 'collections') {
          apiType = 'collection';
        }
        res = await subsApi.editSub(apiType, configName, data);

        if (configName === data.name) {
          // @ts-ignore
          await subsStore.updateOneData(editType, configName);
        } else {
          await subsStore.fetchSubsData();
        }
      }

      router.replace('/').then(() => {
        if (res)
          showNotify({
            type: 'success',
            title: t(`editorPage.subConfig.pop.succeedMsg`),
          });
      });
    });
  };

  // 唯一名称验证器
  const nameValidator = (val: string): Promise<boolean> => {
    return new Promise(resolve => {
      if (val === 'UNTITLED') resolve(false);
      const nameList = subsStore.subs.map(item => item.name);
      nameList.includes(val) && configName !== val
        ? resolve(false)
        : resolve(true);
    });
  };

  // url 格式验证器
  const urlValidator = (val: string): Promise<boolean> => {
    return new Promise(resolve => {
      resolve(/^(http|https):\/\/\S+$/.test(val));
    });
  };

  // 失去焦点触发验证
  const customerBlurValidate = (prop: string) => {
    ruleForm.value.validate(prop);
  };
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding: 0 var(--safe-area-side) calc(v-bind(padding) + 63px)
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
    padding: 12px var(--safe-area-side) v-bind(padding) var(--safe-area-side);
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

    .compare-btn {
      background: transparent;
      width: 36%;
    }

    .submit-btn {
      width: 62%;
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
