'use strict';
const Cmd = require('node-cmd')
const Http = require('http')
const mic = require('gofrendi-microphone');

if(process.argv.length < 4){
    console.error(`usage: node ${process.argv[1]} <id> <url>`)
    process.exit(-1);
}

const id = process.argv[2]
const url = process.argv[3]

// sebelum mulai, mute mumble client terlebih dahulu
Cmd.get('mumble rpc mute', function(){

    mic.startCapture({
        'cmd':'sox',
        'cmdParams':['-d', '-t', 'dat', '-p']
    });


    mic.audioStream.on('data', function(data) {
        // should be here to trigger infoStream
    });

    // get from mic
    mic.infoStream.on('data', function(micInfo) {
        console.log(String(micInfo))
        if(String(micInfo).match(/[=-]\|[=-]/g)){
            // send request to server 
            let httpreq = Http.get(url+'/wantToTalk/'+id, function (response) {
                response.setEncoding('utf8')
                let output = ''
                // get each chunk as output
                response.on('data', function (chunk) {
                    output += chunk
                })
                // show the output
                response.on('end', function() {
                    try{
                        output = JSON.parse(output)
                        if(output.allowed){
                            Cmd.get('mumble rpc unmute', function(){})
                        }
                        else{
                            Cmd.get('mumble rpc mute', function(){})
                        }
                    }
                    catch(err){
                        console.error('[ERROR] Failed to parse JSON')
                        console.error(err)
                    }
                })
            })
            // error handler
            httpreq.on('error', function (e) {
                console.error('[ERROR] Request failed')
                console.error(JSON.stringify(e))
            });
            // timeout handler
            httpreq.on('timeout', function () {
                console.error('[ERROR] Request timeout')
                httpreq.abort();
            });
        }
        else{
            Cmd.get('mumble rpc mute', function(){ console.log('diem') })
        }
    })

})
