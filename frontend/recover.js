const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let curr = fs.readFileSync(file, 'utf8');
  if (!curr.includes('[%]')) return; // No corrupted gaps

  // Get orig from HEAD
  let orig = '';
  try {
    orig = execSync(`git show HEAD:${file.replace(/\\/g, '/')}`, { encoding: 'utf8' });
  } catch(e) { 
    return; // didn't exist in HEAD
  }

  // Find all gap-[%], space-y-[%], space-x-[%] using a loop over the string
  const regex = /(gap-\[%\],?|space-[xy]-\[%\],?|gap-\[%\]|space-[xy]-\[%\])/g;
  let matches = [...curr.matchAll(/(gap|space-[xy])-\[%\]/g)];
  
  if(matches.length === 0) return;
  
  let newCurr = curr;
  let offset = 0; // because we modify newCurr as we go
  
  const origRegex = /(gap|space-[xy])-(\d+)/g;
  let origMatches = [...orig.matchAll(origRegex)];
  
  // A simple heuristic: take 30 chars before and 30 chars after the match from curr.
  for(let m of matches) {
      let type = m[1]; // gap, space-y, space-x
      let index = m.index;
      let pre = curr.substring(Math.max(0, index - 20), index);
      let suf = curr.substring(index + m[0].length, Math.min(curr.length, index + m[0].length + 20));
      
      // Clean up pre and suf to be safe for regex (escape special chars)
      let preSafe = pre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
      let sufSafe = suf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
      
      // Look in orig
      // Pattern: preSafe + type + "-\d+" + sufSafe
      let searchPat = new RegExp(preSafe + type + '-(\\d+)' + sufSafe);
      let found = orig.match(searchPat);
      
      let replacement = '';
      if(found) {
          replacement = type + '-' + found[1];
      } else {
          // Unmatched. This is highly likely the newly added components today:
          // DateTimeInput components added gap-2, pr-3.
          // The confirmation toasts added gap-3, gap-2.
          if(type === 'gap') {
             // Fallback to gap-2 if it's new
             // actually we can check pre/suf context manually
             if(pre.includes('DateTimeInput') || pre.includes('flex items-center')) replacement = 'gap-2';
             else if(suf.includes('Cancel') || suf.includes('Confirm')) replacement = 'gap-2';
             else if(pre.includes('flex flex-col') && suf.includes('p-1 text-sm')) replacement = 'gap-3';
             else replacement = type + '-4'; // default fallback 4
          } else {
             replacement = type + '-4';
          }
      }
      
      // Replace only this exact occurrence by constructing string
      let cIdx = newCurr.indexOf(m[0], offset);
      if(cIdx !== -1) {
          newCurr = newCurr.substring(0, cIdx) + replacement + newCurr.substring(cIdx + m[0].length);
          offset = cIdx + replacement.length;
      }
  }
  
  fs.writeFileSync(file, newCurr);
  console.log(`Recovered ${file}`);
});
