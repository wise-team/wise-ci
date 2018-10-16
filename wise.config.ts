import * as fs from "fs";

export class Config {
    license = {
        code: "MIT"
    };

    wise = {
        version: "1.2.2",
        homepage: "https://wise.vote/"
    };

    steem = {
        minimalApiBlockchainVersion: "0.20.5",
        minimalApiHardforkVersion: "0.20.0",
        defaultApiUrl: "https://api.steemit.com",
        apis: [
            { url: "https://api.steemit.com", get_block: true },
            { url: "https://steemd.minnowsupportproject.org", get_block: true },
            { url: "https://rpc.buildteam.io", get_block: true },
            { url: "https://rpc.steemliberator.com", get_block: true }, /* http (plain) also works */
            // unstable: { url: "wss://rpc.steemviz.com", get_block: true }, /* ws (plain) also works */
            { url: "https://steemd.privex.io", get_block: true },
            // worked, but stopped to work: { url: "wss://steemd.privex.io", get_block: true }, /* all protocols work: ws, wss, http, https */

            // check! { url: "wss://gtg.steem.house:8090", get_block: true },
            // check! { url: "wss://api.steem.house:8090", get_block: true },
            // check! { url: "https://api.steem.house", get_block: true },
            // check! { url: "wss://rpc.curiesteem.com", get_block: true }, /* ws (plain) also works */
            // check!  { url: "https://rpc.steemviz.com", get_block: true }, // Could not find method get_accounts

            // discontinued: { url: "http://steemd.steemit.com", get_block: true }, { url: "https://steemd.steemit.com", get_block: true }, { url: "ws://steemd.steemit.com", get_block: true }, { url: "wss://steemd.steemit.com", get_block: true },
            // inaccessible { url: "http://node.steem.ws ", get_block: true }, { url: "https://node.steem.ws ", get_block: true }, { url: "ws://node.steem.ws ", get_block: true }, { url: "wss://node.steem.ws ", get_block: true },
            // inaccessible { url: "http://this.piston.rocks", get_block: true }, { url: "https://this.piston.rocks", get_block: true }, { url: "ws://this.piston.rocks", get_block: true }, { url: "wss://this.piston.rocks", get_block: true },
            // 301: { url: "http://seed.bitcoiner.me", get_block: true }, { url: "https://seed.bitcoiner.me", get_block: true }, { url: "ws://seed.bitcoiner.me", get_block: true }, { url: "wss://seed.bitcoiner.me", get_block: true },
            // 502: { url: "http://appbasetest.timcliff.com", get_block: true }, { url: "https://appbasetest.timcliff.com", get_block: true }, { url: "ws://appbasetest.timcliff.com", get_block: true }, { url: "wss://appbasetest.timcliff.com", get_block: true },
            // inaccessible: { url: "http://appbase.buildteam.io", get_block: true }, { url: "https://appbase.buildteam.io", get_block: true }, { url: "ws://appbase.buildteam.io", get_block: true }, { url: "wss://appbase.buildteam.io", get_block: true },
        ]
    };

    witness = {
        account: "wise-team"
    };

    team = {
        name: "Wise Team",
        website: { url: "https://wise-team.io/" },
        steem: { account: "wise-team" },
        securityEmail: "jedrzejblew@gmail.com"
    };

    npm = {
        node: { version: "9.11" },
        keywords: [ "steem", "blockchain", "wise" ],
        author: "The " + this.team.name + " (" + this.team.website.url + ")",
    };

    docker = {
        imageHostname: "wise",
        maintainer: "The " + this.team.name + " (" + this.team.website.url + ") <" + this.team.securityEmail + ">",
        labels: {
            domain: "vote.wise",
            defaultLabels: [
                (data: any) => 'maintainer="' + d(data.config.docker.maintainer) + '"',
                (data: any) => d(data.config.docker.labels.domain) + '.wise-version="' + this.wise.version + '"',
                (data: any) => d(data.config.docker.labels.domain) + '.license="' + this.license.code + '"',
                (data: any) => d(data.config.docker.labels.domain) + '.repository="' + d(data.repository.name) + '"'
            ]
        },
        generateDockerfileFrontMatter: (data: any) => d(data.config.docker.labels.defaultLabels).map((label: (data: any) => string) => "LABEL " + label(data)).join("\n")
    };

    repository = {
        github: { organization: "wise-team" },
        readme: {
            badges: [] as ((data: any) => string) [],
            generateHelpUsMd: (data: any) => "" ,
            generateHelpMd: (data: any) => "",
            generateDefaultBadges: (data: any) => "",
        },
        repositories: {
            core: {
                name: "steem-wise-core",
                npmPackageName: "steem-wise-core",
                isNode: true,
                isNpm: true,
                nodePath: ""
            },
            cli: {
                name: "steem-wise-cli",
                isNode: true,
                npmPackageName: "steem-wise-cli",
                isNpm: true,
                nodePath: ""
            },
            voterPage: {
                name: "steem-wise-voter-page",
                isNode: false,
                isNpm: true,
                nodePath: ""
            },
            manual: {
                name: "steem-wise-manual",
                isNode: false,
                isNpm: false,
                nodePath: ""
            },
            sql: {
                name: "steem-wise-sql",
                isNode: true,
                isNpm: true,
                nodePath: "/pusher"
            },
            test: {
                name: "steem-wise-test",
                isNode: true,
                isNpm: true,
                nodePath: ""
            },
            hub: {
                name: "wise-hub",
                isNode: true,
                isNpm: true,
                nodePath: "/wise-hub-frontend"
            },
            ci: {
                name: "wise-ci",
                isNode: true,
                isNpm: true,
                nodePath: ""
            }

        }
    };

    communitation = {
        chat: {
            name: "discord",
            url: "https://discordapp.com/invite/CwxQDbG"
        }
    };

    sql = {
        pusher: {
            requestConcurrencyPerNode: 3,
            blockProcessingTimeoutMs: 9000
        },
        endpoint: {
            host: "sql.wise.vote",
            schema: "https" // http or https
        },
        docker: {
            services: {
                db: {
                    name: "wise_sql_db",
                    container: "wise_sql_db"
                },
                pusher: {
                    name: "wise_sql_pusher",
                    container: "wise-sql-pusher",
                    image: this.docker.imageHostname + "/sql-pusher"
                },
                postgrest: {
                    name: "postgrest",
                    container: "wise-sql-postgrest"
                }
            },
            volumes: {
                db: { name: "pgdata" }
            }
        }
    };

    manual = {
        url: "https://wise.vote/introduction"
    };

    hub = {
        production: {
            host: "hub.wise.vote",
            schema: "https" // http or https
        },
        visual: {
            read: {
                lastActivity: {
                    numOfOpsToShow: 50,
                    trxLinkBase: "https://steemd.com/tx/{trx}",
                    articleLinkBase: "https://steemit.com/@{author}/{permlink}"
                }
            }
        }
    };

    test = {
        healthcheck: {
            metrics: {
                periodMs: 3 * 24 * 3600 * 1000 // 3 days
            },
            inBrowserTests: {
                enabled: false,
                browsers: [ "firefox" ]
            },
            api: {
                testThroughProxy: false
            },
            log: {
                dockerVolume: "wise.test.logs"
            },
            slack: {
                mentionUsers: [ /* jblew: */"UAEGKTY3T" ], // it sends private messages only once, when a test turns red. Requires a slack ID (can be found in profile settings)
                webhookUrlFilePath: "/opt/wise/slackWebhook.url"
            }
        },
        websites: {
            brokenLinks: {
                excludes: [ "*linkedin.com*", this.sql.endpoint.schema + "://" + this.sql.endpoint.host + "/operations?select=moment,delegator,voter,operation_type&order=moment.desc" ]
            },
            forbiddenPhrases: [ "noisy-witness", "noisy witness", "smartvote", "muon"]
        }
    };

    websites = [
        { url: this.wise.homepage, checkBrokenLinks: true },
        { url: this.team.website.url, checkBrokenLinks: true },
        { url: this.manual.url, checkBrokenLinks: false /* it is a part of wise homepage */ },
    ];
}

export const config = new Config();

// badges:
config.repository.readme.badges.push((data: any) => "[![License](https://img.shields.io/github/license/" + d(config.repository.github.organization) + "/" + d(data.repository.name) + ".svg?style=flat-square)](https://github.com/" + d(config.repository.github.organization) + "/" + d(data.repository.name) + "/blob/master/LICENSE)");
config.repository.readme.badges.push((data: any) => "[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)");
config.repository.readme.badges.push((data: any) => "[![Chat](https://img.shields.io/badge/chat%20on%20discord-6b11ff.svg?style=flat-square)](" + d(config.communitation.chat.url) + ")");
config.repository.readme.badges.push((data: any) => { // wise operations count badge:
    const apiUrl = d(config.sql.endpoint.schema) + "://" + d(config.sql.endpoint.host) + ":/operations?select=count";
    const jsonPathQuery = "$[0].count";
    const apiLink = d(config.sql.endpoint.schema) + "://" + d(config.sql.endpoint.host) + "/operations?select=moment,delegator,voter,operation_type&order=moment.desc";

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
            .replace(new RegExp("{githubOrgName}", "g"), d(config.repository.github.organization))
            .replace(new RegExp("{repositoryName}", "g"), d(data.repository.name))
            .replace(new RegExp("{witnessAccount}", "g"), d(data.config.witness.account));
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
    steemconnect = {
        owner: {
            account: "wise.vote",
            profile: { name: "Wise", website: this.wise.homepage },
            last_account_update: "2018-07-06T09:47:06",
            last_owner_update: "1970-01-01T00:00:00",
            keys: {
                owner: "STM5qMTthdfQMQREDNxjz3zsKBRY15SfLToNnzPM7RwWddiHwD3Xq",
                active: "STM8jjcuFn1F96eq8ssbtT7UDJpu8AmkR4sgXBhPT7TCUVaozb57q",
                posting: "STM7NuCMemrJ6FJza1Ky733AAbwL5dnzAE7jnLEi4waroH8ZoQCof",
                memo: "STM7F9UXfVpwCbyqonyJawET2WC3jwnV2UT16ubkA7fgqmBDfYK4w"
            },
            recovery_account: "noisy"
        },
        app: {
            account: "wisevote.app",
            last_account_update: "1970-01-01T00:00:00",
            last_owner_update: "1970-01-01T00:00:00",
            keys: {
                owner: "STM82hFUKjN2j8KGqQ8rz9YgFAbMrWFuCPkabtrAnUfV2JQshNPLz",
                active: "STM78mV5drS6a5SredobAJXvzZv7tvBo4Cj15rumRcBtMzTWT173a",
                posting: "STM6ZVzWQvbYSzVpY2PRJHu7QSASVy8aB8xSVcJgx5seYGHPFvJkZ",
                memo: "STM7o1DigBaUEF28n2ap5PeY9Jqhndz3zWmF7xZ3zfRgSqeLaMnyA"
            },
            recovery_account: "wise.vote"
        },
        settings: {
            id: 493,
            client_id: "wisevote.app",
            owner: "wise.vote",
            redirect_uris: [
              this.votingPage.url + "/",
              this.hub.production.schema + "://" + this.hub.production.host + "/",
              "http://localhost:8080/"
            ],
            name: "WISE",
            description: "Vote delegation system for STEEM blockchain: " + this.wise.homepage,
            icon: this.wise.homepage + "assets/wise-full-color-icon-128.png",
            website: this.wise.homepage,
            beneficiaries: null,
            is_public: false,
            is_disabled: false,
            created_at: "2018-07-06T09:53:05.827Z",
            updated_at: "2018-09-21T13:20:47.021Z"
          }
    };
}
