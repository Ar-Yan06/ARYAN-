module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "Nayan",
	description: "record bot activity notifications",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../Nayan/catalogs/Nayanc.js");
    if (!global.configModule[this.config.name].enable) return;
    var formReport =  "bot notification" +
                        "\n\nthread id : " + event.threadID +
                        "\naction : {task}" +
                        "\nuser id : " + event.author +
                        "\ndate : " + Date.now() +" ",
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "name does not exist",
                    newName = event.logMessageData.name || "name does not exist";
            task = "user changes group name from : '" + oldName + "' to '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = " 𝖳𝖧𝖤 𝖴𝖲𝖤𝖱 𝖠𝖣𝖣𝖤𝖣 𝖳𝖧𝖤 𝖡𝖮𝖳 𝖳𝖮 𝖠 𝖭𝖤𝖶 𝖦𝖱𝖮𝖴𝖯";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "𝖳𝖧𝖤 𝖴𝖲𝖤𝖱 𝖪𝖨𝖢𝖪𝖤𝖣 𝖳𝖧𝖤 𝖡𝖮𝖳 𝖮𝖴𝖳 𝖮𝖥 𝖳𝖧𝖤 𝖦𝖱𝖮𝖴𝖯"
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport
    .replace(/\{task}/g, task);

    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger("", "");
    });
  return api.sendMessage(formReport, global.config.ADMINBOT[0]);
}
