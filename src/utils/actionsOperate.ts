import { shallowRef, nextTick } from 'vue';
import ActionRadio from '@/views/editor/components/ActionRadio.vue';

export const addItem = (
  form,
  actionsList,
  actionsChecked,
  selectedOptions,
  t
) => {
  const id = Math.random() * 100000000 + '';
  const type = selectedOptions[0].value;
  const obj = {
    id,
    type,
    tipsDes: t(`editorPage.subConfig.nodeActions['${type}'].tipsDes`),
    component: null,
  };
  actionsChecked.push([id, true]);

  switch (type) {
    case 'Flag Operator':
    case 'Sort Operator':
    case 'Resolve Domain Operator':
      obj.component = shallowRef(ActionRadio);
      break;
  }
  form.process.push({ id, type, args: null });
  actionsList.push(obj);

  // 添加后将页面置底
  nextTick(() => {
    const container = document.querySelector('.app-layout-wrapper');
    console.log(container.scrollHeight);
    console.log(container.scrollTop + container.clientHeight);
    container.scrollTo({
      top: container.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  });
};

export const deleteItem = (form, actionsList, actionsChecked, id) => {
  const processIndex = form.process.findIndex((item) => item.id === id);
  const actionsIndex = actionsList.findIndex((item) => item.id === id);
  const checkedIndex = actionsChecked.findIndex((item) => item[0] === id);
  form.process.splice(processIndex, 1);
  actionsList.splice(actionsIndex, 1);
  actionsChecked.splice(checkedIndex, 1);
};
