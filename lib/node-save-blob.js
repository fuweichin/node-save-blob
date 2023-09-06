import fs from 'node:fs';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import {getFolderPath, SpecialFolder, SpecialFolderOption} from 'special-folders';

/**
 * @async
 * @param {Blob} blob 
 * @param {string} [suggestedName]
 * @returns {Promise<string>} path where the blob will have been saved
 */
export async function saveBlob(blob, suggestedName = null) {
  let dirPath = getFolderPath(SpecialFolder.Downloads, SpecialFolderOption.Create); // get path of Downloads folder
  if (!dirPath)
    throw new Error('Cannot get path of the downloads folder');
  // determine file name
  let name = (suggestedName ? String(suggestedName) : blob.name) || blob.type.replace('/', '.') || 'download'; // use fallback file name as needed
  name = name.replace(/[\\/|:*?<>"]/g, '_'); // replace invalid characters
  let ext = path.extname(name);
  let base = path.basename(name, ext);
  if (/^(CON|PRN|AUX|NUL|COM\d|LPT\d)$/i.test(base)) { // replace reserved names
    base += '_';
    name = base + ext;
  }
  if (name.length > 250) { // check filename length
    name = name.slice(0, -250);
    ext = path.extname(name);
    base = path.basename(name, ext);
  }
  // write data
  if (blob.size < 2 * 1024 * 1024) {
    let filePath = path.join(dirPath, getNextAvailableName(name, dirPath));
    let buffer = new Uint8Array(await blob.arrayBuffer());
    await writeFile(filePath, buffer);
    return filePath;
  } else {
    let filePath;
    let writeStream;
    try {
      let tempFilePath = getNextAvailableName(name + '.partial', dirPath); // // write to a .partial file firstly
      writeStream = fs.createWriteStream(tempFilePath);
      let reader = blob.stream().getReader();
      let canWrite = true;
      let p;
      for (let {value: chunk, done} = await reader.read(); !done; ({value: chunk, done} = await reader.read())) {
        p = new Promise((resolve, reject) => {
          canWrite = writeStream.write(chunk, (err) => { err ? reject(err) : resolve(); });
        });
        if (!canWrite)
          await p;
      }
      await p;
      await new Promise((resolve, reject) => {
        writeStream.close((err) => { err ? reject(err) : resolve(); });
      });
      filePath = path.join(dirPath, getNextAvailableName(name, dirPath));
      fs.renameSync(tempFilePath, filePath);
    } catch (e) {
      if (writeStream) {
        await new Promise((resolve, reject) => {
          writeStream.close((err) => { err ? reject(err) : resolve(); });
        });
      }
      throw e;
    }
    return filePath;
  }
}

function getNextAvailableName(initialName, dirPath) {
  let name = initialName;
  let ext = path.extname(name);
  let base = path.basename(name, ext);
  for (let index = 1, filePath = path.join(dirPath, name); fs.existsSync(filePath); index++) {
    name = base + ' (' + index + ')' + ext;
    filePath = path.join(dirPath, name);
  }
  return name;
}
