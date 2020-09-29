module.exports = {
	name: 'reload',
	description: 'перезагружу комманду',
    guildOnly: true,
	execute(api, object, args, client) {

		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return api.messagesSend({
                peer_id: object.peer_id,
                message: `There is no command with name or alias \`${commandName}\``,
                random_id: 0
            })
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            api.messagesSend({
                peer_id: object.peer_id,
                message: `Command \`${command.name}\` was reloaded!`,
                random_id: 0
            })
		} catch (error) {
            console.log(error);
            return api.messagesSend({
                peer_id: object.peer_id,
                message: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``,
                random_id: 0
            })
		}
	},
};