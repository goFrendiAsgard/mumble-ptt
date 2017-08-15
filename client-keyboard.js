'use strict';
const gkm = require('gkm')
const SerialPort = require('serialport');
const Cmd = require('node-cmd')
const Http = require('http')


if(process.argv.length < 5){
    console.error(`usage: node ${process.argv[1]} <id> <url>`)
    process.exit(-1);
}

const id = process.argv[2]
const url = process.argv[3]

gkm.events.on('key.pressed', function(data){
    if(data == ['A']){
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
                        Cmd.get('mumble rpc unmute', function(){
                            // do nothing
                        })
                    }
                    else{
                        Cmd.get('mumble rpc mute', function(){
                            // do nothing
                        })
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
        Cmd.get('mumble rpc mute', function(){
            device.write(0)
        })
    }
})
