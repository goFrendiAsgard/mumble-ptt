'use strict';
const SerialPort = require('serialport');
const Cmd = require('node-cmd')
const Http = require('http')
const mic = require('gofrendi-microphone');

if(process.argv.length < 5){
    console.error(`usage: node ${process.argv[1]} <device> <id> <url>`)
    process.exit(-1);
}

const device = new SerialPort(process.argv[2], { autoOpen : false} ); // set device 
const id = process.argv[3]
const url = process.argv[4]

mic.startCapture({
    'cmd':'sox',
    'cmdParams':['-d', '-t', 'dat', '-p']
});

// buka device 
device.open((error)=>{
    if(error){
        console.log(error)
    }
    else{
        // sebelum mulai, mute mumble client terlebih dahulu
        Cmd.get('mumble rpc mute', function(){
            console.log('device Open');
            console.log(`Baud Rate: ${device.options.baudRate}`);
        })
        // get from mic
        mic.infoStream.on('data', function(micInfo) {
            if(String(micInfo).match(/[=-]\|[=-]/g)){
                console.log('ngomong')
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

                                    // kirim data 1 ke dsr
                                    port.set({'brk':1, 'cts':1, 'dsr':1, 'dtr':1, 'rts':1}, (error)=>{
                                        if(error){
                                            console.log(error)
                                        }
                                    })

                                })
                            }
                            else{
                                Cmd.get('mumble rpc mute', function(){

                                    // kirim data 0 ke dsr
                                    port.set({'brk':0, 'cts':0, 'dsr':0, 'dtr':0, 'rts':0}, (error)=>{
                                        if(error){
                                            console.log(error)
                                        }
                                    })

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
                    // kirim data 0 ke dsr
                    port.set({'brk':0, 'cts':0, 'dsr':0, 'dtr':0, 'rts':0}, (error)=>{
                        if(error){
                            console.log(error)
                        }
                    })
                })
            }
        })
    }
})

