<template>
  <div class="form-block-wrapper">
    <div class="sticky-title-wrapper">
      <div class="title" @click="toggleFold">
        <p>
          {{ $t(`editorPage.subConfig.commonOptions.label`) }}
        </p>
        <nut-icon v-if="!isFold" name="rect-down" size="12px"></nut-icon>
        <nut-icon v-else name="rect-right" size="12px"></nut-icon>
      </div>
    </div>
    <nut-form v-if="!isFold" class="form">
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
  import { useRouter, useRoute } from 'vue-router';
  import { inject, watchEffect, ref } from 'vue';
  const route = useRoute();

  const storageKey = 'common-block-fold';

  function getFoldState() {
    let states = []
    try {
      let raw = localStorage.getItem(storageKey)
      states = raw ? JSON.parse(raw) : []
      if (!Array.isArray(states)) {
        states = []
      }
    } catch (e) {}

    

    return states.find(item => item.path === route.path)?.isFold ? true : false;
  }
  function setFoldState(isFold) {
    let states = []
    try {
      let raw = localStorage.getItem(storageKey)
      states = raw ? JSON.parse(raw) : []
      if (!Array.isArray(states)) {
        states = []
      }
    } catch (e) {}
    states = states.filter((state) => state.path !== route.path && state.isFold);
    if (isFold) {
      states.unshift({ path: route.path, isFold: 1 });
      if (states.length > 50) {
        states.pop();
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(states));
  }
  const isFold = ref(getFoldState());

  const item = ['DEFAULT', 'ENABLED', 'DISABLED'];

  const form = inject<Sub | Collection>('form');
  const quick = form.process.find(
    item => item.type === 'Quick Setting Operator'
  );
  const toggleFold = () => {
    isFold.value = !isFold.value;
    setFoldState(isFold.value)
  };
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
  .form-block-wrapper {
    .sticky-title-wrapper {
      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        p {
          margin-right: 6px;
        }
        :deep(.nut-icon) {
          // transform: rotate(270deg);
          font-size: 12px;
          height: 12px;
        }
      }
    }
  }
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
    justify-content: flex-end;
  }
</style>
