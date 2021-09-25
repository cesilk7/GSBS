
export const timeFormatChange = (dateString: string) => {
  const date = new Date(dateString);
  const HH = ('0' + date.getHours()).slice(-2);
  const MM = ('0' + date.getMinutes()).slice(-2);
  return `${HH}:${MM}`;
};

export const dateFormatChange = (dateString: string) => {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const DD = date.getDate();
  return `${yyyy}-${mm}-${DD}`;
};