const Bot = require('anony-mpp-client')
require('dotenv').config()

const bot = new Bot({
    name: 'Guessing game [#guess]',
    color: '#b9f2ff',
    channel: '✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧'
})
    .login(process.env.token)


bot.client.on('error', console.log)



var guessing = false, timer, guess, attempt = 3

function timeout() {
    timer = setTimeout(() => {
        bot.chat(`Times up! It was ${guess}`)
        guessing = false
        guess = void 0
    }, 30000)
}

function check(item) {
    if (!/^\d{1}$/.test(item)) return
    if (attempt <= 0) {
        bot.chat(`Wrong guess! it was ${guess}`)
        guessing = false
        clearTimeout(timer)
        guess = ''
        attempt = 3
    }
    else {
       bot.chat(`Wrong guess! you've more ${attempt} attempts left`)
       attempt--
    } 
}

bot.client.on('a', message => {
    if (/^\d{1}$/.test(message.a.trim()) && guessing) {
        if (message.a.trim() === guess) {
            if (guessing) {
                bot.chat(`${message.p.name} Won the guessing game!`)
                guessing = false
                guess = void 0
                clearTimeout(timer)
            }
        }
        else check(message.a.trim())
    }


    switch (message.a.trim().toLowerCase()) {
        case '#guess':
            if (guessing) return bot.chat('Already running right now')
            bot.chat('Guess a number between 0-9. You\'ve 30 seconds to guess and you\'ve 3 attempts to guess')
            guessing = true
            guess = Math.floor(Math.random() * 9).toString()
            timeout()
            break
    }
})
