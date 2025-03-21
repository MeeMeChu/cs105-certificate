export const truncateText = (text: string, length: number = 100) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};