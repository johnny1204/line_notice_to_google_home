const googlehome = require('google-home-notifier')
const http = require('http')
const Client = require('@line/bot-sdk').Client
const config = require('./config/setting.json')

googlehome.device('Google-Home', 'ja')
googlehome.ip(config.googlehome_ip)

const client = new Client({
  channelAccessToken: config.access_token,
  channelSecret: config.client_secret
})

http.createServer(function(request, response){
  let data = ''
  request.on('data', function(chunk){
    data += chunk
  })

  request.on("end", function() {
    const line = JSON.parse(data).events[0]
    if(line.type != 'message' || line.message.type != 'text') return

    client.getProfile(line.source.userId).then(function(data){
      const message = data.displayName + 'からメッセージです。' + line.message.text
      googlehome.notify(message, function(text) {
        console.log(text)
      })
    })
  })
  response.writeHead(200, {"Content-Type": "text/plain"})
  response.end()
}).listen(config.server_port)