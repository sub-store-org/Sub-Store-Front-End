<template>
  <div v-if="isDis">
  <div class="page-wrapper" @click="handleEditGlobalClick">
    <!-- 基础表单 -->
    <div class="form-block-wrapper">
      <div v-if="appearanceSetting.isShowIcon" class="sticky-title-icon-container">
        <nut-image
          :class="{ 'sub-item-customer-icon': !form.isIconColor }"
          :src="subIcon"
          fit="cover"
          show-loading
          @click="showIconPopup"
        />
      </div>
      <!-- <div class="sticky-title-wrapper">
        <p>{{ $t(`editorPage.subConfig.basic.label`) }}</p>
      </div> -->
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
            data-1p-ignore
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
            data-1p-ignore
            v-model.trim="form.displayName"
            :placeholder="
              $t(`editorPage.subConfig.basic.displayName.placeholder`)
            "
            type="text"
          />
        </nut-form-item>
        <!-- remark -->
        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.remark.label`)"
          prop="remark"
        >
          <nut-textarea
            class="nut-input-text"
            :border="false"
            v-model="form.remark"
            :placeholder="
              $t(`editorPage.subConfig.basic.remark.placeholder`)
            "
            type="text"
            input-align="right"
            rows="1"
            :autosize="{ maxHeight: 140 }"
            max-length="100"
          />
        </nut-form-item>
        <!-- tag -->
        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.tag.label`)"
          prop="tag"
        >
          <nut-input
            class="nut-input-text"
            v-model.trim="form.tag"
            :border="false"
            :placeholder="$t(`editorPage.subConfig.basic.tag.placeholder`)"
            type="text"
            input-align="right"
            right-icon="rect-right"
            @click-right-icon="showTagPopup('tag')"
          >
          </nut-input>
        </nut-form-item>
        <!-- icon -->
        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.icon.label`)"
          prop="icon"
        >
          <nut-input
              :border="false"
              class="nut-input-text"
              v-model.trim="form.icon"
              :placeholder="$t(`editorPage.subConfig.basic.icon.placeholder`)"
              type="text"
              input-align="right"
              left-icon="shop"
              @click-left-icon="showIconPopup"
            />
        </nut-form-item>
        <!-- isIconColor -->
        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.isIconColor.label`)"
          prop="isIconColor"
          class="ignore-failed-wrapper"
        >
          <div class="switch-wrapper">
            <nut-switch v-model="form.isIconColor" />
          </div>
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
                <nut-radio shape="button" label="remote">
                  {{ $t(`editorPage.subConfig.basic.source.remote`) }}
                </nut-radio>
                <nut-radio shape="button" label="local">
                  {{ $t(`editorPage.subConfig.basic.source.local`) }}
                </nut-radio>
              </nut-radiogroup>
            </div>
          </nut-form-item>
          <!-- url / content -->
          <!-- :label="$t(`editorPage.subConfig.basic.url.label`)" -->
          <nut-form-item
            required
            
            v-if="form.source === 'remote'"
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
            <template v-slot:label>
              <span class="label-tips" @click="urlTips">
                <p>{{$t(`editorPage.subConfig.basic.url.label`)}}</p>
                <span class="tips">
                  <span>{{$t(`editorPage.subConfig.basic.url.tips.label`)}}</span>
                  <!-- <nut-icon name="tips"></nut-icon> -->
                </span>
              </span>
            </template>
            <nut-textarea
              class="textarea-wrapper"
              @blur="customerBlurValidate('url')"
              @change="strTrim('url')"
              v-model="form.url"
              :autosize="{ maxHeight: 110, minHeight: 50 }"
              :placeholder="$t(`editorPage.subConfig.basic.url.placeholder`)"
              type="text"
            />
          </nut-form-item>
          <nut-form-item
            v-else-if="form.source === 'local'"
            :label="undefined"
            prop="content"
          >
            <!-- <nut-textarea
              class="textarea-wrapper"
              v-model="form.content"
              text-align="left"
              :autosize="{ maxHeight: 410, minHeight: 50 }"
              :placeholder="
                $t(`editorPage.subConfig.basic.content.placeholder`)
              "
              type="text"
            /> -->
            <button class="cimg-button" @click="isDis = false">
              <img src="" />
              {{ $t(`editorPage.subConfig.basic.url.tips.fullScreenEdit`) }}
              <!-- 测试 后续再改效果 -->
            </button>
            <input type="file" ref="fileInput" @change="fileChange" style="display: none">
            <button class="cimg-button" @click="upload">
              {{ $t(`editorPage.subConfig.basic.url.tips.importFromFile`) }}
            </button>
            <span class="button-tips" @click="contentTips">
                <span class="tips">
                  <span>{{$t(`editorPage.subConfig.basic.url.tips.label`)}}</span>
                  <!-- <nut-icon name="tips"></nut-icon> -->
                </span>
              </span>
            <div style="margin-left: -15px; margin-right: -15px;max-height: 60vh;overflow: auto;">
              <cmView :isReadOnly="false" id="SubEditer"/>
            </div>
          </nut-form-item>
          <!-- ua -->
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.passThroughUA.label`)"
            prop="passThroughUA"
            class="ignore-failed-wrapper"
            v-if="form.source === 'remote'"
          >
            <div class="switch-wrapper">
              <nut-switch v-model="form.passThroughUA" @change="handlePassThroughUAChange"/>
            </div>
          </nut-form-item>
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.ua.label`)"
            prop="ua"
            v-if="form.source === 'remote'"
          >
            <nut-input
              :border="false"
              class="nut-input-text"
              v-model.trim="form.ua"
              :placeholder="userAgentPlaceholder"
              type="text"
              input-align="right"
              left-icon="tips"
              :readonly="passThroughUAOn"
              @click-left-icon="uaTips"
            />
          </nut-form-item>

          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.subUserinfo.label`)"
            prop="subUserinfo"
          >
            <nut-input
              :border="false"
              class="nut-input-text"
              v-model.trim="form.subUserinfo"
              :placeholder="
                $t(`editorPage.subConfig.basic.subUserinfo.placeholder`)
              "
              type="text"
              input-align="right"
              left-icon="tips"
              @click-left-icon="subUserinfoTips"
            />
          </nut-form-item>

          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.proxy.label`)"
            prop="proxy"
          >
            <nut-input
              :border="false"
              class="nut-input-text"
              v-model.trim="form.proxy"
              :placeholder="$t(`editorPage.subConfig.basic.proxy.placeholder`)"
              type="text"
              input-align="right"
              left-icon="tips"
              @click-left-icon="proxyTips"
            />
          </nut-form-item>

          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.source.mergeSources`)"
            prop="mergeSources"
          >
            <div class="radio-wrapper">
              <nut-radiogroup
                direction="horizontal"
                v-model="form.mergeSources"
              >
                <nut-radio shape="button" label="">
                  {{ $t(`editorPage.subConfig.basic.source.noMerge`) }}
                </nut-radio>
                <nut-radio shape="button" label="localFirst">
                  {{ $t(`editorPage.subConfig.basic.source.localFirst`) }}
                </nut-radio>
                <nut-radio shape="button" label="remoteFirst">
                  {{ $t(`editorPage.subConfig.basic.source.remoteFirst`) }}
                </nut-radio>
              </nut-radiogroup>
            </div>
          </nut-form-item>
        </template>

        <template v-else-if="editType === 'collections'">
          <!-- subscriptionTags -->
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.subscriptionTags.label`)"
            prop="subscriptionTags"
          >
            <nut-input
              :border="false"
              class="nut-input-text"
              v-model.trim="form.subscriptionTags"
              :placeholder="$t(`editorPage.subConfig.basic.subscriptionTags.placeholder`)"
              type="text"
              input-align="right"
              left-icon="tips"
              right-icon="rect-right"
              @click-left-icon="subscriptionTagsTips"
              @click-right-icon="showTagPopup('linkTag')"
            />
          </nut-form-item>
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.subscriptions.label`)+ selectedSubs"
            prop="subscriptions"
            class="include-subs-wrapper"
          >
            <div v-if="tags && tags.length > 0" class="tag-check">
              <div class="radio-wrapper">
                <span
                  v-for="i in tags"
                  :class="{ tag: true, current: i.value === tag }"
                  @click="setTag(i.value)"
                >
                  {{ i.label }}
                </span>
              </div>
              <nut-checkbox v-model="subCheckbox" :indeterminate="subCheckboxIndeterminate" @click="subCheckboxClick"></nut-checkbox>
            </div>
            <nut-checkboxgroup
              v-model="form.subscriptions"
              class="subs-checkbox-wrapper"
            >
              <draggable
                :list="filteredSubsSelectList"
                :sort="true"
                item-key="0"
                animation="300"
                :scroll-sensitivity="200"
                :force-fallback="true"
                :scroll-speed="8"
                :scroll="true"
                handle=".drag-handle"
                @start="onStartDrag"
                @end="onEndDrag"
              >
                <template #item="{ element }">
                  <nut-checkbox
                    v-show="shouldShowElement(element[3])"
                    :key="element[0]"
                    :label="element[0]"
                    text-position="left"
                    class="subs-checkbox"
                  >
                    <div class="sub-img-wrapper">
                      <nut-avatar
                        :class="{ 'sub-item-customer-icon': !element[4], 'icon': true  }"
                        v-if="element[2]"
                        size="32"
                        :url="element[2]"
                        bg-color=""
                      ></nut-avatar>
                      <span class="sub-item">
                        <span class="name">{{ element[1] }}</span>
                        <span class="tag" v-for="i in element[3]" :key="i">
                          <nut-tag>{{ i }}</nut-tag>
                        </span>
                      </span>
                      <font-awesome-icon icon="fa-solid fa-bars" class="drag-handle"/>
                    </div>
                  </nut-checkbox>
                </template>
              </draggable>
            </nut-checkboxgroup>
            </nut-form-item>
            <nut-form-item
              :label="$t(`editorPage.subConfig.basic.subUserinfo.label`)"
              prop="subUserinfo"
            >
              <nut-input
                :border="false"
                class="nut-input-text"
                v-model.trim="form.subUserinfo"
                :placeholder="
                  $t(`editorPage.subConfig.basic.subUserinfo.placeholder`)
                "
                type="text"
                input-align="right"
                left-icon="tips"
                @click-left-icon="subUserinfoTips"
              />
            </nut-form-item>
            <nut-form-item
              :label="$t(`editorPage.subConfig.basic.proxy.label`)"
              prop="proxy"
            >
              <nut-input
                :border="false"
                class="nut-input-text"
                v-model.trim="form.proxy"
                :placeholder="$t(`editorPage.subConfig.basic.proxy.placeholder`)"
                type="text"
                input-align="right"
                left-icon="tips"
                @click-left-icon="proxyTips"
              />
            </nut-form-item>
        </template>

        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.ignoreFailedRemoteSub.label`)"
          prop="ignoreFailedRemoteSub"
          class="ignore-failed-wrapper"
        >
          <!-- <div class="switch-wrapper">
            <nut-switch v-model="form.ignoreFailedRemoteSub" />
          </div> -->
          <div class="radio-wrapper">
            <nut-radiogroup direction="horizontal" v-model="form.ignoreFailedRemoteSub">
              <nut-radio shape="button" label="disabled">
                {{ $t(`editorPage.subConfig.basic.ignoreFailedRemoteSub.disabled`) }}
              </nut-radio>
              <nut-radio shape="button" label="quiet">
                {{ $t(`editorPage.subConfig.basic.ignoreFailedRemoteSub.quiet`) }}
              </nut-radio>
              <nut-radio shape="button" label="enabled">
                {{ $t(`editorPage.subConfig.basic.ignoreFailedRemoteSub.enabled`) }}
              </nut-radio>
            
            </nut-radiogroup>
          </div>
        </nut-form-item>
      </nut-form>
    </div>

    <!-- 常用配置 -->
    <CommonBlock v-if="appearanceSetting.isEditorCommon" />

    <!-- 节点操作 -->
    <ActionBlock
      ref="actionBlockRef"
      :checked="actionsChecked"
      :list="actionsList"
      @updateCustomNameModeFlag="updateCustomNameModeFlag"
      @addAction="addAction"
      @deleteAction="deleteAction"
      @toggleAction="toggleAction"
    />
  </div>

  <div class="bottom-btn-wrapper">
    <nut-button @click="compare" class="compare-btn btn" plain shape="square">
      <font-awesome-icon icon="fa-solid fa-eye" />
      {{ $t("editorPage.subConfig.btn.compare") }}
    </nut-button>
    <nut-button
      @click="submit"
      class="submit-btn btn"
      type="primary"
      shape="square"
    >
      <font-awesome-icon icon="fa-solid fa-floppy-disk" />
      {{ $t("editorPage.subConfig.btn.save") }}
    </nut-button>
  </div>
</div>
<div v-else style="width: 100%;max-height: 95vh;">
    <button class="cimg-button" @click="isDis = true">
      <img src="" />
      {{ $t(`editorPage.subConfig.basic.url.tips.fullScreenEditCancel`) }}
    </button>
    <cmView :isReadOnly="false" id="SubEditer" />
  </div>
  <CompareTable
    v-if="compareTableIsVisible"
    :name="configName"
    :compareData="compareData"
    @closeCompare="closeCompare"
  />
  <icon-popup
    v-model:visible="iconPopupVisible"
    ref="iconPopupRef"
    @setIcon="setIcon">
  </icon-popup>
  <tag-popup
    v-model:visible="tagPopupVisible"
    ref="tagPopupRef"
    :currentTag="currentTag"
    @setTag="setTagValue">
  </tag-popup>
</template>

<script lang="ts" setup>
import { useArtifactsStore } from "@/store/artifacts";
import { useSubsApi } from "@/api/subs";
import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import { usePopupRoute } from "@/hooks/usePopupRoute";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from '@/store/settings';
import { useSubsStore } from "@/store/subs";
import { addItem, deleteItem, toggleItem } from "@/utils/actionsOperate";
import { actionsToProcess } from "@/utils/actionsToPorcess";
import { initStores } from "@/utils/initApp";
import draggable from "vuedraggable";
import CompareTable from "@/views/CompareTable.vue";
import ActionBlock from "@/views/editor/ActionBlock.vue";
import CommonBlock from "@/views/editor/CommonBlock.vue";
import ActionRadio from "@/views/editor/components/ActionRadio.vue";
import FilterSelect from "@/views/editor/components/FilterSelect.vue";
import HandleDuplicate from "@/views/editor/components/HandleDuplicate.vue";
import Regex from "@/views/editor/components/Regex.vue";
import Script from "@/views/editor/components/Script.vue";
import IconPopup from "@/views/icon/IconPopup.vue";
import TagPopup from "@/components/TagPopup.vue";
import { Dialog, Toast } from "@nutui/nutui";
import { storeToRefs } from "pinia";
import {
  computed,
  provide,
  reactive,
  ref,
  shallowRef,
  toRaw,
  watchEffect,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import cmView from "@/views/editCode/cmView.vue";
import { useCodeStore } from "@/store/codeStore";
const cmStore = useCodeStore();
const isDis = ref(true)
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const subsApi = useSubsApi();
const editType = route.params.editType as string;
const configName = route.params.id as string;
const subsStore = useSubsStore();
const { showNotify } = useAppNotifyStore();

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const { appearanceSetting } = storeToRefs(settingsStore);

const {
    bottomSafeArea,
    // isEditorCommon,
    // isDefaultIcon, 
    // isIconColor 
  } = storeToRefs(globalStore);
const padding = bottomSafeArea.value + "px";

  const sub = computed(() => subsStore.getOneSub(configName));
  const collection = computed(() => subsStore.getOneCollection(configName));

  
  const subsSelectList = computed(() => {
    return subsStore.subs.map(item => {
      return [
        item.name,
        item.displayName || item['display-name'] || item.name,
        item.icon || (appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon),
        item.tag,
        item.isIconColor !== false
      ];
    });
  });
  const hasUntagged = ref(false);
  const tags = computed(() => {
    if(!subsStore.subs || subsStore.subs.length === 0) return []
    const set = new Set()
    subsStore.subs.forEach(sub => {
      if (Array.isArray(sub.tag) && sub.tag.length > 0) {
        sub.tag.forEach(i => {
          set.add(i)
        });
      } else {
        hasUntagged.value = true
      }
    })

    let tags: any[] = Array.from(set)
    if(tags.length === 0) return []
    tags = tags.map(i => ({ label: i, value: i }));
    const result = [{ label: t("specificWord.all"), value: "all" }, ...tags]
    if(hasUntagged.value) result.push({ label: t("specificWord.untagged"), value: "untagged" })
    return result
  });
  const tag = ref('all');
  const tagPopupVisible = ref(false);
  const tagType = ref('tag'); // 标签tag | 关联订阅标签linkTag
  const tagPopupRef = ref(null);
  const currentTag = computed(() => {
    if (tagType.value === 'linkTag') {
      return form.subscriptionTags
    } else {
      return form.tag
    }
  })
  const showTagPopup = (type:string) => {
    tagType.value = type || 'tag'
    tagPopupVisible.value = true
  };
  const setTagValue = (tag: any) => {
    if (tagType.value === 'linkTag') {
      form.subscriptionTags = tag;
    } else {
      form.tag = tag;      
    }
  };
  const selectedSubs = computed(() => {
    const subscriptions = form.subscriptions || [];
    if(!Array.isArray(subscriptions) || subscriptions.length === 0) return `: ${t(`editorPage.subConfig.basic.subscriptions.empty`)}`
    return `: ${subscriptions.map((name) => {
      const sub = subsStore.getOneSub(name);
      return sub?.displayName || sub?.["display-name"] || sub?.name;
    }).join(', ')}`
  });
  const compareTableIsVisible = ref(false);
  usePopupRoute(compareTableIsVisible);
  const compareData = ref();

let scrollTop = 0;
const isInit = ref(false);
const ruleForm = ref<any>(null);
const actionsChecked = reactive([]);
const actionsList = reactive([]);
const isget = ref(false);
const fileInput = ref(null);
const form = reactive<any>({
  name: "",
  displayName: "",
  form: "",
  remark: "",
  mergeSources: "",
  ignoreFailedRemoteSub: false,
  passThroughUA: false,
  icon: "",
  isIconColor: true,
  process: [
    {
      type: "Quick Setting Operator",
    },
  ],
});
provide("form", form);

// 排除非动作卡片
const ignoreList = ["Quick Setting Operator"];
watch(
  () => cmStore.EditCode['SubEditer'],
  (newCode) => {
    form.content = newCode;
  }
);

watchEffect(() => {
  if (isInit.value) return;
  if (configName === "UNTITLED") {
    // 新建时，初始化表单
    switch (editType) {
      case "collections":
        form.subscriptions = [];
        break;
      case "subs":
        form.source = "remote";
        form.url = "";
        form.content = "";
        form.ua = "";
        cmStore.setEditCode('SubEditer', "");
        break;
    }
    // 标记 加载完成
    isInit.value = true;
    return;
  }

  const sourceData: any = toRaw(sub.value) || toRaw(collection.value);
  const newProcess = JSON.parse(JSON.stringify(sourceData.process));
  form.mergeSources = sourceData.mergeSources;
  let ignoreFailedRemoteSub = sourceData.ignoreFailedRemoteSub;
  if (ignoreFailedRemoteSub === true) {
    ignoreFailedRemoteSub = 'quiet';
  } else if (ignoreFailedRemoteSub === false || ignoreFailedRemoteSub == null) {
    ignoreFailedRemoteSub = 'disabled';
  }
  form.ignoreFailedRemoteSub = ignoreFailedRemoteSub;
  form.passThroughUA = sourceData.passThroughUA;
  form.name = sourceData.name;
  form.displayName = sourceData.displayName || sourceData["display-name"];
  form.remark = sourceData.remark;
  form.icon = sourceData.icon;
  form.isIconColor = sourceData.isIconColor !== false;
  form.process = newProcess;
  form.subUserinfo = sourceData.subUserinfo;
  form.proxy = sourceData.proxy;
  form.tag = Array.isArray(sourceData.tag)
    ? sourceData.tag.join(", ")
    : sourceData.tag;
  form.subscriptionTags = Array.isArray(sourceData.subscriptionTags)
    ? sourceData.subscriptionTags.join(", ")
    : sourceData.subscriptionTags;

  switch (editType) {
    case "collections":
      form.subscriptions = [];
      form.subscriptions.push(...sourceData.subscriptions);
      console.log('form.subscriptions ==>', form.subscriptions);
      break;
    case "subs":
      form.source = sourceData.source;
      form.url = sourceData.url;
      form.content = sourceData.content;
      cmStore.setEditCode('SubEditer', sourceData.content);
      form.ua = sourceData.ua;
      form._savedUA = sourceData._savedUA;
      if(form.passThroughUA && form.ua){
        showNotify({
          type: "warning",
          title: t(`editorPage.subConfig.basic.passThroughUA.warning`),
          duration: 65535,
        });
      }
      break;
  }

  if (sourceData.process.length > 0) {
    form.process.forEach((item) => {
      const { type, id, customName, disabled } = item;

      if (!ignoreList.includes(type)) {
        actionsChecked.push([id, true]);
        const action = {
          type,
          id,
          customName,
          tipsDes: t(`editorPage.subConfig.nodeActions['${type}'].tipsDes`),
          component: null,
          enabled: !disabled,
        };
        switch (type) {
          case "Flag Operator":
          case "Sort Operator":
          case "Resolve Domain Operator":
            action.component = shallowRef(ActionRadio);
            break;
          case "Region Filter":
          case "Type Filter":
            action.component = shallowRef(FilterSelect);
            break;
          case "Regex Filter":
          case "Regex Sort Operator":
          case "Regex Delete Operator":
          case "Regex Rename Operator":
            action.component = shallowRef(Regex);
            break;
          case "Handle Duplicate Operator":
            action.component = shallowRef(HandleDuplicate);
            break;
          case "Script Filter":
          case "Script Operator":
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

const addAction = (val) => {
  addItem(form, actionsList, actionsChecked, val, t);
};

const deleteAction = (id) => {
  deleteItem(form, actionsList, actionsChecked, id);
};

const toggleAction = (id) => {
  toggleItem(actionsList, id);
};

const closeCompare = () => {
  document.querySelector("html").style["overflow-y"] = "";
  document.querySelector("html").style.height = "";
  document.body.style.height = "";
  document.body.style["overflow-y"] = "";
  (document.querySelector("#app") as HTMLElement).style["overflow-y"] = "";
  (document.querySelector("#app") as HTMLElement).style.height = "";

  compareTableIsVisible.value = false;

  window.scrollTo({
    top: scrollTop,
    behavior: "instant" as any,
  });

  router.back();
};
const upload = async() => {
  try {
    fileInput.value.click()
  } catch (e) {
    console.error(e);
  }
}
const fileChange = async (event) => {
  const file = event.target.files[0];
  if(!file) return
  try {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      cmStore.setEditCode("SubEditer", String(reader.result));
    }

    reader.onerror = e => {
      throw e
    }
    
  } catch (e) {
    showNotify({
      type: "danger",
      title: '文件导入失败',
    });
    console.error(e);
  }
};
const compare = () => {
  ruleForm.value.validate().then(async ({ valid, errors }: any) => {
    // 如果验证失败
    if (!valid) {
      Dialog({
        title: t(`editorPage.subConfig.pop.errorTitle`),
        content: errors[0].message,
        popClass: "auto-dialog",
        noCancelBtn: true,
        okText: t(`editorPage.subConfig.pop.errorBtn`),
        // @ts-ignore
        closeOnClickOverlay: true,
      });
      return;
    }

    Toast.loading("生成节点对比中...", {
      id: "compare",
      cover: true,
      duration: 1500,
    });
    const data: any = JSON.parse(JSON.stringify(toRaw(form)));
    data.process = actionsToProcess(data.process, actionsList, ignoreList);
    if (data.ignoreFailedRemoteSub === "disabled"){
      data.ignoreFailedRemoteSub = false;
    }
    data.tag = [
      ...new Set(
        (data.tag || "")
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length)
      ),
    ];
    data.subscriptionTags = [
      ...new Set(
        (data.subscriptionTags || "")
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length)
      ),
    ];

    // 过滤掉预览开关关闭的操作
    actionsChecked.forEach((item) => {
      if (!item[1]) {
        const index = data.process.findIndex((i) => i.id === item[0]);
        if (index > -1) {
          data.process.splice(index, 1);
        }
      }
    });
    // 当前如果已经存在改订阅配置，则更新订阅信息
    if (configName !== "UNTITLED") {
      await subsStore.fetchFlows(ref([data]).value);
    }
    const type = editType === "collections" ? "collection" : "sub";
    const res = await subsApi.compareSub(type, data);
    if (res?.data?.status === "success") {
      compareData.value = res.data.data;

      scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      globalStore.setSavedPositions(route.path, { left: 0, top: scrollTop });

      document.querySelector("html").style["overflow-y"] = "hidden";
      document.querySelector("html").style.height = "100%";
      document.body.style.height = "100%";
      document.body.style["overflow-y"] = "hidden";
      (document.querySelector("#app") as HTMLElement).style["overflow-y"] =
        "hidden";
      (document.querySelector("#app") as HTMLElement).style.height = "100%";

      compareTableIsVisible.value = true;
      Toast.hide("compare");
    }
  });
};

const passThroughUAOn = computed(() => {
  return form.source === "remote" && form.passThroughUA;
});

const userAgentPlaceholder = computed(() => {
  return passThroughUAOn.value
    ? t(`editorPage.subConfig.basic.ua.placeholderDisabled`)
    : t(`editorPage.subConfig.basic.ua.placeholder`);
});

const handlePassThroughUAChange = (val) => {
  if (val) {
    form._savedUA = form.ua;
    form.ua = "";
  } else {
    if (form._savedUA !== undefined) {
      form.ua = form._savedUA;
      form._savedUA = undefined;
    }
  }
};

const submit = () => {
  if (isget.value) {
    showNotify({
      type: "success",
      title: "拉取订阅中，请勿重复点击...",
    });
    return;
  }
  ruleForm.value.validate().then(async ({ valid, errors }: any) => {
    isget.value = true;
    // 如果验证失败
    if (!valid) {
      isget.value = false;
      Dialog({
        title: t(`editorPage.subConfig.pop.errorTitle`),
        content: errors[0].message,
        popClass: "auto-dialog",
        noCancelBtn: true,
        okText: t(`editorPage.subConfig.pop.errorBtn`),
        // @ts-ignore
        closeOnClickOverlay: true,
      });
      return;
    }
    Toast.loading("拉取订阅中...", {
      id: "submits",
      cover: true,
      duration: 1500,
    });
    // 如果验证成功，开始保存/修改
    const data: any = JSON.parse(JSON.stringify(toRaw(form)));
    data.tag = [
      ...new Set(
        (data.tag || "")
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length)
      ),
    ];
    data.subscriptionTags = [
      ...new Set(
        (data.subscriptionTags || "")
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length)
      ),
    ];
    data["display-name"] = data.displayName;
    data.process = actionsToProcess(data.process, actionsList, ignoreList);
    if (data.ignoreFailedRemoteSub === "disabled"){
      data.ignoreFailedRemoteSub = false;
    }

    console.log('submit.....\n', data);

    let res = null;

    if (configName === "UNTITLED") {
      res = await subsApi.createSub(editType, data);
      await subsStore.fetchSubsData();
      if (data.source === "remote") await initStores(false, true, false);
    } else {
      let apiType = "";
      if (editType === "subs") {
        apiType = "sub";
      } else if (editType === "collections") {
        apiType = "collection";
      }
      res = await subsApi.editSub(apiType, configName, data);

      if (configName === data.name) {
        // @ts-ignore
        await subsStore.updateOneData(editType, configName);
      } else {
        await subsStore.fetchSubsData();
        await useArtifactsStore().fetchArtifactsData();
      }
    }

    if (res?.data?.status === "success") {
      router.replace("/").then(() => {
        if (res)
          showNotify({
            type: "success",
            title: t(`editorPage.subConfig.pop.succeedMsg`),
          });
      });
    }
    isget.value = false;
    Toast.hide("submits");
  });
};

// 名称验证器
const nameValidator = (val: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (val === "UNTITLED") resolve(false);
    if (/\//.test(val)) {
      resolve(false);
    }
    const nameList = [
      ...subsStore.subs.map((item) => item.name),
      ...subsStore.collections.map((item) => item.name),
    ];
    nameList.includes(val) && configName !== val
      ? resolve(false)
      : resolve(true);
  });
};

// url 格式验证器
const urlValidator = (val: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (/\n/.test(val)) {
      resolve(
        val
          .split(/[\r\n]+/)
          .map((i) => i.trim())
          .filter((i) => i.length)
          .every((i) => /^(http|https):\/\/\S+$/.test(i) || /^\/api\/(file|module)\/(.+)/.test(i) || /^\/.+/.test(i))
      );
    } else {
      resolve(/^(http|https):\/\/\S+$/.test(val) || /^\/api\/(file|module)\/(.+)/.test(val) || /^\/.+/.test(val));
    }
  });
};

  // 失去焦点触发验证
  const customerBlurValidate = (prop: string) => {
    ruleForm.value.validate(prop);
  };
  // 去除空格
  const strTrim = (prop: string) => {
    if (typeof form[prop] === "string") {
      // 去除首尾空格
      form[prop] = form[prop].trim();
    }
  }
  // 图标
  const subIcon = computed(() => {
    if (form.icon) {
      return form.icon
    } else {
      return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon
    }
  })
  const iconPopupVisible = ref(false)
  const iconPopupRef = ref(null)
  const showIconPopup = () => {
    iconPopupVisible.value = true
  }
  const setIcon = (icon: any) => {
    form.icon = icon.url
  }
  const iconTips = () => {
    router.push(`/icon/collection`);
  };
  const uaTips = () => {
    Dialog({
        title: '默认使用配置中的全局 UA',
        content: '可尝试设置为 clash-verge/v1.5.1 等客户端的 User-Agent 让机场后端下发更多协议',
        popClass: 'auto-dialog',
        okText: 'OK',
        noCancelBtn: true,
        closeOnPopstate: true,
        lockScroll: false,
      });
  };
  const subUserinfoTips = () => {
    Dialog({
        title: '手动设置订阅流量信息',
        content: '若填写链接, 则使用链接的响应内容作为值.\n\n此项值的格式为:\n\nupload=1024; download=10240; total=102400; expire=4115721600; reset_day=14; plan_name=VIP1; app_url=http://a.com\n\n1. app_url, 订阅将有一个可点击跳转的按钮\n\n2. plan_name, hover 时将显示套餐名称\n\n3. reset_day, 流量重置剩余天数(若要设置周期性重置, 可查看订阅链接中的参数说明)\n\n⚠️ 注意: 手动设置的订阅流量信息会附加到订阅自己的流量信息之前. 若包含不合法的内容, 订阅将无法正常使用\n\n例如: http://官网.com 应编码为 http%3A%2F%2F%E5%AE%98%E7%BD%91.com',
        popClass: 'auto-dialog',
        okText: 'OK',
        noCancelBtn: true,
        closeOnPopstate: true,
        lockScroll: false,
      });
  };
  const proxyTips = () => {
    Dialog({
        title: '通过代理/节点/策略获取订阅',
        content: '1. Surge(参数 policy/policy-descriptor)\n\n可设置节点代理 例: Test = snell, 1.2.3.4, 80, psk=password, version=4\n\n或设置策略/节点 例: 国外加速\n\n2. Loon(参数 node)\n\nLoon 官方文档: \n\n指定该请求使用哪一个节点或者策略组（可以是节点名称、策略组名称，也可以是一个 Loon 格式的节点描述，如：shadowsocksr,example.com,1070,chacha20-ietf,"password",protocol=auth_aes128_sha1,protocol-param=test,obfs=plain,obfs-param=edge.microsoft.com）\n\n3. Stash(参数 headers["X-Surge-Policy"])/Shadowrocket(参数 headers.X-Surge-Policy)/QX(参数 opts.policy)\n\n可设置策略/节点\n\n4. Node.js 版(http/https/socks5):\n\n例: socks5://a:b@127.0.0.1:7890\n\n※ 优先级由高到低: 单条订阅, 组合订阅, 默认配置',
        popClass: 'auto-dialog',
        textAlign: 'left',
        okText: 'OK',
        noCancelBtn: true,
        closeOnPopstate: true,
        lockScroll: false,
      });
  };
  const subscriptionTagsTips = () => {
    Dialog({
        title: '组合订阅与单条订阅',
        content: '组合订阅中将包含\n\n1. 含有关联订阅标签的单条订阅\n\n2. 手动选择的单条订阅\n\n举例: 设置了关联订阅标签为 "A, B" 后\n包含标签 "A" 或 "B" 的单条订阅将自动关联到此组合订阅',
        popClass: 'auto-dialog',
        textAlign: 'left',
        okText: 'OK',
        noCancelBtn: true,
        closeOnPopstate: true,
        lockScroll: false,
      });
  };
  const urlTips = () => {
    Dialog({
        title: t('editorPage.subConfig.basic.url.tips.title'),
        content: t('editorPage.subConfig.basic.url.tips.content'),
        popClass: 'auto-dialog',
        textAlign: 'left',
        okText: 'OK',
        noCancelBtn: true,
        closeOnPopstate: true,
        lockScroll: false,
      });
  };
  const contentTips = () => {
    Dialog({
        title: t('editorPage.subConfig.basic.content.tips.title'),
        content: t('editorPage.subConfig.basic.content.tips.content'),
        popClass: 'auto-dialog',
        textAlign: 'left',
        okText: 'OK',
        noCancelBtn: true,
        closeOnPopstate: true,
        lockScroll: false,
      });
  };
  const setTag = (current) => {
    tag.value = current;
  };
  const shouldShowElement = (element) => {
    if(tag.value === 'all') return true
    if(tag.value === 'untagged') return !Array.isArray(element) || element.length === 0
    return element.includes(tag.value)
  };
  const subCheckboxIndeterminate = ref(true);
  const subCheckbox = ref(true);
  // const subCheckboxChange = (v) => {
  //   console.log(`${!v} -> ${v}`)
  // };
  const subCheckboxClick = () => {
    // 确保 form.subscriptions 存在
    if (!form.subscriptions) {
      form.subscriptions = [];
    }
    // const selected = toRaw(form.subscriptions) || []
    const group = subsSelectList.value.filter(item => shouldShowElement(item[3])).map(item => item[0]) || []
    if (subCheckboxIndeterminate.value) {
      console.log(`半选, 应变为全选`)  
      for (let i = 0; i < group.length; i++) {
        const index = form.subscriptions.indexOf(group[i])
        if (index === -1) {
          form.subscriptions.push(group[i])
        }
      }
    } else if (!subCheckbox.value) {
      console.log(`全选, 应变为不选`)
      // 用遍历与 form.subscriptions.slice 的方式, 去掉 form.subscriptions 中所有被 group 包含的元素
      for (let i = 0; i < group.length; i++) {
        const index = form.subscriptions.indexOf(group[i])
        if (index > -1) {
          form.subscriptions.splice(index, 1)
        }
      }
      // subCheckbox.value = !subCheckbox.value
    } else {
      console.log(`不选, 应变为全选`)
      for (let i = 0; i < group.length; i++) {
        const index = form.subscriptions.indexOf(group[i])
        if (index === -1) {
          form.subscriptions.push(group[i])
        }
      }
      // subCheckbox.value = !subCheckbox.value
    }
    subCheckboxIndeterminate.value = false
  };
  const filteredSubsSelectList = ref([]);

  const updateFilteredSubsList = () => {
    if (subsSelectList.value && subsSelectList.value.length > 0) {
      const filtered = subsSelectList.value.filter(item => shouldShowElement(item[3]));
      
      // 分离已勾选和未勾选的订阅
      const selectedItems = [];
      const unselectedItems = [];
      
      // 确保 form.subscriptions 存在
      if (!form.subscriptions) {
        form.subscriptions = [];
      }
      
      // 优先添加已勾选的订阅
      form.subscriptions.forEach(selectedName => {
        const item = filtered.find(item => item[0] === selectedName);
        if (item) {
          selectedItems.push(item);
        }
      });
      
      // 添加未勾选的订阅
      filtered.forEach(item => {
        if (!form.subscriptions.includes(item[0])) {
          unselectedItems.push(item);
        }
      });
      
      // 合并：已勾选的在前，未勾选的在后
      filteredSubsSelectList.value = [...selectedItems, ...unselectedItems];
    } else {
      filteredSubsSelectList.value = [];
    }
  };
  watch([tag, subsSelectList, () => subsStore.subs], () => {
    updateFilteredSubsList();
  }, { immediate: true, deep: true });
  const isDragging = ref(false);

  const onStartDrag = () => {
    console.log("开始拖拽");
    isDragging.value = true;
  };

  const onEndDrag = () => {
    console.log("结束拖拽");
    isDragging.value = false;
  
    const newFilteredOrder = filteredSubsSelectList.value.map(item => item[0]);
    
    const newSubscriptions = [];
    
    // 确保 form.subscriptions 存在
    if (!form.subscriptions) {
      form.subscriptions = [];
    }
    
    // 先按新顺序添加当前过滤列表中已选中的订阅
    newFilteredOrder.forEach(name => {
      if (form.subscriptions.includes(name)) {
        newSubscriptions.push(name);
      }
    });
    
    // 添加不在当前过滤列表中但已选中的订阅（保持原有顺序）
    form.subscriptions.forEach(name => {
      if (!newFilteredOrder.includes(name)) {
        newSubscriptions.push(name);
      }
    });
    form.subscriptions.splice(0, form.subscriptions.length, ...newSubscriptions);
    console.log("更新后的 form.subscriptions:", form.subscriptions);
  };
  watch([tag, form.subscriptions, subsSelectList], () => {
    const selected = toRaw(form.subscriptions || []) || []
    const group = subsSelectList.value.filter(item => shouldShowElement(item[3])).map(item => item[0]) || []
    // 1. group 中不包含 selected 中的任何元素, subCheckbox 为 false, subCheckboxIndeterminate 为 false
    // 2. group 中包含 selected 中的任意元素, subCheckbox 为 true, subCheckboxIndeterminate 为 true
    // 3. group 中包含 selected 中的所有元素, subCheckbox 为 true, subCheckboxIndeterminate 为 false
    if (group.every(item => selected.includes(item))) {
      // console.log('group 中包含 selected 中的所有元素')
      subCheckbox.value = true
      subCheckboxIndeterminate.value = false
    } else if (group.some(item => selected.includes(item))) {
      // console.log('group 中包含 selected 中的任意元素')
      subCheckbox.value = true
      subCheckboxIndeterminate.value = true
    } else {
      // console.log('group 中不包含 selected 中的任意元素')
      subCheckbox.value = false
      subCheckboxIndeterminate.value = false
    }
  }, { immediate: true });
  // const subCheckboxIndeterminate = computed(() => {
  //   const selected = toRaw(form.subscriptions)
  //   const currentGroup = subsSelectList.value.filter(item => shouldShowElement(item[3])).map(item => item[0])
  //   return true
  // });

const actionBlockRef = ref(null)
const customNameModeFlag = ref(false)
const updateCustomNameModeFlag = (flag) => customNameModeFlag.value = flag
const handleEditGlobalClick = () => {
  if (actionBlockRef.value) {
    if (customNameModeFlag.value) {
      // exit
      actionBlockRef.value.exitAllEditName();
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0 var(--safe-area-side) calc(v-bind("padding") + 63px)
    var(--safe-area-side);

  :deep(.nut-cell-group__warp) {
    border-radius: var(--item-card-radios);
  }
  :deep(.nut-icon-tips:before), :deep(.nut-icon-shop:before) {
    cursor: pointer;
  }
}
.tag-check {
  display: flex;
  justify-content: space-between;
  :deep(.nut-checkbox__label) {
    margin-left: 0;
    margin-right: 0;
  }
}
.radio-wrapper {
  display: flex;
  // justify-content: start;
  flex-wrap: wrap;
  justify-content: flex-end;

  :deep(.nut-radio__button.false) {
    background: var(--divider-color);
    border-color: transparent;
    color: var(--second-text-color);
  }
  :deep(.nut-radio__button) {
    padding: 5px 10px;
  }
}

.form-block-wrapper {
  position: relative;
  .sticky-title-icon-container {
    display: flex;
    justify-content: center;
    .nut-image {
      cursor: pointer;
      width: 70px;
      height: 70px;
      border-radius: 10px;
      overflow: hidden;
      background: transparent;
      padding: 10px;
      :deep(img) {
        width: 100%;
        height: 100%;
        border-radius: 12px;
      }
    }
    .sub-item-customer-icon {
      :deep(img) {
        & {
          opacity: 0.8;
          filter: brightness(var(--img-brightness));
        }
      }
    }
  }
  .button-tips {
    color: var(--primary-color);
    cursor: pointer;
    font-size: 12px;
    text-decoration: underline;
    margin-left: 6px;
  }
  .label-tips {
    display: inline-flex;
    flex-direction: column;
    cursor: pointer;
    .tips {
      display: inline-flex;
      align-items: center;
      span {
        color: var(--primary-color);
        text-decoration: underline;
        font-size: 12px;
        // color: #fa2c19;
      }
    }
  }
  :deep(.nut-input-text){
    .nut-input-inner {
      .nut-input-right-icon {
        margin-left: 8px;
      }
    }
  }
}

.bottom-btn-wrapper {
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px var(--safe-area-side) calc(v-bind("padding") + 8px)
    var(--safe-area-side);
  z-index: 20;
  background: var(--background-color);
  border-top: 1px solid var(--divider-color);
  @include centered-fixed-container;

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

.ignore-failed-wrapper {
  flex-direction: row;
  justify-content: space-between;
  :deep(.nut-form-item__label) {
    width: auto;
  }
  .switch-wrapper {
    display: flex;
    justify-content: flex-end
  }
}

.include-subs-wrapper {
  flex-direction: column;

  .radio-wrapper {
    display: flex;
    justify-content: flex-start;

    // :deep(.nut-radio__button.false) {
    //   background: var(--divider-color);
    //   border-color: transparent;
    //   color: var(--second-text-color);
    // }
    .tag {
      font-size: 12px;
      color: var(--second-text-color);
      margin: 0px 5px 0 0;
      padding: 7.5px 2.5px 4px;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      border-bottom: 1px solid transparent;
    }
    .current {
      border-bottom: 1px solid var(--primary-color);
      color: var(--primary-color);
    }
  }

  :deep(.nut-form-item__label) {
    width: 100%;
    font-size: 12px;
    // margin-bottom: 12px;
  }

  .subs-checkbox-wrapper {
    flex-direction: row-reverse;

    .subs-checkbox {
      justify-content: space-between;
      // margin-left: 16px;
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
        position: relative;
        .icon {
          margin-right: 8px;
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

        .sub-item {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin: -4px 0 0 -4px;
          .name {
            margin: 4px 0 0 4px;
          }
          .tag {
            margin: 4px 0 0 4px;
            // white-space: nowrap;
          }
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
        .drag-handle {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--second-text-color);
          font-size: 16px;
          padding: 10px;
        }
      }
    }
  }
}
</style>
