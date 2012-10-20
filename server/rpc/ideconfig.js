'use strict';

var fs = require('fs');
var path = require('path');

function IdeConfigException(message) {
    this.name = 'IdeConfigException';
    this.message = message;
}
IdeConfigException.prototype = new Error;

function getClientExtensions(dirname) {
    var clientExtensions = {};
    var clientDirs = fs.readdirSync(dirname);
    for (var i = 0; i < clientDirs.length; i++) {
        var dir = clientDirs[i];
        if (dir.indexOf('ext.') !== 0)
            continue;

        var name = dir.split('.')[1];
        clientExtensions[name] = path.join(dirname, dir);
    }
    return clientExtensions;
}

function getConfig(cloud9Dirname, projectDir, ip, port) {
    if (!(typeof cloud9Dirname == 'string'
        && typeof projectDir == 'string'
        && typeof ip == 'string'
        && typeof port == 'number')) {
        console.dir(arguments);
        // arguments is not a array, so we turn it into one
        throw new Error(
            'Expecting [str, str, str, port number] - got: '
            + [].slice.call(arguments));

    }
    var clientExtensions = getClientExtensions(
        path.join(cloud9Dirname, 'plugins-client'));
    //console.dir(clientExtensions);
    //original config is relative to configs subdir
    var dirname = path.join(cloud9Dirname, 'configs');
    var fsUrl = '/workspace';
    var vfsUrl = '/vfs';

    var config = [
        {
            packagePath: 'connect-architect/connect',
            host: ip,
            port: port
        }, {
            packagePath: './cloud9.sourcemint',
            prefix: '/static/bundles',
            plugins: clientExtensions
        }, {
            packagePath: 'connect-architect/connect.static',
            prefix: '/static'
        },
        './cloud9.alive',
        './cloud9.debug',

        // Client libraries
        './../plugins-client/cloud9.core',
        './../plugins-client/lib.ace',
        './../plugins-client/lib.apf',
        './../plugins-client/lib.treehugger',
        './../plugins-client/lib.v8debug',
        {
            packagePath: './../plugins-client/lib.requirejs',
            waitSeconds: 0
        },
        {
            packagePath: 'smith.io/server-plugin',
            messagePath: '/smith.io/server',
            debug: true
        },
        // server plugins
        {
            packagePath: './cloud9.sandbox',
            projectDir: projectDir,
            workspaceId: 'Cloud9',
            userDir: null, // is this always there??
            unixId: null,
            host: ip
        }, {
            packagePath: './cloud9.core',
            debug: false,
            fsUrl: fsUrl,
            smithIo: {
                port: port,
                prefix: '/smith.io/server'
            },
            hosted: false,
            bundledPlugins: [
                //"helloworld"
            ],
            packed: false,
            packedName: '',
            clientPlugins: [
                'ext/filesystem/filesystem',
                'ext/settings/settings',
                'ext/editors/editors',
                //"ext/connect/connect",
                'ext/themes/themes',
                'ext/themes_default/themes_default',
                'ext/panels/panels',
                'ext/dockpanel/dockpanel',
                'ext/openfiles/openfiles',
                'ext/tree/tree',
                'ext/save/save',
                'ext/recentfiles/recentfiles',
                'ext/gotofile/gotofile',
                'ext/newresource/newresource',
                'ext/undo/undo',
                'ext/clipboard/clipboard',
                'ext/searchinfiles/searchinfiles',
                'ext/searchreplace/searchreplace',
                'ext/quickwatch/quickwatch',
                'ext/gotoline/gotoline',
                'ext/preview/preview',
                'ext/log/log',
                'ext/help/help',
                'ext/linereport/linereport',
                //"ext/ftp/ftp",
                'ext/code/code',
                'ext/statusbar/statusbar',
                'ext/imgview/imgview',
                //"ext/preview/preview",
                'ext/extmgr/extmgr',
                //"ext/run/run", //Add location rule
                'ext/runpanel/runpanel', //Add location rule
                'ext/debugger/debugger', //Add location rule
                'ext/dbg-node/dbg-node',
                'ext/noderunner/noderunner', //Add location rule
                'ext/console/console',
                'ext/consolehints/consolehints',
                'ext/tabbehaviors/tabbehaviors',
                'ext/tabsessions/tabsessions',
                //"ext/keybindings/keybindings",
                'ext/keybindings_default/keybindings_default',
                'ext/watcher/watcher',
                'ext/dragdrop/dragdrop',
                'ext/menus/menus',
                'ext/tooltip/tooltip',
                'ext/sidebar/sidebar',
                'ext/filelist/filelist',
                'ext/beautify/beautify',
                'ext/offline/offline',
                'ext/stripws/stripws',
                'ext/testpanel/testpanel',
                'ext/nodeunit/nodeunit',
                'ext/zen/zen',
                'ext/codecomplete/codecomplete',
                'ext/vim/vim',
                'ext/anims/anims',
                'ext/guidedtour/guidedtour',
                'ext/quickstart/quickstart',
                'ext/jslanguage/jslanguage',
                //"ext/autotest/autotest",
                'ext/closeconfirmation/closeconfirmation',
                'ext/codetools/codetools',
                'ext/colorpicker/colorpicker',
                'ext/gitblame/gitblame',
                //"ext/githistory/githistory",
                'ext/autosave/autosave',
                //"ext/revisions/revisions", // TODO: error reloading on the client
                'ext/quicksearch/quicksearch',
                'ext/language/liveinspect'
                //"ext/splitview/splitview"
                //"ext/minimap/minimap"
                //"ext/acebugs/acebugs"
            ]
        }, {
            packagePath: 'vfs-architect/local',
            root: '/'
        }, {
            packagePath: 'vfs-architect/http-adapter',
            mount: vfsUrl,
            httpRoot: 'http://localhost:' + port + vfsUrl
        }, {
            packagePath: './cloud9.fs',
            urlPrefix: fsUrl
        },
        './cloud9.socket',
        {
            packagePath: 'connect-architect/connect.session',
            key: 'cloud9.sid.' + port,
            secret: 'v1234'
        },
        {
            packagePath: 'connect-architect/connect.session.file',
            sessionsPath: dirname + '/../.sessions'
        },
        './cloud9.permissions',
        {
            packagePath: './cloud9.client-plugins',
            plugins: clientExtensions
        },
        './cloud9.eventbus',
        './cloud9.process-manager',
        './cloud9.run.shell',
        {
            packagePath: './cloud9.run.node',
            listenHint: "Important: in your scripts, use 'process.env.PORT' as port and '0.0.0.0' as host."
        },
        {
            packagePath: './cloud9.run.node-debug',
            listenHint: "Important: in your scripts, use 'process.env.PORT' as port and '0.0.0.0' as host."
        },
        './cloud9.run.npm',
        './cloud9.run.npmnode',
        //"./cloud9.run.ruby",
        //"./cloud9.run.python",
        //"./cloud9.run.apache",
        //"./cloud9.run.php",
        'architect/plugins/architect.log',
        './cloud9.ide.auth',
        {
            packagePath: './cloud9.ide.git',
            sshPath: '/home/lophilo/lophilo/lmc/ssh'
        },
        './cloud9.ide.gittools',
        //"./cloud9.ide.hg",
        './cloud9.ide.npm',
        './cloud9.ide.search',
        './cloud9.ide.run-node',
        {
            packagePath: './cloud9.ide.run-npm-module',
            allowShell: true
        },
        //"./cloud9.ide.run-python",
        //"./cloud9.ide.run-apache",
        //"./cloud9.ide.run-ruby",
        //"./cloud9.ide.run-php",
        //"./cloud9.run.python",
        './cloud9.ide.revisions',
        {
            packagePath: './cloud9.ide.settings',
            settingsPath: '.settings'
        },
        './cloud9.ide.shell',
        './cloud9.ide.state',
        './cloud9.ide.watcher'
    ];
    return config;
}

exports.getConfig = getConfig;
