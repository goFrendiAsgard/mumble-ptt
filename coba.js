var mic = require('gofrendi-microphone');
mic.startCapture({
    'cmd':'sox',
    'cmdParams':['-d', '-t', 'dat', '-p']
});


mic.audioStream.on('data', function(data) {
    //console.log('audio stream')
    //console.log('audio stream ' + data);
});

mic.infoStream.on('data', function(micInfo) {
    if(String(micInfo).match(/[=-]\|[=-]/g)){
        //console.log('ngomong')
    }
    console.log(String(micInfo))
    //console.log('info stream')
    //console.log('info stream ' + data);
});
