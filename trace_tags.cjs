const fs = require('fs');

const code = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');
const lines = code.split('\n');

// We parse lines 2740 to 2830
const tags = [];
for (let i = 2742; i < 2830; i++) {
  const line = lines[i];
  if (!line) continue;
  
  // Find tags like <div ...>, </div >, <AnimatePresence ...>, etc. using a simple regex
  const regex = /<\/?([a-zA-Z0-9\.]+)(?:\s+[^>]*?)?(\/?)>/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || match[2] === '/';
    
    if (isSelfClosing) {
      console.log(`[Line ${i + 1}] Self-closing tag: ${fullTag}`);
    } else if (isClosing) {
      console.log(`[Line ${i + 1}] Closing tag: ${fullTag}`);
      if (tags.length > 0 && tags[tags.length - 1].name === tagName) {
        tags.pop();
      } else {
        console.log(`  WARNING: mismatched close tag ${fullTag}, expected </${tags[tags.length - 1]?.name}>`);
      }
    } else {
      console.log(`[Line ${i + 1}] Opening tag: ${fullTag}`);
      tags.push({ name: tagName, line: i + 1 });
    }
  }
}

console.log("\nCurrently open tags at the end of scan:");
for (const t of tags) {
  console.log(`- <${t.name}> opened at line ${t.line}`);
}
