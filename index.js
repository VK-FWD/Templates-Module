const fs = require('fs')

module.exports.startUp = (data, path) => {
    const TEMPLATES_FILE = path+"/templates.json";
    let templates = {};

    if(fs.existsSync(TEMPLATES_FILE)){
        templates = JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8'))
    }

    data.commands.templ = async (message, args) => {
        if(args.length<2) return;

        const templateName = args.shift()

        let templateBody = args.join(" ")
        for(let templateName in templates){
            templateBody = templateBody.replace("t:"+templateName, templates[templateName])
        }

        templates[templateName] = templateBody
        await fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates));
        await data.sendMessage(message.peerId, "✔ Шаблон успешно сохранён! Использование в тексте: t:"+templateName)
    }

    data.outputListeners.push(async (message) => {
        let text = message.text;
        for(let templateName in templates){
            text = text.replace("t:"+templateName, templates[templateName])
        }

        data.vk.replaceMessage(message, text)
    })
}