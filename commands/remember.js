const Group = require('../models/groups')
const fs = require('fs');

module.exports = {
    name: 'запомнить',
    description: 'запомню твою группу',
    logo: "💡",
    usage: "[группа]",
    aliases: [' запомнить'],
    fullDescription: "введи эту команду, чтобы бот запомнил твою группу и у тебя появилась возможность использовать расписание",
    execute(api, object, args) {

        if (!args[0]) {
            return api.messagesSend({
                peer_id: object.peer_id,
                message: 'Что запомнить? Введи группу: !запомнить (группа)',
                random_id: 0
            })
        } else {
            fs.readFile("tusur.json", "utf8", async (error, data) => {
                table = JSON.parse(data)
                //console.log(table.faculties)
                const isGroup = table.faculties.find(faculty => {
                    return faculty.groups.find(group => group.name == args[0])
                })

                if (isGroup) {
                    await Group.findOneAndUpdate({ user_id: object.from_id }, {
                        group_id: args[0]
                    }, async (err, doc) => {

                        if (!doc) {
                            await Group.create({ 
                                user_id: object.from_id,
                                group_id: args[0]
                            });
                        }
                    })
                    
                    return api.messagesSend({
                        peer_id: object.peer_id,
                        message: 'Твоя группа ' + args[0] + ' сохранена!',
                        random_id: 0
                    })
                } else {
                    return api.messagesSend({
                        peer_id: object.peer_id,
                        message: 'Группа не найдена!',
                        random_id: 0
                    })
                }
                
            })
        }
    },
};