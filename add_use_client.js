/* eslint-disable @typescript-eslint/no-require-imports */
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
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const dirs = ['d:/NewNader/Foody/foodynextjs/src/features', 'd:/NewNader/Foody/foodynextjs/src/components/shared'];

dirs.forEach(dir => {
  const files = walk(dir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      fs.writeFileSync(file, '"use client";\n' + content, 'utf8');
    }
  });
});
console.log('Added use client to all features and shared components.');
