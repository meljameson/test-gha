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

async function ensureCleanState() {
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
}

function getDescription(head) {
  return Promise.all([execGitCmd(`git log ${head} -n 1`), execGitCmd(`git rev-parse ${head}`)])
}

(async function checkoutPrerelease() {
  await ensureCleanState()
  const [ description, oldCommit ] = await getDescription('HEAD@{1}');
  
  try {
    console.log(`Checking out previous version: ${description}`)
    await execGitCmd(`git checkout HEAD@{1}`)
  } catch(e) {} finally {
    const [ description, newCommit ] = await getDescription('HEAD');
    
    if (oldCommit !== newCommit) {
      console.error(`Checkout commit does not match current commit.`)
      console.error(`old: ${oldCommit} new: ${newCommit}`)
      console.log(description)
      process.exit(1)
    }

    console.log(`Checkout to previous version ${oldCommit} completed successfully.`)
    console.log(`On Commit ${newCommit}`)
    console.log(description)
  }
})()