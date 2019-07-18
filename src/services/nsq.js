const nsq = require('nsqjs')

const write = (topic, message) => {
    const w = new nsq.Writer(process.env.NSQ_URL, process.env.NSQ_WRITE_PORT)

    w.connect()
     
    w.on('ready', () => {
      w.publish(topic, message)     
    })
     
    w.on('closed', () => {
      console.log('Writer closed')
    })
}

const read = (topic, channel) => {
    const reader = new nsq.Reader(topic, channel, {
        lookupdHTTPAddresses: process.env.NSQ_HOST + ':' + process.env.NSQ_READ_PORT
    })
       
    return reader 
}

module.exports = {
    write,
    read
}