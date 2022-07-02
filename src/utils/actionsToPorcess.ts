export const actionsToProcess = (
  process: Process[],
  actionsList: ActionModuleProps[],
  ignoreList: string[]
): Process[] => {
  const getArgs = (id: string) => process.find((item) => item.id === id).args;

  const newProcess = process.filter((item) => {
    if (ignoreList.includes(item.type)) return item;
  });

  actionsList.forEach((item) => {
    newProcess.push({
      type: item.type,
      args: getArgs(item.id),
      id: item.id,
    });
  });
  return newProcess;
};
