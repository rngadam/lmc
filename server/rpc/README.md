# API documentation

##
## cloud9

### edit

    ss.rpc('cloud9.edit', REPO_URL)

calls create starts cloud9 instance and open up the checked out directory.

REPO_URL: example: 'git@github.com:Lophilo/sshkeys.git'

## git

### checkout of git repository

    ss.rpc('git.checkout', REPO_URL)

checks out the directory into user home directory

REPO_URL: example: 'git@github.com:Lophilo/sshkeys.git'

### get public key

    ss.rpc('git.pubkey')

Return public key associated to current logged in user.