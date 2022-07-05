<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].action.des`) }}
    </p>
    <nut-radiogroup direction="horizontal" v-model="value.action">
      <nut-radio v-for="(key, index) in actionList" :label="key" :key="index"
        >{{
          $t(
            `editorPage.subConfig.nodeActions['${type}'].action.options[${index}]`
          )
        }}
      </nut-radio>
    </nut-radiogroup>
    <template v-if="value.action === 'rename'">
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].position.des`) }}
      </p>
      <nut-radiogroup direction="horizontal" v-model="value.position">
        <nut-radio
          v-for="(key, index) in positionList"
          :label="key"
          :key="index"
          >{{
            $t(
              `editorPage.subConfig.nodeActions['${type}'].position.options[${index}]`
            )
          }}
        </nut-radio>
      </nut-radiogroup>
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].template.des`) }}
      </p>
      <div class="input-wrapper">
        <nut-input
          label=""
          :placeholder="
            $t(
              `editorPage.subConfig.nodeActions['${type}'].template.placeholder`
            )
          "
          v-model="value.template"
        />
      </div>
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].link.des`) }}
      </p>
      <div class="input-wrapper">
        <nut-input
          label=""
          :placeholder="
            $t(`editorPage.subConfig.nodeActions['${type}'].link.placeholder`)
          "
          v-model="value.link"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { inject, onMounted, watch, reactive, toRaw } from 'vue';

  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  const actionList = ['rename', 'delete'];
  const positionList = ['front', 'back'];

  const value = reactive({
    action: '',
    position: '',
    template: '',
    link: '',
  });

  // 挂载时将 value 值指针指向 form 对应的数据
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) {
      value.action = item.args.action;
      value.position = item.args.position;
      value.template = item.args.template;
      value.link = item.args.link;
    }
  });

  watch(value, () => {
    const item = form.process.find(item => item.id === id);
    if (item) item.args = toRaw(value);
  });
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .des-label {
    font-size: 12px;
    margin-bottom: 8px;

    &:not(:first-child) {
      margin-top: 16px;
    }

    .dark-mode & {
      color: $dark-comment-text-color;
    }

    .light-mode & {
      color: $light-comment-text-color;
    }
  }

  .nut-radiogroup {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .input-wrapper {
    display: flex;
    align-items: center;

    > view.nut-input {
      background: transparent;
      padding: 8px 12px;
      margin-right: 16px;
      border-bottom: 1px solid;

      .dark-mode & {
        color: $dark-second-text-color;
        border-color: $dark-lowest-text-color;
      }

      .light-mode & {
        color: $light-second-text-color;
        border-color: $light-lowest-text-color;
      }
    }
  }
</style>
