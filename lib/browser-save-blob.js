/**
 * @param {Blob} blob 
 * @param {string} [fileName] - suggested file name
 * @returns {boolean} - true is returned as long as the notification bar is displayed, or false if a failure occurred.
 */
export function saveBlob(blob, fileName = null) {
  if (!(blob instanceof Blob))
    throw new TypeError('Invalid argument blob');
  let name = (fileName ? String(fileName) : blob.name) || blob.type.replace('/', '.') || 'download';
  let url;
  try {
    url = URL.createObjectURL(blob);
  } catch (e) {
    try {
      url = URL.createObjectURL(new Blob([blob], {type: 'application/octet-stream'}));
    } catch (e) {
      // noop
    }
  }
  if (!url) 
    return false;
  let a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 200);
  return true;
}
  
