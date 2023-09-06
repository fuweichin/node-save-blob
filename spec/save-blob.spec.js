import {saveBlob} from '../lib/browser-save-blob.js';

describe('node-save-blob', () => {
  it('saveBlob', async () => {
    let blob = new Blob(['Hello'], {type: 'text/plain'});
    let started = saveBlob(blob, 'test.txt');
    expect(started).toBe(true);
  });
});
