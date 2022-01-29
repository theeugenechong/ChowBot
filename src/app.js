import tmi from 'tmi.js'
import { username } from 'tmi.js/lib/utils';
import { BLOCKED_WORDS, BOT_USERNAME, CHANNEL_NAME, OAUTH_TOKEN } from './constants';

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

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {
	if(self) return;

    if(username.userstate === BOT_USERNAME) return;

	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${userstate.username}, heya!`);
	}

    checkChat(channel, userstate, message)
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