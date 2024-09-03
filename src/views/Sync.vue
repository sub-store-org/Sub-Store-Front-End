<template>
  <div
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    style="overflow: hidden"
  >
    <Teleport to="body">
      <div class="drag-btn-wrapper" v-if="artifacts.length > 0">
        <nut-drag
          :attract="true"
          :boundary="{
            top: 56 + 8,
            left: 16,
            bottom: bottomSafeArea + 48 + 12 + 8,
            right: 16,
          }"
          :style="{
            cursor: 'pointer',
            right: '16px',
            bottom: `${
              bottomSafeArea +
              48 +
              36 +
              (!isMobile() ? (appearanceSetting.isSimpleMode ? 44 : 48) : 0)
            }px`,
          }"
        >
          <div
            class="drag-btn"
            @touchmove="onTa"
            @touchend="enTa"
            @click="onclickAddArtifact"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
          </div>
        </nut-drag>
      </div>
    </Teleport>

    <ArtifactPanel
      v-if="isEditPanelVisible"
      :name="editTargetName"
      @close="closeArtifactPanel"
    />

    <!--有数据-->
    <div v-if="artifacts.length > 0" class="subs-list-wrapper">
      <div class="sticky-title-wrapper sync-title">
        <p class="list-title">{{ $t(`syncPage.title`) }}</p>
        <div class="actions-wrapper">
          <nut-button
            class="upload-all-btn btn"
            type="info"
            plain
            :disabled="uploadAllIsDisabled"
            size="small"
            :loading="uploadAllIsLoading"
            @click="uploadAll"
          >
            <font-awesome-icon
              icon="fa-solid fa-cloud-arrow-up"
              v-if="!uploadAllIsLoading"
            />
          </nut-button>
          <nut-button
            v-if="syncPlatform !== 'gitlab'"
            class="upload-all-btn btn"
            type="info"
            plain
            size="small"
            :loading="downloadAllIsLoading"
            @click="downloadAll"
          >
            <font-awesome-icon
              icon="fa-solid fa-cloud-arrow-down"
              v-if="!downloadAllIsLoading"
            />
          </nut-button>
          <nut-button
            class="preview-btn btn"
            type="info"
            plain
            size="small"
            @click="preview"
          >
            <font-awesome-icon icon="fa-solid fa-eye" />
          </nut-button>
        </div>
      </div>

      <draggable
        v-model="artifacts"
        @change="changeArtifacts"
        @start="handleDragStart"
        @end="handleDragEnd"
        itemKey="name"
        :scroll-sensitivity="200"
        :force-fallback="true"
        :scrollSpeed="8"
        :scroll="true"
        v-bind="{
          animation: 200,
          disabled: false,
          delay: 200,
          chosenClass: 'chosensub',
          handle: 'div',
        }"
      >
        <template #item="{ element }">
          <div :key="element.name" class="draggable-itemsync">
            <ArtifactsListItem
              :name="element.name"
              @edit="onClickEdit"
              :disabled="swipeDisabled"
              Í
            />
          </div>
        </template>
      </draggable>
    </div>
    <div v-else class="subs-list-wrapper">
      <div class="sticky-title-wrapper sync-title">
        <p class="list-title">{{ $t(`syncPage.title`) }}</p>
        <div class="actions-wrapper">
          <nut-button
            class="upload-all-btn btn"
            type="info"
            plain
            size="small"
            :loading="downloadAllIsLoading"
            @click="downloadAll"
          >
            <font-awesome-icon
              icon="fa-solid fa-cloud-arrow-down"
              v-if="!downloadAllIsLoading"
            />
          </nut-button>
          <nut-button
            class="preview-btn btn"
            type="info"
            plain
            size="small"
            @click="preview"
          >
            <font-awesome-icon icon="fa-solid fa-eye" />
          </nut-button>
        </div>
      </div>
    </div>

    <!--没有数据-->
    <div
      v-if="!isLoading && fetchResult && artifacts.length === 0"
      class="no-data-wrapper"
    >
      <nut-empty image="empty">
        <template #description>
          <h3>{{ $t(`syncPage.emptySub.title`) }}</h3>
          <p>{{ $t(`syncPage.emptySub.desc`) }}</p>
        </template>
      </nut-empty>
      <nut-button @click="onclickAddArtifact" type="primary">
        {{ $t(`syncPage.emptySub.btn`) }}
      </nut-button>
    </div>

    <!--数据加载失败-->
    <div v-if="!isLoading && !fetchResult" class="no-data-wrapper">
      <nut-empty image="error" style="padding: 32px 30px">
        <template #description>
          <h3>{{ $t(`subPage.loadFailed.title`) }}</h3>
          <p>{{ $t(`subPage.loadFailed.desc`) }}</p>
          <p>{{ $t(`subPage.loadFailed.followOfficialChannel`) }}</p>
          <p>
            {{ $t(`subPage.loadFailed.officialChannel`) }}
            <a
              href="https://t.me/cool_scripts"
              style="color: var(--primary-color)"
            >
              Cool Scripts
            </a>
          </p>
        </template>
      </nut-empty>
      <nut-button icon="refresh" type="primary" @click="refresh">
        {{ $t(`subPage.loadFailed.btn`) }}
      </nut-button>
      <a
        href="https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46"
        target="_blank"
      >
        <span>{{ $t(`subPage.loadFailed.doc`) }}</span>
        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ArtifactsListItem from "@/components/ArtifactsListItem.vue";
import { useArtifactsStore } from "@/store/artifacts";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/store/global";
import { ref, computed, toRaw } from "vue";
import { initStores } from "@/utils/initApp";
import { useSettingsStore } from "@/store/settings";
// import { useI18n } from 'vue-i18n';
import ArtifactPanel from "@/components/ArtifactPanel.vue";
import draggable from "vuedraggable";
import { useSubsApi } from "@/api/subs";
import { useI18n } from "vue-i18n";
import { useAppNotifyStore } from "@/store/appNotify";
import { useBackend } from "@/hooks/useBackend";
import { Dialog } from "@nutui/nutui";
import { isMobile } from "@/utils/isMobile";

const { env } = useBackend();
const subsApi = useSubsApi();
// const { t } = useI18n();
const globalStore = useGlobalStore();
const artifactsStore = useArtifactsStore();
const settingsStore = useSettingsStore();
const {
  // isSimpleMode,
  isLoading,
  fetchResult,
  bottomSafeArea,
  // showFloatingRefreshButton,
} = storeToRefs(globalStore);
const { artifacts } = storeToRefs(artifactsStore);
const {
  appearanceSetting,
  artifactStore: artifactStoreUrl,
  artifactStoreStatus,
  syncPlatform,
} = storeToRefs(settingsStore);
const { showNotify } = useAppNotifyStore();
const swipeDisabled = ref(false);
const isEditPanelVisible = ref(false);
const sortFailed = ref(false);
const editTargetName = ref("");
const touchStartY = ref(null);
const touchStartX = ref(null);
const { t } = useI18n();

const onTouchStart = (event: TouchEvent) => {
  touchStartY.value = Math.abs(event.touches[0].clientY);
  touchStartX.value = Math.abs(event.touches[0].clientX);
};

const onTouchMove = (event: TouchEvent) => {
  const deltaY = Math.abs(event.changedTouches[0].clientY - touchStartY.value);
  const deltaX = Math.abs(event.changedTouches[0].clientX - touchStartX.value);

  const isScrollingUp = deltaX > 2;
  const isScrollingUps = deltaY < 10;

  if (isScrollingUp && isScrollingUps) {
    event.preventDefault();
  }
};

const onTouchEnd = () => {
  touchStartY.value = null;
  touchStartX.value = null;
};

const uploadAllIsDisabled = computed(() => {
  return artifacts.value.length === 0;
});
const uploadAllIsLoading = ref(false);
const uploadAll = async () => {
  uploadAllIsLoading.value = true;
  await artifactsStore.syncAllArtifact();
  await settingsStore.fetchSettings();
  uploadAllIsLoading.value = false;
};
const downloadAllIsLoading = ref(false);
const downloadAll = async () => {
  downloadAllIsLoading.value = true;
  Dialog({
    popClass: "auto-dialog",
    title: t(`syncPage.preview.title`),
    content: artifactStoreUrl.value
      ? `${t("syncPage.download.content")}\n\n${t("syncPage.preview.content", {
          status: artifactStoreStatus.value || "VALID",
        })}\n${t("syncPage.preview.url")}`
      : `${t("syncPage.download.content")}\n\n${t("syncPage.preview.content", {
          status: artifactStoreStatus.value || "-",
        })}\n${t("syncPage.preview.noUrl")}`,
    noOkBtn: !artifactStoreUrl.value,
    okText: t(`syncPage.download.confirm`),
    cancelText: t(`syncPage.preview.cancel`),
    // @ts-ignore
    closeOnClickOverlay: true,
    onOk: async () => {
      try {
        await artifactsStore.restoreArtifacts();
      } catch (e) {
        showNotify({
          title: t("myPage.notify.restore.failed"),
          type: "danger",
          content: `${e.message ?? e}`,
        });
      } finally {
        downloadAllIsLoading.value = false;
      }
    },
    onCancel: async () => {
      downloadAllIsLoading.value = false;
    },
  });
};

const refresh = () => {
  initStores(true, true, false);
};

const preview = () => {
  if (
    artifactStoreUrl.value &&
    (!artifactStoreStatus.value || artifactStoreStatus.value === "VALID")
  ) {
    window.open(artifactStoreUrl.value);
  } else {
    Dialog({
      popClass: "auto-dialog",
      title: t(`syncPage.preview.title`),
      content: artifactStoreUrl.value
        ? `${t("syncPage.preview.content", {
            status: artifactStoreStatus.value || "VALID",
          })}\n${t("syncPage.preview.url")}`
        : `${t("syncPage.preview.content", {
            status: artifactStoreStatus.value || "-",
          })}\n${t("syncPage.preview.noUrl")}`,
      noOkBtn: !artifactStoreUrl.value,
      okText: t(`syncPage.preview.confirm`),
      cancelText: t(`syncPage.preview.cancel`),
      // @ts-ignore
      closeOnClickOverlay: true,
      onOk: () => {
        window.open(artifactStoreUrl.value);
      },
    });
  }
};

const onClickEdit = (artifact: Artifact) => {
  editTargetName.value = artifact.name;
  isEditPanelVisible.value = true;
};

const as = ref(false);

const onTa = () => {
  as.value = true;
};

const enTa = () => {
  setTimeout(() => {
    as.value = false;
  }, 100);
};

const onclickAddArtifact = () => {
  if (as.value) return;
  isEditPanelVisible.value = true;
};

const closeArtifactPanel = () => {
  editTargetName.value = "";
  isEditPanelVisible.value = false;
};

// const sortArtifacts = (newCollections: any) => {
//   artifacts.value = newCollections;
// };
let dragData = null;
const changeArtifacts = async () => {
  try {
    let sortArtifacts: any;
    if (env.value.version > "2.14.48") {
      console.log("new sort > v2.14.48");
      const nameSortArray = artifacts.value.map((k) => k.name);
      // console.log(nameSortArray);
      sortArtifacts = await subsApi.newSortSub(
        "artifacts",
        JSON.parse(JSON.stringify(toRaw(nameSortArray)))
      );
      // console.log(JSON.stringify(sortArtifacts));
    } else {
      console.log("old sort < v2.14.48");
      sortArtifacts = await subsApi.sortSub(
        "artifacts",
        JSON.parse(JSON.stringify(toRaw(artifacts.value)))
      );
    }
    if (sortArtifacts?.data?.status !== "success") {
      sortFailed.value = true;
      showNotify({
        title: t("notify.sortsub.failed"),
        type: "danger",
        content: JSON.stringify(sortArtifacts),
      });
    }
  } catch (error) {
    sortFailed.value = true;
  }
};

const handleDragStart = () => {
  dragData = artifacts.value;
  swipeDisabled.value = true;
};

const handleDragEnd = () => {
  console.log("禁用禁止拖动");
  if (sortFailed.value) {
    artifacts.value = dragData;
  } else {
    dragData = null;
  }
  swipeDisabled.value = false;
};
</script>

<style lang="scss" scoped>
.sync-title {
  display: flex;
  justify-content: space-between;
  // align-items: center;

  .actions-wrapper {
    margin-right: 16px;

    .btn:not(:last-child) {
      margin-right: 8px;
    }
  }
}

.upload-all-btn,
.preview-btn {
  color: var(--comment-text-color) !important;
  border: none;
  background: none;
  width: 44px;

  :deep(view) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.draggable-itemsync {
  margin-top: 4px;
  margin-bottom: 12px;
  // overflow: hidden;
}
</style>
