const Group = require('../models/groups')
const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
const fs = require('fs');

module.exports = {
    name: 'расписание',
    description: 'покажу расписание ТУСУРа',
    logo: "⌚",
    aliases: ['расп', 'р', ' р', ' расписание', 'h'],
    usage: "[дата]",
    fullDescription: "введи эту команду, чтобы получить доступ к расписанию группу. Если не вводить дополнительные параметры, то бот покажет расписание на сегодняшний день. Ты также можешь использовать даты: сегодня, завтра, послезавтра, 23.09, 14.10.2020",
    async execute(api, object, args) {

        const id = await Group.findOne({ user_id: object.from_id }).lean()
        if (!id) {
            return api.messagesSend({
                peer_id: object.peer_id,
                message: 'Я не нашел группу привязанную к тебе\nПопробуй: !запомнить (группа)',
                random_id: 0
            })
        }

        dayjs.extend(utc)
        var customParseFormat = require('dayjs/plugin/customParseFormat')
        dayjs.extend(customParseFormat)
        formatedDate = dayjs(args[0] + ".2020", 'DD.MM.YYYY').format('DD-MM-YYYY')
        DATE = dayjs(args[0] + ".2020", 'DD.MM.YYYY').format('DD.MM.YYYY')
        
        if (dayjs(formatedDate, "DD.MM.YYYY").isValid() == false) {
            switch (args[0]) {
                case 'сегодня':
                    DATE = dayjs().utc().utcOffset(7).format('DD.MM.YYYY')
                    break;
                case 'завтра':
                    DATE = dayjs().add(1, 'day').utc().utcOffset(7).format('DD.MM.YYYY')
                    break;

                case 'послезавтра':
                    DATE = dayjs().add(2, 'day').utc().utcOffset(7).format('DD.MM.YYYY')
                    break;

                default:
                    DATE = dayjs().utc().utcOffset(7).format('DD.MM.YYYY')
                    break;
            }
        }

        function timetableUtil(teachersArray) {
            result = []
            teachersArray.forEach(value => {
                result.push(value.name)
            })

            return result.join(', ')
        }

        fs.readFile("tusur.json", "utf8", async (error, data) => {
            table = JSON.parse(data)
            Lessons = "🔶 " + id.group_id + " | " + DATE + " 🔶\n\n"

            table.faculties.find(faculty => {
                return faculty.groups.find(group => {
                    if (group.name == id.group_id)
                        group.lessons.find(lesson => {

                            if (lesson.date.split(',').find(time => time == DATE)) {

                                Lessons += "🔹 " + lesson.subject + "\n" + lesson.time.start
                                    + " - " + lesson.time.end + " | " + lesson.type + "\n"
                                    + timetableUtil(lesson.audiences) + " | " + timetableUtil(lesson.teachers) + "\n\n"
                            }
                        })
                })
            })

            api.messagesSend({
                peer_id: object.peer_id,
                message: Lessons,
                random_id: 0
            })

        })



    },
};