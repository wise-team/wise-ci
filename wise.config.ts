/* tslint:disable no-null-keyword */
import * as fs from "fs";
import * as _ from "lodash";

function d <T> (input: T | undefined): T {
    if (typeof input !== "undefined") return input;
    else throw new Error("Input value is undefined (d() fn)");
}

export class Config {
    license = {
        code: "MIT"
    };

    wise = {
        version: "2.2.2",
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
            // looks like we got banned at wise.vote server IP { url: "https://steemd.privex.io", get_block: true }
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

    environments = {
        production: {
            host: "wise.vote",
            protocol: "https"
        },
        staging: {
            host: "dev.wise.vote",
            protocol: "http"
        }
    };

    npm = {
        node: { version: "10.12" },
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
            badges: [
                (data: any) => ({
                    title: "License",
                    image: "https://img.shields.io/github/license/" + d(data.config.repository.github.organization) + "/" + d(data.repository.name) + ".svg?style=flat-square",
                    link: "https://github.com/" + d(data.config.repository.github.organization) + "/" + d(data.repository.name) + "/blob/master/LICENSE"
                }),
                (data: any) => ({
                    title: "PRs Welcome",
                    image: "https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square",
                    link: "http://makeapullrequest.com"
                }),
                (data: any) => ({ // [![]()](" + + ")"
                    title: "Chat",
                    image: "https://img.shields.io/badge/chat%20on%20" + d(data.config.communitation.chat.name) + "-6b11ff.svg?style=flat-square",
                    link: d(data.config.communitation.chat.url)
                }),
                (data: any) => ({
                    title: "Wise operations count",
                    image: "https://img.shields.io/badge/dynamic/json.svg?label=wise%20operations%20count"
                        + "&url=" + encodeURIComponent(d(data.config.sql.url.production) + "operations?select=count")
                        + "&query=" + encodeURIComponent("$[0].count")
                        + "&colorB=blue&style=flat-square",
                    link: d(data.config.sql.url.production) + "operations?select=moment,delegator,voter,operation_type&order=moment.desc"
                }),
            ],
            generateDefaultBadges: (data: any) => {
                let npmBadge: string = "";
                if (data.npm) npmBadge = "[![npm](https://img.shields.io/npm/v/" + d(data.npm.package) + ".svg?style=flat-square)](https://www.npmjs.com/package/" + d(data.npm.package) + ") ";
                return "\n" + npmBadge
                    + config.repository.readme.badges.map((badge: any) => {
                        const badgeObj = badge(data, d);
                        return "[![" + badgeObj.title + "](" + badgeObj.image + ")](" + badgeObj.link + ")";
                    }).join(" ") + "\n";
            },
            generateHelpUsMd: (data: any) => {
                const helpUsTemplateMd = d(fs.readFileSync(__dirname + "/wise-config/help-us-template.md", "UTF-8"));
                return helpUsTemplateMd
                        .replace(new RegExp("{githubOrgName}", "g"), d(config.repository.github.organization))
                        .replace(new RegExp("{repositoryName}", "g"), d(data.repository.name))
                        .replace(new RegExp("{witnessAccount}", "g"), d(data.config.witness.account));
            },
            generateHelpMd: (data: any) => {
                const helpTemplateMd = d(fs.readFileSync(__dirname + "/wise-config/help-template.md", "UTF-8"));
                return helpTemplateMd
                        .replace(new RegExp("{githubOrgName}", "g"), config.repository.github.organization)
                        .replace(new RegExp("{manualUrl}", "g"), config.manual.url.production)
                        .replace(new RegExp("{chatUrl}", "g"), config.communitation.chat.url)
                        .replace(new RegExp("{repositoryName}", "g"), data.repository.name);
            },
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
        // the following param sets the protocol and domain. If you change it, the server configuration changes
        url: _.mapValues(this.environments, env => env.protocol + "://sql." + env.host + "/"),
        protocol: {
            version: "1.0",
            maxRowsPerPage: 1000
        },
        pusher: {
            requestConcurrencyPerNode: 3,
            blockProcessingTimeoutMs: 9000
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
                },
                api_proxy: {
                    name: "wise_sql_api_proxy",
                    container: "wise_sql_api_proxy"
                },
            },
            volumes: {
                db: { name: "pgdata" }
            }
        }
    };

    manual = {
        // this does not set the host nor the port, it is only referenced in docs and so on
        url: _.mapValues(this.environments, env => env.protocol + "://" + env.host + "/introduction"),
        docker: {
            services: {
                frontend: {
                    name: "frontend",
                    container: "wise-manual",
                    image: this.docker.imageHostname + "/manual",
                    port: 4000 // this is used in caddy config
                }
            }
        }
    };

    votingPage = {
        // this does not set the host nor the port, it is only referenced in docs and so on
        url: _.mapValues(this.environments, env => env.protocol + "://" + env.host + "/voting-page"),
        docker: {
            services: {
                frontend: {
                    name: "site",
                    container: "voting-page",
                    image: this.docker.imageHostname + "/voting-page",
                    port: 8080 // this is used in caddy config
                }
            }
        }
    };

    hub = {
        // the following param sets the protocol and domain. If you change it, the server configuration changes
        url: _.mapValues(this.environments, env => env.protocol + "://hub." + env.host + "/"),
        visual: {
            read: {
                lastActivity: {
                    numOfOpsToShow: 50,
                    trxLinkBase: "https://steemd.com/tx/{trx}",
                    articleLinkBase: "https://steemit.com/@{author}/{permlink}"
                }
            }
        },
        docker: {
            services: {
                frontend: {
                    name: "frontend",
                    container: "wise-hub-frontend",
                    image: this.docker.imageHostname + "/wise-hub-frontend"
                }
            },
        }
    };

    test = {
        healthcheck: {
            metrics: {
                periodMs: 3 * 24 * 3600 * 1000 // 3 days
            },
            hostedLogs: {
                // the following param sets the protocol and domain. If you change it, the server configuration changes
                url: _.mapValues(this.environments, env => env.protocol + "://test." + env.host + "/"),
            },
            docker: {
                services: {
                    hostedLogs: {
                        name: "wise_healthcheck_hosted_logs",
                        container: "wise_healthcheck_hosted_logs"
                    }
                }
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
                // it sends private messages only once, when a test turns red. Requires a slack ID (can be found in profile settings)
                mentionUsers: [ /* jblew -> */"UAEGKTY3T", /* noisy -> */"UASN9CGJ0" ],
                webhookUrlFilePath: "/opt/wise/slackWebhook.url"
            }
        },
        websites: {
            brokenLinks: {
                excludes: [ "*linkedin.com*", "*/operations?select=moment,delegator,voter,operation_type&order=moment.desc" ]
            },
            forbiddenPhrases: [ "noisy-witness", "noisy witness", "smartvote", "muon"]
        }
    };

    websites = [
        { url: this.wise.homepage, checkBrokenLinks: true },
        { url: this.team.website.url, checkBrokenLinks: true },
        { url: this.manual.url.production, checkBrokenLinks: false /* it is a part of wise homepage */ },
    ];

    steemconnect = {
        owner: {
            account: "wise.vote",
            profile: { name: "Wise", website: this.wise.homepage },
            last_account_update: "2018-10-22T13:31:54",
            last_owner_update: "2018-10-22T13:31:54",
            keys: {
                owner: "STM5qMTthdfQMQREDNxjz3zsKBRY15SfLToNnzPM7RwWddiHwD3Xq",
                active: [
                    "STM8jjcuFn1F96eq8ssbtT7UDJpu8AmkR4sgXBhPT7TCUVaozb57q",
                    "STM8YvYn5ykLo1eKkPvVu7jx6Ko3MYjVQ4zP4GRx3JKcBauAk5nHf"
                ],
                posting: [
                    "STM6Xs8WxmVHpf4EBKE3eA2v1J3H9PappSpnGDV8JatuLpJbz436Z",
                    "STM7NuCMemrJ6FJza1Ky733AAbwL5dnzAE7jnLEi4waroH8ZoQCof"
                ],
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
                this.votingPage.url.production,
                this.hub.url.production,
              // TODO decide wheather add staging urls to steemconnect (could be dangerous)
              /*... _.values(this.votingPage.url),
              ... _.values(this.hub.url),*/
              "http://localhost:8080/"
            ],
            name: "WISE",
            description: "Vote delegation system for STEEM blockchain: " + this.wise.homepage,
            icon: this.wise.homepage + "assets/wise-full-color-icon-128.png",
            website: this.wise.homepage,
            beneficiaries: null,
            is_public: true,
            is_disabled: false,
            created_at: "2018-07-06T09:53:05.827Z",
            updated_at: "2018-10-16T15:00:15.365Z"
          }
    };
}

export const config = new Config();