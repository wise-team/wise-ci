import * as fs from "fs";

const config: any = {
    wiseVersion: "1.2.2",
    nodeVersion: "9.11",
    npmKeywords: [ "steem", "blockchain", "wise" ],
    npmAuthor: "The Wise Team (https://wise-team.io/)",
    license: "MIT",
    wiseHomepage: "https://wise.vote/",
    githubOrgName: "wise-team",
    manualUrl: "https://wise.vote/introduction",
    chatUrl: "https://discordapp.com/invite/CwxQDbG",
    sqlEndpointHost: "sql.wise.vote",
    badges: [],
    generateHelpUsMd: () => {},
    generateHelpMd: () => {}
};



// badges:
config.badges.push((data: any) => "[![License](https://img.shields.io/github/license/" + d(config.githubOrgName) + "/" + d(data.repository.name) + ".svg?style=flat-square)](https://github.com/" + d(config.githubOrgName) + "/" + d(data.repository.name) + "/blob/master/LICENSE)");
config.badges.push((data: any) => "[![Chat](https://img.shields.io/badge/chat%20on%20discord-6b11ff.svg?style=flat-square)](" + d(config.chatUrl) + ")");
config.badges.push((data: any) => { // wise operations count badge:
    const apiUrl = "http://" + d(config.sqlEndpointHost) + ":/operations?select=count";
    const jsonPathQuery = "$[0].count";
    const apiLink = "http://" + d(config.sqlEndpointHost) + "/operations?select=moment,delegator,voter,operation_type&order=moment.desc";

    return "[![Wise operations count](https://img.shields.io/badge/dynamic/json.svg?label=wise%20operations%20count&url="
                        + encodeURIComponent(apiUrl) + "&query=" + encodeURIComponent(jsonPathQuery) + "&colorB=blue&style=flat-square)](" + apiLink + ")";
});



// README templates:
const helpUsTemplateMd = d(fs.readFileSync(__dirname + "/wise-config/help-us-template.md", "UTF-8"));
config.generateHelpUsMd = (data: any) => {
    return helpUsTemplateMd
            .replace(new RegExp("{githubOrgName}", "g"), config.githubOrgName)
            .replace(new RegExp("{repositoryName}", "g"), data.repository.name);
};

const helpTemplateMd = d(fs.readFileSync(__dirname + "/wise-config/help-template.md", "UTF-8"));
config.generateHelpMd = (data: any) => {
    return helpTemplateMd
            .replace(new RegExp("{githubOrgName}", "g"), config.githubOrgName)
            .replace(new RegExp("{manualUrl}", "g"), config.manualUrl)
            .replace(new RegExp("{chatUrl}", "g"), config.chatUrl)
            .replace(new RegExp("{repositoryName}", "g"), data.repository.name);
};




// Utils:
function d <T> (input: T | undefined): T {
    if (typeof input !== "undefined") return input;
    else throw new Error("Input value is undefined (d() fn)");
}

export default config;