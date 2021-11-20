const proj4 = require('proj4')
const express = require('express')
const app = express()

const simulateEnterPress = () => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
            'keyCode': '13'
        }))
}

const getConvertedCoords = (oriCoors) => {
    
}

(function() {
    const wgs84Projection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
    const naverMap3857Projion = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs'
    console.log(proj4(naverMap3857Projion, wgs84Projection, [14129511.168721464,4507653.154001517]))
})()

app.get('/api', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       var users = JSON.parse( data )
       var user = users["user" + req.params.id] 
       console.log( user )
       res.end( JSON.stringify(user))
    })
 })

const server = app.listen(8020, () => {
    const host = server.address().address
    const port = server.address().port
    console.log("listening http://%s:%s", host, port)
 })