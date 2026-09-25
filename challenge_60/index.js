const uuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const id = "fb9d1bfb-b80e-4c57-a6fc-6fbccd232676";

const sanitizeFolder = (folder) => {
  folder = String(folder)
    .replaceAll(';', '')
    .replaceAll('|', '')
    .replaceAll('&', '')
    .replaceAll('>', '')
    .replaceAll('<', '')
    .replaceAll('!', '')
    .replaceAll('$', '') 
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('', '')
    .replaceAll('', '');

  if (!folder.endsWith('/assets')) {
    folder += '/assets';
  }
  return folder.replace('//', '/');
};

const folder = "../../../a$assets$ets/../";
console.log({
  sanitized: sanitizeFolder(folder)
});