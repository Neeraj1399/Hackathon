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
  if (!curr.includes('[%]')) return; 

  let orig = '';
  try {
    orig = execSync(`git show HEAD:${file.replace(/\\/g, '/')}`, { encoding: 'utf8' });
  } catch(e) { }

  let matches = [...curr.matchAll(/(gap|space-[xy])-\[%\]/g)];
  if(matches.length === 0) return;
  
  let newCurr = curr;
  let offset = 0; 
  
  for(let m of matches) {
      let type = m[1]; 
      let index = m.index;
      let pre = curr.substring(Math.max(0, index - 30), index);
      let suf = curr.substring(index + m[0].length, Math.min(curr.length, index + m[0].length + 30));
      
      let preSafe = pre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
      let sufSafe = suf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
      
      let searchPat = new RegExp(preSafe + type + '-(\\d+)' + sufSafe);
      let found = orig ? orig.match(searchPat) : null;
      
      let replacement = '';
      if(found) {
          replacement = type + '-' + found[1];
      } else {
          // manually check context
          if(pre.includes('DateTimeInput') || suf.includes('DateTimeInput')) {
              if (suf.includes('flex items-center')) replacement = type+'-2'; // outer wrapper
              else replacement = type+'-2'; 
          }
          // The confirmation toasts
          else if(pre.includes('Deprovision this user') || pre.includes('Strike this announcement')) {
             if (suf.includes('flex justify-end gap-2')) replacement = type+'-3'; // outer toast wrapper
             else replacement = type+'-2'; 
          }
          else replacement = type + '-4'; // default fallback 4
      }
      
      let cIdx = newCurr.indexOf(m[0], offset);
      if(cIdx !== -1) {
          newCurr = newCurr.substring(0, cIdx) + replacement + newCurr.substring(cIdx + m[0].length);
          offset = cIdx + replacement.length;
      }
  }
  
  fs.writeFileSync(file, newCurr);
  console.log(`Recovered ${file}`);
});
