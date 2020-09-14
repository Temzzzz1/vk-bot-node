require('dotenv').config()

const { prefix } = require('./config.json');
const fs = require('fs');
const {VKApi, ConsoleLogger, BotsLongPollUpdatesProvider} = require('node-vk-sdk')
const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose')
let api = new VKApi({
    token: process.env.VK_TOKEN,
    logger: new ConsoleLogger()
})


client.commands = new Discord.Collection();   

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
 
let updatesProvider = new BotsLongPollUpdatesProvider(api, process.env.VK_GROUP)
console.log('Bot starts...')

try {
    mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@cluster0.be5s0.mongodb.net/'+process.env.DB_NAME, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    console.log('Database connected...')
} catch (e) {
    console.log(e)
}


var schedule = require('node-schedule');
 
var rule = new schedule.RecurrenceRule();
rule.minute = 1
 
schedule.scheduleJob(rule, async function() {
    const http = require("https")
    const url = "https://timetable.tusur.ru/api/v2/raspisanie_vuzov";

    await http.get(url, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            json = JSON.parse(body);
            fs.writeFile('tusur.json', body, function (err) {
                if (err) throw err;
                console.log('Timetable parsed!');
              })
        })
    })


    
});


 
updatesProvider.getUpdates(async updates => {

    try {
        
        if (updates.length == 0) return

        let object = updates[0].object.message
        let from_id = object.from_id
        let peer_id = object.peer_id
        let message = object.text
        let type = updates[0].type

        if (type != 'message_new') return

        if (!message.startsWith(prefix)) return;

        const args = message.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // Проверяем и подключаем команду с директории
	    const command = client.commands.get(commandName)
                || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        // Если команда не найдена, сворачиваем все
        if (!command) return console.log('Command not found');

        // Если команда только для админов
        if (command.guildOnly && from_id != 199690736) {
            return api.messagesSend({
                        peer_id: peer_id,
                        message: 'Прости, но эта команда только для Темы!',
                        random_id: 0
                    })
        }

        // Если аргументов нет
        if (command.args && !args.length) {
            let reply = `Мне кажется, ты ввел команду неправильно,`;
            // Говорим юзеру, как правильно надо вводить команду
            if (command.usage) {
                reply += `\nФормат: \`${prefix}${command.name} ${command.usage}\``;
            }

            // Отправляем ответ
            return api.messagesSend({
                        peer_id: peer_id,
                        message: reply,
                        random_id: 0
                    })
        }

        try {
            command.execute(api, object, args, client);
        } catch (error) {
            console.error(error);
        }

    } catch (error) {
        console.log('message_error', updates)
        console.log(error)
    }
})

var http = require('http')

http.createServer().listen(process.env.PORT || 5000)