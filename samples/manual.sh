#!/bin/sh

# we're trying to do the equivalent to the script below
# but in Javascript driven by the web interface...

HOMEDIR=$HOME/lophilo/lmc/users/rngadam
SSHDIR=$HOMEDIR/.ssh
SSHKEY=$HOMEDIR/.ssh/github
SSHSCRIPT=$HOMEDIR/ssh
GITCLONE=$HOMEDIR/testurl

if [ ! -f $SSHKEY ]; then
	echo "Creating key"
	mkdir -p "$SSHDIR"
	cd $SSHDIR
	ssh-keygen -f github -P''
	cat github.pub
	echo "Add key to github, enter when ready"
	read pause
fi

if [ ! -f $SSHSCRIPT ]; then
	echo "Creating script $SSHSCRIPT"
cat <<EOF > $SSHSCRIPT
#!/bin/sh
exec /usr/bin/ssh -i $SSHKEY -o StrictHostKeyChecking=false "\$@"
EOF
	chmod u+x $SSHSCRIPT
fi

if [ ! -d $GITCLONE ]; then
	echo "Cloning using $SSHSCRIPT"
	cd $HOMEDIR
	export GIT_SSH=$SSHSCRIPT
	git clone git@github.com:Lophilo/testurl.git 
fi

unset GIT_SSH
if [ -d "$GITCLONE" ]; then
	echo "Configuring key in git $GITCLONE"
	cd $GITCLONE
	git config ssh.key $SSHKEY

	echo "Test pull"
	git pull
else 
	echo "failed cloning"
fi
