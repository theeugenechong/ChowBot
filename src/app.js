import tmi from 'tmi.js'
import { BLOCKED_WORDS, CHANNEL_NAME, REGEX_COMMAND } from './constants';

const options = {
    options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
};

const client = new tmi.Client(options);

const commands = {
    hello: {
        response: (channel, userstate, argument) => `@${userstate.username}, hello! peepoHey Welcome to the stream!`
    },
    github: {
        response: 'https://github.com/theeugenechong/ChowBot'
    },
    dice: {
        response: (channel, userstate, argument) => `@${userstate.username} rolled a ` + (1 + Math.floor(Math.random() * 6)) + `! COGGERS`
    },
    rr: {
        response: (channel, userstate, argument) => {
            let decision = Math.floor(Math.random() * 2);
            if (decision == 0) {
                return `@${userstate.username}, you are safe! Okayge`
            } else {
                if (argument < 600) {
                    client.timeout(channel, userstate.username, argument, "Lost in Russian Roulette")
                    .then((data) => {
                        // data returns [channel, username, seconds, reason]
                    }).catch((err) => {
                        //
                    });
                    return 'You died! ICANT'
                } else {
                    return 'Enter a period less than 600 seconds'
                }
            }
        }
    },
    fill: {
        response: (channel, userstate, argument) => {
            let messageToPost = "";
            for(let i = 0; i < 10; i++) {
                messageToPost += argument + " ";
            }
            return messageToPost
        }
    }
};

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {
	const isNotBot = userstate.username.toLowerCase() !== process.env.BOT_USERNAME.toLowerCase();

    if(!isNotBot) return;

    checkChat(channel, userstate, message)

    let isCommand = REGEX_COMMAND.test(message);
    if (!isCommand) return;

    const [raw, command, argument] = message.match(REGEX_COMMAND);

    const {response} = commands[command.toLowerCase()] || [];

    if (typeof response === 'function') {
        client.say(channel, response(channel, userstate, argument));        
    } else if (typeof response === 'string') {
        client.say(channel, response);
    }
});

client.on('subscription', (channel, userstate) => {
    respondToSubscription(channel, userstate);
});

client.on('cheer', (channel, userstate) => {
    respondToCheer(channel, userstate)
  })
  

/**
 * Checks message sent by user and deletes the message if it contains a blocked word.
 * Warns the user about the message sent.
 * 
 * @param {*} message Message sent by user
 */
function checkChat(channel, userstate, message) {
    message = message.toLowerCase()
    let isBadMessage = false;

    isBadMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))

    if(isBadMessage) {
        client.say(channel, `Hey, @${userstate.username}! You are not allowed to say that FeelsWeirdMan`)
        client.deletemessage(channel, userstate.id)
        .then((data) => {
            // data returns [channel]
        }).catch((err) => {
            //
        });
    }
}

function respondToSubscription(channel, userstate) {
    client.say(channel, `@${userstate.username}, thank you for subscribing!`);
}

function respondToCheer(channel, userstate) {
    client.say(channel, `Thank you @${userstate.username} for the ${userstate.bits} bits!`);
}