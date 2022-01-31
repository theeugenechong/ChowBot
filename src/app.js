import tmi from 'tmi.js'
import { BLOCKED_WORDS, BOT_USERNAME, CHANNEL_NAME, OAUTH_TOKEN, REGEX_COMMAND } from './constants';

const options = {
    options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
};

const client = new tmi.Client(options);

const commands = {
    hello: {
        response: (userstate, argument) => `@${userstate.username}, hello! peepoHappy Welcome to the stream!`
    },
    github: {
        response: 'https://github.com/theeugenechong/ChowBot'
    },
};

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {
	const isNotBot = userstate.username.toLowerCase() !== BOT_USERNAME.toLowerCase();

    if(!isNotBot) return;

    checkChat(channel, userstate, message)

    let isCommand = REGEX_COMMAND.test(message);
    if (!isCommand) return;

    const [raw, command, argument] = message.toLowerCase().match(REGEX_COMMAND);

    const {response} = commands[command] || [];

    if (typeof response === 'function') {
        client.say(channel, response(userstate, argument));        
    } else if (typeof response === 'string') {
        client.say(channel, response);
    }
});

});

  

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

}