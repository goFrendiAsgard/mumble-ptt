const express = require('express')
const app = express()
const waitingTime = 200
var status = {'talker':'', 'lastSet':0}

// fungsi untuk mendeteksi apakah boleh berbicara
function isAllowedToTalk(talker){
    if(status.talker == talker){
        // Jika talker nya adalah node yang sama, maka boleh bicara
        return true
    }
    let timestamp = new Date().getTime()
    let lastSet = status.lastSet
    // Jika selisihwaktu permintaan bicara dan waktu terakhir bicara lebih dari waiting time, maka boleh bicara
    if(timestamp - lastSet > waitingTime){
        return true
    }
    // selain itu, tidak boleh bicara
    return false
}

// fungsi untuk menset talker jika diijinkan berbicara
function setTalker(talker){
    let timestamp = new Date().getTime()
    // jika boleh bicara, maka set talker dan waktu terakhir bicara
    if(isAllowedToTalk(talker)){
        status.talker = talker
        status.lastSet = timestamp
        return true
    }
    return false
}

// kalau mau bicara, akses url: http://ip-server:3000/wantToTalk/namaTalker
app.get('/wantToTalk/:talker', function (req, res) {
    let allowed = setTalker(req.params.talker)
    res.send(JSON.stringify({'allowed' : allowed}))
})

// kalau mau lihat status, buka url: http://ip-server:3000 (untuk keperluan debugging)
app.get('/', function (req, res) {
    res.send(JSON.stringify(status))
})

app.listen(3000, function () {
    console.log('PTT Server run on port 3000')
})
