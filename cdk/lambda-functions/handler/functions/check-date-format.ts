export const checkDateFormat = (startDate: string | undefined) => {
  if (!startDate) throw new Error('startDate is not exist, please check the environment variable');
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(startDate)) throw new Error('startDate format is not correct');
  return startDate;
};
