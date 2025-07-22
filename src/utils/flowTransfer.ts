type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB';

const flowTransfer = (flow: number, unit: Unit) => {
  const unitList: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let unitIndex = unitList.indexOf(unit);
  return (flow < 1024 || unitIndex === unitList.length - 1)
    ? { value: (Math.round(flow * 100) / 100).toString(), unit: unit }
    : flowTransfer(flow / 1024, unitList[++unitIndex]);
};

export const getString = (current: number, total: number, unit: Unit) => {
  const currT = flowTransfer(Math.abs(current), unit);
  currT.value = current < 0 ? '-' + currT.value : currT.value;
  const totalT = flowTransfer(total, unit);
  return `${currT.value} ${currT.unit} / ${totalT.value} ${totalT.unit}`;
};
