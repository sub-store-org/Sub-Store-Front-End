export const actionsToProcess = (
  process: Process[],
  actionsList: ActionModuleProps[],
  ignoreList: string[],
): Process[] => {
  const findProcess = (id: string) => process.find((item) => item.id === id);
  const newProcess = process.filter((item) => {
    if (ignoreList.includes(item.type)) return item;
  });

  actionsList.forEach((item) => {
    newProcess.push({
      type: item.type,
      args: findProcess(item.id).args,
      customName: findProcess(item.id).customName,
      id: item.id,
      disabled: !item.enabled,
    });
  });
  return newProcess;
};
