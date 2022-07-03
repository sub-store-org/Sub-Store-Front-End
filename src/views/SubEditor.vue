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
                  <nut-avatar
                    class="sub-item-customer-icon"
                    size="32"
                    v-else
                    :icon="icon"
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
    :compareData="compareData"
    @closeCompare="closeCompare"
  />
</template>

<script lang="ts" setup>
  import icon from '@/assets/icons/logo.png'
  import { useRoute, useRouter } from 'vue-router'
  import { useSubsStore } from '@/store/subs'
  import {
    watchEffect,
    ref,
    toRaw,
    computed,
    provide,
    reactive,
    shallowRef,
  } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CommonBlock from '@/views/editor/CommonBlock.vue'
  import { useGlobalStore } from '@/store/global'
  import ActionBlock from '@/views/editor/ActionBlock.vue'
  import ActionRadio from '@/views/editor/components/ActionRadio.vue'
  import { actionsToProcess } from '@/utils/actionsToPorcess'
  import { deleteItem, addItem } from '@/utils/actionsOperate'
  import { Dialog, Notify, Toast } from '@nutui/nutui'
  import { useSubsApi } from '@/api/subs'
  import CompareTable from '@/views/CompareTable.vue'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const subsApi = useSubsApi()
  const { editType, id: configName } = route.params
  const subsStore = useSubsStore()

  const { bottomSafeArea } = useGlobalStore()
  const padding = bottomSafeArea + 'px'

  const sub = computed(() => subsStore.getOneSub(configName as string))
  const collection = computed(() =>
    subsStore.getOneCollection(configName as string)
  )

  const subsSelectList = computed(() => {
    const result = []
    for (const key in subsStore.subs) {
      const item = subsStore.subs[key]
      const display = item.displayName || item['display-name'] || key
      result.push([key, display, item.icon || null])
    }
    return result
  })

  const compareTableIsVisible = ref(false)
  const compareData = ref()

  const isInit = ref(false)
  const ruleForm = ref<any>(null)
  const actionsChecked = reactive([])
  const actionsList = reactive([])

  const form = reactive({ process: [] })
  provide('form', form)

  // 排除非动作卡片
  const ignoreList = ['Useless Filter', 'Set Property Operator']

  watchEffect(() => {
    // 新建时，初始化表单
    if (configName === 'UNTITLED') {
      if (editType === 'collections') {
        Object.assign(form, {
          name: '',
          displayName: '',
          icon: '',
          subscriptions: [],
        })
      } else if (editType === 'subs') {
        Object.assign(form, {
          name: '',
          displayName: '',
          source: 'remote',
          url: '',
          content: '',
          ua: '',
          icon: '',
        })
      }
    } else {
      // 如果没有初始化过数据，则初始化数据
      if (!isInit.value) {
        Object.assign(form, sub.value, collection.value)

        // 兼容旧版本的数据格式
        //@ts-ignore
        form.displayName = !form.displayName
          ? form['display-name']
          : //@ts-ignore
            form.displayName
      }
    }

    // 将后端数据格式转为前端数据格式
    if (!isInit.value && form.process) {
      form.process.forEach(item => {
        const { type, id } = item

        if (!ignoreList.includes(type)) {
          actionsChecked.push([id, true])
          const action = {
            type,
            id,
            tipsDes: t(`editorPage.subConfig.nodeActions['${type}'].tipsDes`),
            component: null,
          }
          switch (type) {
            case 'Flag Operator':
            case 'Sort Operator':
            case 'Resolve Domain Operator':
              action.component = shallowRef(ActionRadio)
              break
            default:
              break
          }
          actionsList.push(action)
        }
      })
      // 标记 加载完成
      isInit.value = true
    }
  })

  const addAction = val => {
    addItem(form, actionsList, actionsChecked, val, t)
  }

  const deleteAction = id => {
    deleteItem(form, actionsList, actionsChecked, id)
  }

  const closeCompare = () => {
    compareTableIsVisible.value = false
  }

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
        })
        return
      }

      Toast.loading('生成节点对比中...', { id: 'compare' })
      const data: any = JSON.parse(JSON.stringify(toRaw(form)))
      data.process = actionsToProcess(data.process, actionsList, ignoreList)

      // 过滤掉预览开关关闭的操作
      actionsChecked.forEach(item => {
        if (!item[1]) {
          const index = data.process.findIndex(i => i.id === item[0])
          if (index > -1) {
            data.process.splice(index, 1)
          }
        }
      })

      console.log('compare.....\n', data)
      const type = editType === 'collections' ? 'collection' : 'sub'
      const res = await subsApi.compareSub(type, data)
      compareData.value = res.data
      Toast.hide('compare')
      compareTableIsVisible.value = true
    })
  }

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
        })
        return
      }

      // 如果验证成功，开始保存/修改
      const data: any = JSON.parse(JSON.stringify(toRaw(form)))
      data['display-name'] = data.displayName
      data.process = actionsToProcess(data.process, actionsList, ignoreList)

      console.log('submit.....\n', data)

      const duration = 1500

      try {
        if (configName === 'UNTITLED') {
          await subsApi.createSub(editType as string, data)
        } else {
          let apiType = ''
          if (editType === 'subs') {
            apiType = 'sub'
          } else if (editType === 'collections') {
            apiType = 'collection'
          }
          await subsApi.editSub(apiType, configName as string, data)
        }
        // @ts-ignore
        await subsStore.updateOneData(editType as string, form.name)

        Notify.success(t(`editorPage.subConfig.pop.succeedMsg`), duration)
        router.replace('/')
      } catch (e) {
        Notify.danger(e.error.message, {
          duration: 1500,
        })
      }
    })
  }

  // 唯一名称验证器
  const nameValidator = (val: string) => {
    return new Promise(resolve => {
      if (val === 'UNTITLED') resolve(false)
      const nameList = Object.keys(subsStore.subs).concat(
        Object.keys(subsStore.collections)
      )
      nameList.includes(val) && configName !== val
        ? resolve(false)
        : resolve(true)
    })
  }

  // url 格式验证器
  const urlValidator = (val: string) => {
    return new Promise(resolve => {
      resolve(/^(http|https):\/\/\S+$/.test(val))
    })
  }

  // 失去焦点触发验证
  const customerBlurValidate = (prop: string) => {
    ruleForm.value.validate(prop)
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .page-wrapper {
    padding: 0 $safe-area-side calc(v-bind(padding) + 63px) $safe-area-side;

    :deep(.nut-cell-group__warp) {
      border-radius: $item-card-radios;
    }
  }

  .radio-wrapper {
    display: flex;
    justify-content: end;
  }

  .textarea-wrapper {
    :deep(textarea) {
      .dark-mode & {
        color: $dark-second-text-color;
      }

      .light-mode & {
        color: $light-second-text-color;
      }
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
    padding: 12px $safe-area-side v-bind(padding) $safe-area-side;
    z-index: 20;

    .dark-mode & {
      background: $dark-background-color;
      border-top: 1px solid $dark-divider-color;
    }

    .light-mode & {
      background: $light-background-color;
      border-top: 1px solid $light-divider-color;
    }

    .btn {
      border-radius: 8px;

      svg {
        margin-right: 4px;
      }
    }

    .compare-btn {
      background: transparent;
      width: 36%;

      .dark-mode & {
        color: $dark-second-text-color;
        border-color: $dark-lowest-text-color;
      }
      .light-mode & {
        color: $light-second-text-color;
        border-color: $light-lowest-text-color;
      }
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
        }

        .dark-mode &:not(:last-child) {
          border-color: $dark-divider-color;
        }

        .light-mode & {
          border-color: $light-divider-color;
        }

        .sub-img-wrapper {
          max-width: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;

          .dark-mode & {
            color: $dark-second-text-color;
          }

          .light-mode & {
            color: $light-second-text-color;
          }

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

              .dark-mode &:not(.nut-icon__img) {
                filter: brightness(1000%);
              }

              .light-mode &:not(.nut-icon__img) {
                filter: brightness(0);
              }
            }
          }
        }
      }
    }
  }
</style>
