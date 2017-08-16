'use strict';
const SerialPort = require('serialport');
const args = require('commander');
const http = require('http')

args
    .usage('-p <port>')
    .description('Run printable characters through the serial port')
    .option('-p, --port <port>', 'Path or Name of serial port. See serialportlist for available serial ports.')
    .parse(process.argv);

if (!args.port) {
    args.outputHelp();
    args.missingArgument('port');
    process.exit(-1);
}

const port = new SerialPort(args.port, { autoOpen: false }); // open the serial port:

// open port
port.open((error)=>{
    if(error){
        console.log(error)
    }
    else{
        getAndSend()
    }
})

function getAndSend(){
    // get state
    port.get((error, state)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(state) // cts, dsr, dcd

            // send data
            port.set({'brk':1, 'cts':1, 'dsr':1, 'dtr':1, 'rts':1}, (error)=>{
                if(error){
                    console.log(error)
                }
                else{
                }
            })

        }
    })

    setTimeout(getAndSend, 1)
}

