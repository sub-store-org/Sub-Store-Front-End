type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB';

const flowTransfer = (flow: number, unit: Unit) => {
  const unitList: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let unitIndex = unitList.indexOf(unit);

  return flow < 1024
    ? { value: flow.toFixed(1), unit: unit }
    : flowTransfer(flow / 1024, unitList[++unitIndex]);
};

export const getString = (current: number, total: number, unit: Unit) => {
  const currT = flowTransfer(Math.abs(current), unit);
  currT.value = current < 0 ? '-' + currT.value : currT.value;
  const totalT = flowTransfer(total, unit);
  return `${currT.value} ${currT.unit} / ${totalT.value} ${totalT.unit}`;
};
