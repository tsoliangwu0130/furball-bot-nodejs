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
                    "title": "Ai Chat Bot Communities",
                    "subtitle": "Communities to Follow",
                    "image_url": "https://www.facebook.com/furballchubbymeow/videos/266702097015835/",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/groups/aic⋯⋯",
                        "title": "FB Chatbot Group"
                    }, {
                        "type": "web_url",
                        "url": "https://www.reddit.com/r/Chat_Bots/",
                        "title": "Chatbots on Reddit"
                    },{
                        "type": "web_url",
                        "url": "https://twitter.com/aichatbots",
                        "title": "Chatbots on Twitter"
                    }],
                }, {
                    "title": "Chatbots FAQ",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "https://www.facebook.com/furballchubbymeow/videos/281560292196682/",
                    "buttons": [{
                        "type": "postback",
                        "title": "What's the benefit?",
                        "payload": "Chatbots make content interactive instead of static",
                    },{
                        "type": "postback",
                        "title": "What can Chatbots do",
                        "payload": "One day Chatbots will control the Internet of Things! You will be able to control your homes temperature with a text",
                    }, {
                        "type": "postback",
                        "title": "The Future",
                        "payload": "Chatbots are fun! One day your BFF might be a Chatbot",
                    }],
                },  {
                    "title": "Learning More",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "https://www.facebook.com/furballchubbymeow/videos/368152226870821/",
                    "buttons": [{
                        "type": "postback",
                        "title": "AIML",
                        "payload": "Checkout Artificial Intelligence Mark Up Language. Its easier than you think!",
                    },{
                        "type": "postback",
                        "title": "Machine Learning",
                        "payload": "Use python to teach your maching in 16D space in 15min",
                    }, {
                        "type": "postback",
                        "title": "Communities",
                        "payload": "Online communities & Meetups are the best way to stay ahead of the curve!",
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