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
          <nut-radiogroup direction="horizontal" v-model="quick.args.useless">
            <nut-radio :label="item[2]"
              >{{ $t(`editorPage.subConfig.commonOptions.useless.disabled`) }}
            </nut-radio>
            <nut-radio :label="item[1]"
              >{{ $t(`editorPage.subConfig.commonOptions.useless.enabled`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.udp.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup direction="horizontal" v-model="quick.args.udp">
            <nut-radio :label="item[0]"
              >{{ $t(`editorPage.subConfig.commonOptions.udp.default`) }}
            </nut-radio>
            <nut-radio :label="item[1]"
              >{{ $t(`editorPage.subConfig.commonOptions.udp.enabled`) }}
            </nut-radio>
            <nut-radio :label="item[2]"
              >{{ $t(`editorPage.subConfig.commonOptions.udp.disabled`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.scert.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup direction="horizontal" v-model="quick.args.scert">
            <nut-radio :label="item[0]"
              >{{ $t(`editorPage.subConfig.commonOptions.scert.default`) }}
            </nut-radio>
            <nut-radio :label="item[1]"
              >{{ $t(`editorPage.subConfig.commonOptions.scert.enabled`) }}
            </nut-radio>
            <nut-radio :label="item[2]"
              >{{ $t(`editorPage.subConfig.commonOptions.scert.disabled`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.tfo.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup direction="horizontal" v-model="quick.args.tfo">
            <nut-radio :label="item[0]"
              >{{ $t(`editorPage.subConfig.commonOptions.tfo.default`) }}
            </nut-radio>
            <nut-radio :label="item[1]"
              >{{ $t(`editorPage.subConfig.commonOptions.tfo.enabled`) }}
            </nut-radio>
            <nut-radio :label="item[2]"
              >{{ $t(`editorPage.subConfig.commonOptions.tfo.disabled`) }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions['vmess aead'].label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <nut-radiogroup
            direction="horizontal"
            v-model="quick.args['vmess aead']"
          >
            <nut-radio :label="item[0]"
              >{{
                $t(`editorPage.subConfig.commonOptions['vmess aead'].default`)
              }}
            </nut-radio>
            <nut-radio :label="item[1]"
              >{{
                $t(`editorPage.subConfig.commonOptions['vmess aead'].enabled`)
              }}
            </nut-radio>
            <nut-radio :label="item[2]"
              >{{
                $t(`editorPage.subConfig.commonOptions['vmess aead'].disabled`)
              }}
            </nut-radio>
          </nut-radiogroup>
        </div>
      </nut-form-item>
    </nut-form>
  </div>
  <!--<div class="form-block-wrapper">-->
  <!--  <div class="sticky-title-wrapper">-->
  <!--    <p>-->
  <!--      {{ $t(`editorPage.subConfig.surgeOptions.label`) }}-->
  <!--    </p>-->
  <!--  </div>-->
  <!--  <nut-form class="form">-->
  <!--    <nut-form-item>-->
  <!--      <p class="options-label">-->
  <!--        {{ $t(`editorPage.subConfig.surgeOptions.hybrid.label`) }}-->
  <!--      </p>-->
  <!--      <div class="radio-wrapper options-radio">-->
  <!--        <nut-radiogroup-->
  <!--          direction="horizontal"-->
  <!--          v-model="options['surge-hybrid']"-->
  <!--        >-->
  <!--          <nut-radio label="DEFAULT"-->
  <!--            >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.default`) }}-->
  <!--          </nut-radio>-->
  <!--          <nut-radio label="FORCE_OPEN"-->
  <!--            >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.open`) }}-->
  <!--          </nut-radio>-->
  <!--          <nut-radio label="FORCE_CLOSE"-->
  <!--            >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.close`) }}-->
  <!--          </nut-radio>-->
  <!--        </nut-radiogroup>-->
  <!--      </div>-->
  <!--    </nut-form-item>-->
  <!--  </nut-form>-->
  <!--</div>-->
</template>

<script lang="ts" setup>
  import { inject, watchEffect } from 'vue';

  const item = ['DEFAULT', 'ENABLED', 'DISABLED'];

  const form = inject<Sub | Collection>('form');
  const quick = form.process.find(
    item => item.type === 'Quick Setting Operator'
  );
  watchEffect(() => {
    if (!quick.args) {
      quick.args = {
        useless: 'DISABLED',
        udp: 'DEFAULT',
        scert: 'DEFAULT',
        tfo: 'DEFAULT',
        'vmess aead': 'DEFAULT',
      };
    }
  });
</script>

<style lang="scss" scoped>
  .options-label {
    font-size: 12px;
    margin-bottom: 16px;
    color: var(--comment-text-color);
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
