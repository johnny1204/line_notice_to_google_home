const googlehome = require('google-home-notifier')
const http = require('http')
const Client = require('@line/bot-sdk').Client

googlehome.device('Google-Home', 'ja')

const client = new Client({
  channelAccessToken: 'M9eh2c+B/cDdw4132CloM/pjiu/rS+iKuh/3KD+gr4jMRZ14rL/BHWz/ZCzqVfUgc/r55D5wLwYHGevKDS4Fvs2YuWU1jftvLsL+PNaxTg8JfH7J97N8JZupZivYgXcG9/esyxgfEJv6DCHNlrRaygdB04t89/1O/w1cDnyilFU=',
  channelSecret: '7500dd278650805cbf9083256878a63c'
})

http.createServer(function(request, response){
  let data = ''
  request.on('data', function(chunk){
    data += chunk
  })

  request.on("end", function() {
    const line = JSON.parse(data).events[0]
    if(line.type != 'message' || webhook.message.type != 'text') return

    client.getProfile(line.source.userId).then(function(data){
      const message = data.displayName + 'からメッセージです。' + line.message.text
      googlehome.notify(message, function(text) {
        console.log(text)
      })
    })
    response.writeHead(200, {"Content-Type": "text/plain"})
    response.end()
  })
}).listen(1337, '127.0.0.1')