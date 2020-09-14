const { prefix } = require('../config.json');

module.exports = {
	name: 'инфо',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['info', 'и', ' инфо'],
	execute(api, object, args, client) {
		const data = [];
        const { commands } = client
        

		if (!args.length) {
			data.push('Список моих комманд\n\n');
            commands.map(command => {
                if (!command.guildOnly && command.name != 'инфо')
                data.push(command.logo+" "+command.name+" -- "+command.description+"\n")
            })
            
			data.push(`\n\n Отправь \"${prefix}инфо [имя команды]\" чтобы получить дополнительную информацию о ней!`);

			return api.messagesSend({
                peer_id: object.peer_id,
                message: data.join(''),
                random_id: 0
            })
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return api.messagesSend({
                peer_id: object.peer_id,
                message: 'Такой команды нет :(',
                random_id: 0
            })
		}

        data.push(`🔹 Команда ${prefix}${command.name} 🔹\n\n`);
        
        if (command.description) 
        data.push(`Описание: ${command.fullDescription}\n\n`);

		if (command.aliases) data.push(`Алиасы: "${command.aliases.join('", "')}"\n\n`);
		
        if (command.usage) data.push(`Формат: ${prefix}${command.name} ${command.usage}`);
        
        return api.messagesSend({
            peer_id: object.peer_id,
            message: data.join(''),
            random_id: 0
        })

	},
};