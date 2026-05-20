<template>
  <div class="expires-datetime-field">
    <VueDatePicker
      ref="pickerRef"
      v-model="pickerValue"
      class="expires-datetime-picker"
      model-type="timestamp"
      :placeholder="placeholder"
      :locale="locale"
      :select-text="confirmText"
      :cancel-text="cancelText"
      :dark="darkTheme"
      :disabled="disabled"
      :clearable="false"
      :hide-input-icon="true"
      :enable-time-picker="true"
      :time-picker-inline="true"
      :start-time="defaultStartTime"
      :minutes-increment="1"
      :minutes-grid-increment="1"
      :month-change-on-scroll="false"
      :auto-apply="false"
      :format="displayFormat"
      position="right"
      teleport="body"
      @blur="$emit('blur')"
      @closed="$emit('closed')"
    >
      <template #trigger>
        <nut-input
          class="nut-input-text expires-datetime-input"
          :border="false"
          readonly
          @click-input="openPicker"
        >
          <template #input>
            <div
              class="expires-datetime-display"
              :class="{ 'has-value': hasValue, 'is-disabled': disabled }"
              role="button"
              :tabindex="disabled ? -1 : 0"
              :aria-disabled="disabled"
              @click.stop="openPicker"
              @keydown.enter.prevent="openPicker"
              @keydown.space.prevent="openPicker"
            >
              <span class="expires-datetime-display__text">
                {{ displayText }}
              </span>
              <button
                v-if="hasValue"
                type="button"
                class="expires-datetime-clear"
                :aria-label="clearText"
                @click.stop="clearValue"
              >
                ×
              </button>
            </div>
          </template>
        </nut-input>
      </template>
      <template #calendar-header="{ day, index }">
        <span
          class="expires-datetime-weekday"
          :class="{ 'is-zh-locale': isChineseLocale }"
        >
          {{ getCalendarHeaderLabel(day, index) }}
        </span>
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker, { type DatePickerInstance } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, ref } from "vue";

import { formatShareTimestamp } from "@/utils/share";

const props = withDefaults(defineProps<{
  modelValue?: number | null;
  placeholder?: string;
  locale?: string;
  confirmText?: string;
  cancelText?: string;
  darkTheme?: boolean;
  disabled?: boolean;
}>(), {
  modelValue: null,
  placeholder: "",
  locale: "en-US",
  confirmText: "",
  cancelText: "",
  darkTheme: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
  (e: "blur"): void;
  (e: "closed"): void;
}>();

const defaultStartTime = Object.freeze({
  hours: 0,
  minutes: 0,
  seconds: 0,
});
const chineseWeekdayLabels = Object.freeze(["一", "二", "三", "四", "五", "六", "日"]);
const displayFormat = "yyyy-MM-dd HH:mm";
const isChineseLocale = computed(() => props.locale.toLowerCase().startsWith("zh"));
const isRussianLocale = computed(() =>
  props.locale.toLowerCase().startsWith("ru"),
);
const clearText = computed(() => {
  if (isChineseLocale.value) return "清空日期时间";
  if (isRussianLocale.value) return "Очистить дату и время";
  return "Clear date and time";
});
const formattedModelValue = computed(() => formatShareTimestamp(props.modelValue));
const hasValue = computed(() => Boolean(formattedModelValue.value));
const displayText = computed(() => formattedModelValue.value || props.placeholder);
const pickerRef = ref<DatePickerInstance>(null);

const getCalendarHeaderLabel = (day: string, index: number) => {
  if (!isChineseLocale.value) {
    return day;
  }

  return chineseWeekdayLabels[index] || day.replace(/^周/, "");
};

const pickerValue = computed<number | null>({
  get: () => props.modelValue ?? null,
  set: (value) => {
    emit("update:modelValue", typeof value === "number" && Number.isFinite(value) ? value : null);
  },
});

const clearValue = () => {
  emit("update:modelValue", null);
};

const openPicker = () => {
  if (props.disabled) {
    return;
  }

  pickerRef.value?.openMenu();
};
</script>

<style lang="scss" scoped>
.expires-datetime-field {
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
}

.expires-datetime-picker {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
}

:deep(.dp__main) {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  font-family: inherit;
}

:deep(.dp__theme_light) {
  --dp-background-color: var(--card-color);
  --dp-background-color-hover: var(--divider-color);
  --dp-border-color: var(--divider-color);
  --dp-text-color: var(--primary-text-color);
  --dp-hover-color: var(--divider-color);
  --dp-hover-text-color: var(--primary-text-color);
  --dp-hover-icon-color: var(--primary-text-color);
  --dp-primary-color: var(--main-color);
  --dp-primary-disabled-color: var(--main-color);
  --dp-primary-text-color: #fff;
  --dp-secondary-color: var(--second-text-color);
  --dp-icon-color: var(--lowest-text-color);
  --dp-danger-color: #d9534f;
  --dp-success-color: #18a058;
  --dp-menu-border-color: var(--divider-color);
  --dp-border-color-hover: var(--main-color);
  --dp-disabled-color: var(--disabled-text-color);
  --dp-scroll-bar-background: var(--divider-color);
  --dp-scroll-bar-color: var(--lowest-text-color);
}

:deep(.dp__theme_dark) {
  --dp-background-color: var(--card-color);
  --dp-background-color-hover: var(--divider-color);
  --dp-border-color: var(--divider-color);
  --dp-text-color: var(--primary-text-color);
  --dp-hover-color: var(--divider-color);
  --dp-hover-text-color: var(--primary-text-color);
  --dp-hover-icon-color: var(--primary-text-color);
  --dp-primary-color: var(--main-color);
  --dp-primary-disabled-color: var(--main-color);
  --dp-primary-text-color: #fff;
  --dp-secondary-color: var(--second-text-color);
  --dp-icon-color: var(--lowest-text-color);
  --dp-danger-color: #ff7875;
  --dp-success-color: #36ad6a;
  --dp-menu-border-color: var(--divider-color);
  --dp-border-color-hover: var(--main-color);
  --dp-disabled-color: var(--disabled-text-color);
  --dp-scroll-bar-background: var(--divider-color);
  --dp-scroll-bar-color: var(--lowest-text-color);
}

.expires-datetime-input {
  width: 100%;
}

.expires-datetime-display {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: 24px;
  color: var(--lowest-text-color);
  cursor: pointer;
  border-radius: 4px;
  outline: none;
}

.expires-datetime-display:focus-visible {
  outline: 2px solid var(--main-color);
  outline-offset: 2px;
}

.expires-datetime-display.has-value {
  padding-right: 26px;
  color: var(--second-text-color);
}

.expires-datetime-display.is-disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.expires-datetime-display__text {
  display: block;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expires-datetime-clear {
  position: absolute;
  top: 50%;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--lowest-text-color);
  font-size: 18px;
  line-height: 1;
  transform: translateY(-50%);
  cursor: pointer;
}

.expires-datetime-clear:hover {
  color: var(--second-text-color);
}

:deep(.dp__action_row) {
  border-top-color: var(--divider-color);
}

:deep(.dp--menu-wrapper) {
  z-index: 11000;
}

:deep(.dp__menu) {
  border-color: var(--divider-color);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
}

:deep(.dp__calendar_header_separator),
:deep(.dp__time_display) {
  color: var(--lowest-text-color);
}

:deep(.dp__button),
:deep(.dp__menu_index),
:deep(.dp__month_year_wrap),
:deep(.dp__calendar_header_item),
:deep(.dp__time_col_reg),
:deep(.dp__time_display),
:deep(.dp__cell_inner) {
  color: inherit;
}

:deep(.expires-datetime-weekday) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25em;
}

:deep(.expires-datetime-weekday.is-zh-locale) {
  font-weight: 500;
}

@media (max-width: 640px) {
  .expires-datetime-field {
    width: 100%;
  }
}
</style>
