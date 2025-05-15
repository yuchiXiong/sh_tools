#!/usr/bin/env node

/**
 * pgc: git push origin current branch
 */
const { exec } = require('child_process');

exec('git push origin HEAD', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});
