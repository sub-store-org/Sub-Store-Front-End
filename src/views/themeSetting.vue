<template>
  <div class="page-wrapper">
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

    <nut-cell-group
      class="cell-group"
      v-if="theme.auto"
      :title="$t(`themeSettingPage.themeSettingTitle`)"
    >
      <nut-cell
        class="cell-item"
        :title="$t(`themeSettingPage.dark`)"
        :desc="themeDes.darkDes"
        @click="openPicker('dark')"
        is-link
      />
      <nut-cell
        class="cell-item"
        :title="$t(`themeSettingPage.light`)"
        :desc="themeDes.lightDes"
        @click="openPicker('light')"
        is-link
      />
    </nut-cell-group>
    <nut-cell
      v-else
      class="cell-item"
      :title="$t(`themeSettingPage.themeSettingTitle`)"
      :desc="themeDes.nameDes"
      @click="openPicker('name')"
      is-link
    />
  </div>

  <nut-picker
    v-model="selectedValue"
    v-model:visible="showThemePicker"
    :columns="pickerColumn"
    :title="$t(`themeSettingPage.themePicker.title`)"
    :cancel-text="$t(`themeSettingPage.themePicker.cancel`)"
    :ok-text="$t(`themeSettingPage.themePicker.confirm`)"
    @confirm="confirm"
  ></nut-picker>
</template>

<script lang="ts" setup>
  import { useMousePicker } from '@/hooks/useMousePicker';
  import { useThemes } from '@/hooks/useThemes';
  import { useSettingsStore } from '@/store/settings';
  import { storeToRefs } from 'pinia';
  import { computed, ref, toRaw, watchEffect } from 'vue';

  const pickerType = ref('');
  const autoSwitch = ref(false);
  const showThemePicker = ref(false);

  const settingsStore = useSettingsStore();
  const { changeTheme } = settingsStore;
  const { theme } = storeToRefs(settingsStore);
  const { pickerList, pickerLightList, pickerDarkList, isAuto } = useThemes();
  useMousePicker();
  const selectedValue = ref(['dark']);

  const themeDes = computed(() => {
    return {
      lightDes: pickerLightList.value.find(
        item => item.value === theme.value.light
      ).text,
      darkDes: pickerDarkList.value.find(item => {
        return item.value === theme.value.dark;
      }).text,
      nameDes: pickerList.value.find(item => item.value === theme.value.name)
        .text,
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

  const autoSwitchIsChange = val => {
    const data = { ...theme.value };
    data.auto = val;
    changeTheme({ theme: data });
  };

  watchEffect(() => {
    autoSwitch.value = isAuto();
  });
</script>

<style lang="scss" scoped>
  .page-wrapper {
    height: 100%;
    padding: var(--safe-area-side);
    display: flex;
    flex-direction: column;
    align-items: center;

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
</style>
