var http    = require("http"),
    url     = require("url"),
    exec =  require('child_process').exec,
    port    = 1337,
    home    = '/Users/';

http.createServer(function(request, response) {

    var sys  = require('util'),
        qs   = require('querystring'),
        body = '';
       // terminal = require('child_process').spawn('bash'),

        response.writeHead(200, { // NOTE: a partial http response
                'Connection'                    : 'close',
                'Cache-Control'                 : 'private',
                'Content-Type'                  : 'text/plain',
                'Access-Control-Allow-Origin'   : '*'
            });

    request.on('data', function (data) {
        body += data;
    });
        
    request.on('end', function () {
        var data = qs.parse(body),
            cmds = data.command || data['command[]'],
            result = {},
            exec_callback = function (error, stdout, stderr) {
                var p = cmd.split(' ');
                result[p[0]] = error ? error.message : stdout.substr(0, stdout.length - 1);
            
                if (++i < l) {
                    exec_command();
                }
                else {
                    response.end(JSON.stringify(result));
                }
            },
            exec_command  = function () {
                cmd = cmds[i];
                real_cmd = cmd;

                if (cmd.substr(0, 2) === 'cd') {
                    try {
                        var path = cmd.length > 3 ? cmd.substr(3) : home;
                        process.chdir(path);
                    }
                    catch (e) {
                        console.log('chdir error', e);
                    }
                    real_cmd = 'pwd';
                }

                try {
                    var child = exec(real_cmd, exec_callback);
                }
                catch (e) {
                    console.log('exec error', e);
                }
            },
            i, l, cmd, real_cmd;
        
        if(!Array.isArray(cmds)) {
            cmds = [cmds];
        }

        i = 0;
        l = cmds.length;
        exec_command();
    });
}).listen(port);


var child = exec('echo $HOME', function (error, stdout, stderr) {
    home = stdout.substr(0, stdout.length -1);
});