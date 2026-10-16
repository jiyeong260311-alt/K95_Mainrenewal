import {spawnSync} from 'node:child_process';
const checks=[['Lint','eslint/bin/eslint.js'],['TypeScript','typescript/bin/tsc','--noEmit'],['Production build','next/dist/bin/next','build']];
for(const [name,entry,...args] of checks){
  console.log(`\n${name}`);
  const result=spawnSync(process.execPath,[`node_modules/${entry}`,...args],{stdio:'inherit',env:process.env});
  if(result.status!==0)process.exit(result.status||1);
}
