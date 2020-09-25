const Group = require('../models/groups')
const Remind = require('../models/reminds')
const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
const timetable = require('./timetable')

module.exports = {
    name: 'напоминай',
    description: 'буду показывать тебе расписание каждое утро',
    logo: "⌚",
    usage: "[время]",
    aliases: [' напомни', 'напомни'],
    fullDescription: "с помощью этой команды, бот будет автоматически отпарвлять тебе расписание в заданное тобой время. Например: \"!напоминай 6.30 -- каждое утро в 6.30 бот будет скидывать расписание\"",
    async execute(api, object, args) {

        const id = await Group.findOne({ user_id: object.from_id }).lean()
        if (!id) {
            return api.messagesSend({
                peer_id: object.peer_id,
                message: 'Я не нашел группу привязанную к тебе\nПопробуй: !запомнить (группа)',
                random_id: 0
            })
        }

        if (args[0] == 'стоп') {
            await Remind.deleteOne({ peer_id: object.peer_id })
            return api.messagesSend({
                peer_id: object.peer_id,
                message: 'Бот больше не будет показывать расписание каждый день.',
                random_id: 0
            })
        }

        dayjs.extend(utc)
        var customParseFormat = require('dayjs/plugin/customParseFormat')
        dayjs.extend(customParseFormat)

        DATE = dayjs(args[0] , 'H.m').subtract(7, 'hour').add(1, 'day').utc().utcOffset(7).format()
        
        
        if (dayjs(DATE).isValid() == false) {
            return api.messagesSend({
                peer_id: object.peer_id,
                message: "Некорректный ввод даты. Подробнее о команде \"!инфо напоминай\"",
                random_id: 0
            })
        }

        await Remind.findOneAndUpdate({ peer_id: object.peer_id }, {
            group_id: id.group_id,
            date: DATE
        }, async (err, doc) => {

            if (!doc) {
                await Remind.create({ 
                    peer_id: object.peer_id,
                    group_id: id.group_id,
                    date: DATE
                });
            }
        })

        return api.messagesSend({
            peer_id: object.peer_id,
            message: "Готово! Теперь я буду показывать расписание " +id.group_id+ " группы в этой беседе, каждый день в "
                        +args[0]+" по Томску. Чтобы отключить эту функцию напиши \"!напоминай стоп\"",
            random_id: 0
        })

    },
};