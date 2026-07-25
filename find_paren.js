import fs from 'fs';

const content = fs.readFileSync('src/utils/mysticCalendarData.ts', 'utf8');
const lines = content.split('\n');

let parenStack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Simple scan for parentheses, ignoring strings if possible or basic
  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    if (ch === '(') {
      parenStack.push({ line: i + 1, col: j + 1 });
    } else if (ch === ')') {
      if (parenStack.length > 0) {
        parenStack.pop();
      } else {
        console.log(`Unmatched closing paren at line ${i + 1}, col ${j + 1}`);
      }
    }
  }
}

console.log('Unclosed parens count:', parenStack.length);
if (parenStack.length > 0) {
  console.log('Top 5 unclosed parens:', parenStack.slice(-5));
}
