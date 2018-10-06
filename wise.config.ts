import * as fs from "fs";

export class Config {
    license = {
        code: "MIT"
    };

    wise = {
        version: "1.2.2",
        homepage: "https://wise.vote/"
    };

    witness = {
        account: "wise-team"
    };

    team = {
        name: "Wise Team",
        website: { url: "https://wise-team.io/" },
        steem: { account: "wise-team" }
    };

    npm = {
        node: { version: "9.11" },
        keywords: [ "steem", "blockchain", "wise" ],
        author: "The " + this.team.name + " (" + this.team.website.url + ")",
    };

    repository = {
        github: { organization: "wise-team" },
        readme: {
            badges: [] as ((data: any) => string) [],
            generateHelpUsMd: (data: any) => "" ,
            generateHelpMd: (data: any) => "",
            generateDefaultBadges: (data: any) => "",
        }
    };

    communitation = {
        chat: {
            name: "discord",
            url: "https://discordapp.com/invite/CwxQDbG"
        }
    };

    sql = {
        endpoint: { host: "sql.wise.vote", schema: "http" }
    };

    manual = {
        url: "https://wise.vote/introduction"
    };

    hub = {
        production: { url: "http://wise.vote/" },
        development: { url: "http://portal.wise.vote/" }
    };
}

export const config = new Config();

// badges:
config.repository.readme.badges.push((data: any) => "[![License](https://img.shields.io/github/license/" + d(config.repository.github.organization) + "/" + d(data.repository.name) + ".svg?style=flat-square)](https://github.com/" + d(config.repository.github.organization) + "/" + d(data.repository.name) + "/blob/master/LICENSE)");
config.repository.readme.badges.push((data: any) => "[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)");
config.repository.readme.badges.push((data: any) => "[![Chat](https://img.shields.io/badge/chat%20on%20discord-6b11ff.svg?style=flat-square)](" + d(config.communitation.chat.url) + ")");
config.repository.readme.badges.push((data: any) => { // wise operations count badge:
    const apiUrl = "http://" + d(config.sql.endpoint.host) + ":/operations?select=count";
    const jsonPathQuery = "$[0].count";
    const apiLink = "http://" + d(config.sql.endpoint.host) + "/operations?select=moment,delegator,voter,operation_type&order=moment.desc";

    return "[![Wise operations count](https://img.shields.io/badge/dynamic/json.svg?label=wise%20operations%20count&url="
                        + encodeURIComponent(apiUrl) + "&query=" + encodeURIComponent(jsonPathQuery) + "&colorB=blue&style=flat-square)](" + apiLink + ")";
});
config.repository.readme.generateDefaultBadges = (data: any) => {
    let npmBadge: string = "";
    if (data.npm) npmBadge = "[![npm](https://img.shields.io/npm/v/" + d(data.npm.package) + ".svg?style=flat-square)](https://www.npmjs.com/package/" + d(data.npm.package) + ") ";
    return "\n" + npmBadge + config.repository.readme.badges.map((badge: any) => badge(data, d)).join(" ") + "\n";
};



// README templates:
const helpUsTemplateMd = d(fs.readFileSync(__dirname + "/wise-config/help-us-template.md", "UTF-8"));
config.repository.readme.generateHelpUsMd = (data: any) => {
    return helpUsTemplateMd
            .replace(new RegExp("{githubOrgName}", "g"), config.repository.github.organization)
            .replace(new RegExp("{repositoryName}", "g"), data.repository.name);
};

const helpTemplateMd = d(fs.readFileSync(__dirname + "/wise-config/help-template.md", "UTF-8"));
config.repository.readme.generateHelpMd = (data: any) => {
    return helpTemplateMd
            .replace(new RegExp("{githubOrgName}", "g"), config.repository.github.organization)
            .replace(new RegExp("{manualUrl}", "g"), config.manual.url)
            .replace(new RegExp("{chatUrl}", "g"), config.communitation.chat.url)
            .replace(new RegExp("{repositoryName}", "g"), data.repository.name);
};




// Utils:
function d <T> (input: T | undefined): T {
    if (typeof input !== "undefined") return input;
    else throw new Error("Input value is undefined (d() fn)");
}
