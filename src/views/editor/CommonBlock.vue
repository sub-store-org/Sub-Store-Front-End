<template>
  <div class="form-block-wrapper">
    <div class="sticky-title-wrapper">
      <p>
        {{ $t(`editorPage.subConfig.commonOptions.label`) }}
      </p>
    </div>
    <nut-form class="form">
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.useless.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup direction="horizontal" v-model="options.useless">
            <nut-radio label="KEEP"
              >{{ $t(`editorPage.subConfig.commonOptions.useless.keep`) }}
            </nut-radio>
            <nut-radio label="REMOVE"
              >{{ $t(`editorPage.subConfig.commonOptions.useless.remove`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.udp.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup direction="horizontal" v-model="options.udp">
            <nut-radio label="DEFAULT"
              >{{ $t(`editorPage.subConfig.commonOptions.udp.default`) }}
            </nut-radio>
            <nut-radio label="FORCE_OPEN"
              >{{ $t(`editorPage.subConfig.commonOptions.udp.open`) }}
            </nut-radio>
            <nut-radio label="FORCE_CLOSE"
              >{{ $t(`editorPage.subConfig.commonOptions.udp.close`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.scv.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup
            direction="horizontal"
            v-model="options['skip-cert-verify']"
          >
            <nut-radio label="DEFAULT"
              >{{ $t(`editorPage.subConfig.commonOptions.scv.default`) }}
            </nut-radio>
            <nut-radio label="FORCE_OPEN"
              >{{ $t(`editorPage.subConfig.commonOptions.scv.open`) }}
            </nut-radio>
            <nut-radio label="FORCE_CLOSE"
              >{{ $t(`editorPage.subConfig.commonOptions.scv.close`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.tfo.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup direction="horizontal" v-model="options.tfo">
            <nut-radio label="DEFAULT"
              >{{ $t(`editorPage.subConfig.commonOptions.tfo.default`) }}
            </nut-radio>
            <nut-radio label="FORCE_OPEN"
              >{{ $t(`editorPage.subConfig.commonOptions.tfo.open`) }}
            </nut-radio>
            <nut-radio label="FORCE_CLOSE"
              >{{ $t(`editorPage.subConfig.commonOptions.tfo.close`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.aead.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup direction="horizontal" v-model="options.aead">
            <nut-radio label="DEFAULT"
              >{{ $t(`editorPage.subConfig.commonOptions.aead.default`) }}
            </nut-radio>
            <nut-radio label="FORCE_OPEN"
              >{{ $t(`editorPage.subConfig.commonOptions.aead.open`) }}
            </nut-radio>
            <nut-radio label="FORCE_CLOSE"
              >{{ $t(`editorPage.subConfig.commonOptions.aead.close`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
    </nut-form>
  </div>
  <div class="form-block-wrapper">
    <div class="sticky-title-wrapper">
      <p>
        {{ $t(`editorPage.subConfig.surgeOptions.label`) }}
      </p>
    </div>
    <nut-form class="form">
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.surgeOptions.hybrid.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup
            direction="horizontal"
            v-model="options['surge-hybrid']"
          >
            <nut-radio label="DEFAULT"
              >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.default`) }}
            </nut-radio>
            <nut-radio label="FORCE_OPEN"
              >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.open`) }}
            </nut-radio>
            <nut-radio label="FORCE_CLOSE"
              >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.close`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
    </nut-form>
  </div>
</template>

<script lang="ts" setup>
  import { inject, reactive, watch, watchEffect, ref } from 'vue'

  const fetchComplete = ref(false)
  const options = reactive({
    'useless': 'KEEP',
    'udp': 'DEFAULT',
    'skip-cert-verify': 'DEFAULT',
    'tfo': 'DEFAULT',
    'aead': 'DEFAULT',
    'surge-hybrid': 'DEFAULT',
  })

  const form = inject<Sub | Collection>('form')

  watchEffect(() => {
    if (!fetchComplete.value) {
      // 初始化 UI 显示的选项
      if (form.process) {
        form.process.forEach(item => {
          if (item.type === 'Useless Filter') {
            options.useless = 'REMOVE'
          }
          if (item.type === 'Set Property Operator') {
            const key = item.args.key
            options[key] = item.args.value ? 'FORCE_OPEN' : 'FORCE_CLOSE'
          }
        })
        // 标记 flag
        fetchComplete.value = true
      }
    }
  })

  watch(options, () => {
    // 选项转换为表单 process 逻辑
    // 初始化成功后再监听，否则会出现重复初始化的情况
    if (fetchComplete.value) {
      // useless 的选项操作逻辑
      const index = form.process.findIndex(
        item => item.type === 'Useless Filter'
      )
      if (options.useless === 'REMOVE' && index === -1) {
        form.process.push({
          type: 'Useless Filter',
        })
      } else if (options.useless === 'KEEP' && index !== -1) {
        form.process.splice(index, 1)
      }

      // 其他常用选项的逻辑
      const nameList = Object.keys(options)
      const uselessOptionIndex = nameList.findIndex(item => item === 'useless')
      nameList.splice(uselessOptionIndex, 1)
      nameList.forEach(item => {
        const index = form.process.findIndex(
          processItem => processItem.args?.key === item
        )
        if (options[item] === 'DEFAULT') {
          if (index !== -1) {
            form.process.splice(index, 1)
          }
        } else {
          if (index === -1) {
            form.process.push({
              type: 'Set Property Operator',
              args: {
                key: item,
                value: options[item] === 'FORCE_OPEN',
              },
            })
          } else {
            form.process[index].args.value = options[item] === 'FORCE_OPEN'
          }
        }
      })
    }
  })
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .options-label {
    font-size: 12px;
    margin-bottom: 16px;

    .dark-mode & {
      color: $dark-comment-text-color;
    }

    .light-mode & {
      color: $light-comment-text-color;
    }
  }

  .radio-wrapper.options-radio {
    justify-content: start;

    .nut-radiogroup {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .radio-wrapper {
    display: flex;
    justify-content: end;
  }
</style>
