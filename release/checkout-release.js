/**
 * take stock of changes
 * tell slack of changed files
 * stash
 * git checkout release
 */
 const { exec } = require('child_process')
 const { Octokit } = require('octokit')
 
 function fetchRelease() {
   const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
   return octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
     owner: 'meljameson',
     repo: 'test-gha'
   })
 }
 
 function execGitCmd(cmd) {
     return new Promise((resolve, reject) => {
         console.log('\x1b[36m%s\x1b[0m', `"${cmd}" is executing...`);
         exec(cmd, function (error, stdout, stderr) {
             if (error) reject(error)
             if (stderr) reject(stderr)
             resolve(stdout)
         });
     })
 }
 
 (async function checkoutRelease() {
   const prestash = await execGitCmd('git diff --name-only && git diff --name-only --staged | sort | uniq')
   console.log({prestash})
   await execGitCmd('git stash')
   const poststash = await execGitCmd('git diff --name-only && git diff --name-only --staged | sort | uniq')
   console.log({poststash})
 
   const latest = await fetchRelease();
   console.log({latest})
 })()