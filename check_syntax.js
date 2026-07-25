import fs from 'fs';
import ts from 'typescript';

const fileContent = fs.readFileSync('src/utils/mysticCalendarData.ts', 'utf8');

const sourceFile = ts.createSourceFile(
  'mysticCalendarData.ts',
  fileContent,
  ts.ScriptTarget.Latest,
  true
);

const diagnostics = sourceFile.parseDiagnostics;
console.log('Diagnostic count:', diagnostics.length);
for (const diag of diagnostics) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
  console.log(`Line ${line + 1}, Char ${character + 1}: ${diag.messageText}`);
}
