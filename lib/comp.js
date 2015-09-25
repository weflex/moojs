
'use strict';

function comp (prev, next) {
  const prevIdx = index(prev);  // return as a Map
  const result = {
    addition: [],
    deletion: [],
    modified: []
  };
  for (let i = 0; i < next.length; i++) {
    const item = next[i];
    if (!item) continue
    const key = item[0];
    const val = JSON.stringify(item[1]);
    if (prevIdx.has(key)) {
      if (JSON.stringify(prevIdx.get(key)) !== val) {
        result.modified.push({
          key: key, val: item[1]
        });
      }
      // delete processed item
      prevIdx.delete(key);
    } else {
      result.addition.push({
        key: key, val: item[1]
      });
    }
  }
  if (prevIdx.size === 0) {
    return result;
  } else {
    prevIdx.forEach(function (val, key) {
      result.deletion.push({
        key: key, val: val
      });
    });
    return result;
  }
}

function index (arr) {
  const ret = new Map();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item) {
      const key = item[0];
      const val = item[1];
      ret.set(key, val);
    }
  }
  return ret;
}

function summary (result, older, ref, repo) {
  let text = '\nThe following are interface summary:\n';
  const refUrl = repo + '/tree/' + ref;
  const olderUrl = repo + '/tree/' + older;
  result.addition.forEach(function (item) {
    text += `+ [${ref}](${refUrl}) has added the remote method: \`${item.key}\``;
    text += '\n';
  });
  result.deletion.forEach(function (item) {
    text += `+ [${ref}](${refUrl}) has removed the remote method: \`${item.key}\``;
    text += `from [${older}](${olderUrl})\n`;
  });
  result.modified.forEach(function (item) {
    text += `+ [${ref}](${refUrl}) has modified the remote method: \`${item.key}\``;
    text += `from [${older}](${olderUrl})\n`;
  });
  return text
}

exports.comp = comp;
exports.index = index;
exports.summary = summary;
