/**
 * take stock of changes
 * tell slack of changed files
 * stash
 * git checkout release
 */

// TODO: replace console.logs with slack notifications

 const { exec } = require('child_process')
 const { Octokit } = require('octokit')
 
  async function getAllReleases() {
   const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
   // get list of releases
   const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
     owner: 'meljameson',
     repo: 'test-gha',
   })
   
   if (response == null) {
     throw new Error(`Unable to get release data from GitHub. No response: ${JSON.stringify(response)}`)
   }
 
   return response.data
 }
 
 async function getLastPreRelease() {
   // get the latest pre-release
   const releases = await getAllReleases()
 
   if (releases == null) {
     throw new Error(`No releases found! releases: ${JSON.stringify(releases)}`)
   }
 
   // the last release is the first in the release list
   const release = releases[0]
   
   if (release == null) {
     throw new Error(`Previous release not found! release: ${JSON.stringify(release)}`)
   }
 
   return release
 }
 
 function execGitCmd(cmd) {
     return new Promise((resolve, reject) => {
         console.log('\x1b[36m%s\x1b[0m', `'${cmd}' is executing...`);
         exec(cmd, function (error, stdout, stderr) {
             if (error) reject(error)
             if (stderr) reject(stderr)
             resolve(stdout)
         });
     })
 }
 
 function checkForChanges() {
   return execGitCmd('git diff --name-only && git diff --name-only --staged | sort | uniq')
 }
 
 (async function checkoutPrerelease() {
   const changes = await checkForChanges()
   if (changes) {
     console.log(`Unsaved changes found: ${changes}`)
     console.log('Stashing changes')
     await execGitCmd('git stash -u')
   }
 
   const moreChanges = await checkForChanges()
   if (moreChanges) {
     console.log(`More unsaved changes found: ${moreChanges}. Exiting for human help`)
     process.exit(1)
   }
 
   const latest = await getLastPreRelease();
   if (latest == null) {
     console.log('No latest prerelease to check out')
     process.exit(1)
   }
   if (latest.prerelease === false) {
     console.log('No pre-release found needing to be smoketested')
     process.exit(1)
   }
 
   await execGitCmd('git fetch')
   console.log(`Checking out latest prerelease: ${latest.tag_name} at ${latest.url}`)
   try {
     // this will give a detached head error which isn't really an error for us
     await execGitCmd(`git checkout ${latest.tag_name}`)
   } catch(e){} finally {
     const status = await execGitCmd(`git status`)
     console.log(status)
     console.log('Pre-release is loaded and ready to test')
   }
 })()