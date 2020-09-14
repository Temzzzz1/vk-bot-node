module.exports = {
	name: 'пинг',
	description: 'пингани бота!',
	guildOnly: true,
	aliases: ['понг'],
	execute(api, object) {
		api.messagesSend({
			peer_id: object.peer_id,
			message: 'Pong',
			random_id: 0
		})
	},
};