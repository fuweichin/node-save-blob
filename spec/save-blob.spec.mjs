import {existsSync, statSync} from 'node:fs';
import {saveBlob} from '../lib/node-save-blob.js';

describe('node-save-blob', () => {
  it('saveBlob', async () => {
    let blob = new Blob(['Hello'], {type: 'text/plain'});
    let filePath = await saveBlob(blob, 'test.txt');
    console.log('Saved file as ' + filePath);
    expect(existsSync(filePath)).toBe(true);
    expect(statSync(filePath).size).toBe(blob.size);
  });
});
