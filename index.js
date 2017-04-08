var express       = require('express')
var bodyParser    = require('body-parser')
var request       = require('request')
var app           = express()
var graph_api_url = 'https://graph.facebook.com/v2.8/me/messages'
var verify_token  = 'Furball_Bot'
var token         = 'EAASh9p8S6i8BAII9V5qHkfdAfUmYn7ESuw26Js5WMqZAIB7n6c92od04kGsxk56mDTPUAKj6Vt2rhSoFRd7mfLBvEU6u796fTwRfzTEl7wyZBQZB4BFlayE6kXFZCpTlK4y6xJ1qXgS27kVmaDqBDSdC3GjctXl74N5MaWZBcJwZDZD'

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am Furball Bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API end point
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'meow') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

// function to echo back messages

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: graph_api_url,
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages:', error)
        } else if (response.body.error) {
            console.log('Error:', response.body.error)
        }
    })
}


// Send an test message back as two cards.
function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Furball_01",
                    "subtitle": "Furball_01",
                    "image_url": "https://scontent-dft4-1.xx.fbcdn.net/v/t31.0-8/17349777_408691256150251_3161583191849637124_o.jpg?oh=6e75b3b539cfd5b40053fa850a8442e5&oe=598BAA7F",
                    "buttons": [{
                        "type":"element_share",
                    }],
                }, {
                    "title": "Furball_02",
                    "subtitle": "Furball_02",
                    "image_url": "https://scontent-dft4-1.xx.fbcdn.net/v/t31.0-8/16107142_378661272486583_6814191021096657673_o.jpg?oh=7161ba75c77aacada15b551a2f99b7ad&oe=599A2E77",
                    "buttons": [{
                        "type":"element_share",
                    }],
                },  {
                    "title": "Furball_03",
                    "subtitle": "Furball_03",
                    "image_url": "https://scontent-dft4-1.xx.fbcdn.net/v/t31.0-8/15800282_371563219863055_2270307156689436092_o.jpg?oh=36e3ea8551491f96587140231fbb0f3d&oe=594E9C7D",
                    "buttons": [{
                        "type":"element_share",
                    }],
                }]  
            } 
        }
    }
    request({
        url: graph_api_url,
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages:', error)
        } else if (response.body.error) {
            console.log('Error:', response.body.error)
        }
    })
}