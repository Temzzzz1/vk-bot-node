const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')

module.exports = {
    name: 'погода',
    description: 'покажу погоду в Томске',
    logo: "☁",
    aliases: [' погода'],
    fullDescription: "введи эту команду, чтобы получить погоду в Томске",
    async execute(api, object, args) {

        const http = require("http")
        const url = "http://api.openweathermap.org/data/2.5/weather?q=Tomsk&appid=6a6d68e951741a31c087ecb242a025e7";

        await http.get(url, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                json = JSON.parse(body);
                dayjs.extend(utc)
                DATE = dayjs().utc().utcOffset(7).format('DD.MM.YYYY')

                weatherMessage = "Сейчас в Томске " + Math.floor(json.main.temp - 273) + " °С"
                
                return api.messagesSend({
                    peer_id: object.peer_id,
                    message: weatherMessage,
                    random_id: 0
                })
            })
        })



    },
};