const googlehome = require('google-home-notifier')
const http = require('http')
const Client = require('@line/bot-sdk').Client
const config = require('./config/setting.json')
const ngrok = require('ngrok')
const VoiceText = require('voicetext')

googlehome.device('Google-Home', 'ja')
googlehome.ip(config.googlehome_ip)

const client = new Client({
  channelAccessToken: config.access_token,
  channelSecret: config.client_secret
})

function notify(message){
  googlehome.notify(message, function(text) {
    console.log(text)
  })
}

http.createServer(function(request, response){
  let data = ''
  request.on('data', function(chunk){
    data += chunk
  })

  request.on("end", function() {
    const line = JSON.parse(data).events[0]
    if(line.type != 'message' || line.message.type != 'text') return
    console.log(line.source.userId)
    const user = line.users[line.source.userId]
    if(user){
      const message = user + 'からメッセージです。' + line.message.text
      if(line.voice_api_key){
        const voice = new VoiceText(line.voice_api_key)
        voice.speaker(voice.SPEAKER.HIKARI).speak(notify(message))
      } else {
        notify(message)
      }
    }
  })
  response.writeHead(200, {"Content-Type": "text/plain"})
  response.end()
}).listen(config.server_port, function(){
  ngrok.connect({authtoken: config.ngrok_token, addr: config.server_port}, function (err, url) {
  })
})