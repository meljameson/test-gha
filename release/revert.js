const { exec } = require('child_process')

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

    const moreChanges = await checkForChanges()
    if (moreChanges) {
      console.log(`More unsaved changes found: ${moreChanges}. Exiting for human help`)
      process.exit(1)
    }
  }

  
  const revertTo = await execGitCmd(`git log HEAD@{1} -n 1`)
  const oldHash = await execGitCmd(`git rev-parse HEAD@{1}`)
  try {
    console.log(`Checking out previous version: ${revertTo}`)
    await execGitCmd(`git checkout HEAD@{1}`)
  } catch(e) {} finally {
    const status = await execGitCmd(`git status`)
    console.log(status)
    const newHash = await execGitCmd(`git rev-parse HEAD`)
    const description = await execGitCmd(`git log HEAD@{1} -n 1`)
    if (oldHash === newHash) {
      console.log(`Checkout to previous version completed successfully.`)
      console.log(`On Commit ${newHash}`)
      console.log(description)
    } else {
      console.error(`Checkout commit does not match current commit.`)
      console.error(`old: ${oldHash} new: ${newHash}`)
      console.log(description)
      process.exit(1)
    }
  }
})()