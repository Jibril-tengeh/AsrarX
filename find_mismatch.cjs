const fs = require('fs');

const code = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');
const lines = code.split('\n');

const startLine = 2742; // ) : (
const endLine = 4731;   // )}

let inSingleLineComment = false;
let inMultiLineComment = false;
let inString = null; // '"', "'", or '`'

const bracesStack = [];
const parensStack = [];

for (let i = startLine - 1; i < endLine; i++) {
  const line = lines[i];
  if (line === undefined) continue;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    const nextChar = line[j + 1];
    
    // Handle multi-line comments
    if (inMultiLineComment) {
      if (char === '*' && nextChar === '/') {
        inMultiLineComment = false;
        j++;
      }
      continue;
    }
    
    // Handle single-line comments
    if (inSingleLineComment) {
      // resets at end of line, handled below
      continue;
    }
    
    // Handle string literals
    if (inString) {
      if (char === '\\') {
        j++; // skip escaped char
      } else if (char === inString) {
        inString = null;
      }
      continue;
    }
    
    // Check for comment starts
    if (char === '/' && nextChar === '/') {
      inSingleLineComment = true;
      j++;
      continue;
    }
    if (char === '/' && nextChar === '*') {
      inMultiLineComment = true;
      j++;
      continue;
    }
    
    // Check for string starts
    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }
    
    // Track braces and parentheses
    if (char === '{') {
      bracesStack.push({ line: i + 1, col: j + 1 });
    } else if (char === '}') {
      if (bracesStack.length === 0) {
        console.log(`Unmatched '}' at line ${i + 1}, col ${j + 1}`);
      } else {
        bracesStack.pop();
      }
    } else if (char === '(') {
      parensStack.push({ line: i + 1, col: j + 1 });
    } else if (char === ')') {
      if (parensStack.length === 0) {
        console.log(`Unmatched ')' at line ${i + 1}, col ${j + 1}`);
      } else {
        parensStack.pop();
      }
    }
  }
  
  inSingleLineComment = false; // single line comment ends at newline
}

console.log(`\nScan complete for lines ${startLine} to ${endLine}:`);
console.log(`Unclosed '{' count: ${bracesStack.length}`);
if (bracesStack.length > 0) {
  console.log("Unclosed '{' locations:");
  for (const b of bracesStack) {
    console.log(`  - Line ${b.line}, col ${b.col}`);
  }
}

console.log(`Unclosed '(' count: ${parensStack.length}`);
if (parensStack.length > 0) {
  console.log("Unclosed '(' locations:");
  for (const p of parensStack) {
    console.log(`  - Line ${p.line}, col ${p.col}`);
  }
}
