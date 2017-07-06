const usbPath = '/dev/tty-usbserial1'
const baudRate = 97600
const SerialPort = require('serialport')
const port = new SerialPort(usbPath, {
    'baudRate': baudRate
})

// Munculkan pesan error jika ada
port.on('error', function(err) {
    console.log('Error: ', err.message)
})

// Definisikan event jika ada data terbaca di port
port.on('data', function(data){
    // jika data yang terbaca adalah 1:
    if(data == 1){
        // tuliskan data 1
        port.write(1, function(err) {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
            console.log('message written')
        })
    }
})
