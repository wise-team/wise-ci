/* tslint:disable no-null-keyword */
import * as fs from "fs";
import * as _ from "lodash";

function d<T>(input: T | undefined): T {
  if (typeof input !== "undefined") return input;
  else throw new Error("Input value is undefined (d() fn)");
}

export class Config {
  license = {
    code: "MIT"
  };

  wise = {
    version: "3.1.1",
    Dhomepage: "https://wise.vote/"
  };

  steem = {
    minimalApiBlockchainVersion: "0.20.5",
    minimalApiHardforkVersion: "0.20.0",
    defaultApiUrl: "https://anyx.io",
    apis: [
      { url: "https://api.steemit.com", get_block: true },
      // temporarily disable, but works { url: "https://steemd.minnowsupportproject.org", get_block: true },
      // not working on SQL: { url: "https://rpc.buildteam.io", get_block: true },
      { url: "https://anyx.io", get_block: true }
      // { url: "https://rpc.usesteem.com/", get_block: false }
      // temporarily disable but works { url: "https://rpc.steemliberator.com", get_block: true }, /* http (plain) also works */
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
    ],
    waitForNextHeadBlockDelayMs: 3100
  };

  witness = {
    account: "wise-team"
  };

  team = {
    name: "Wise Team",
    website: { url: "https://wise-team.io/" },
    steem: { account: "wise-team" },
    securityEmail: "contact@wiseteam.io"
  };

  environments = {
    production: {
      host: "wise.vote",
      protocol: "https",
      deployBranch: "master",
      certbot: { email: "noisy.pl@gmail.com" }
    },
    staging: {
      host: "staging.wise.vote",
      protocol: "https",
      deployBranch: "staging",
      certbot: { email: "jedrzejblew@gmail.com" }
    }
  };

  npm = {
    node: { version: "10.15" },
    keywords: ["steem", "blockchain", "wise"],
    author: "The " + this.team.name + " (" + this.team.website.url + ")"
  };

  docker = {
    imageHostname: "wise",
    maintainer:
      "The " +
      this.team.name +
      " (" +
      this.team.website.url +
      ") <" +
      this.team.securityEmail +
      ">",
    labels: {
      domain: "vote.wise",
      defaultLabels: [
        (data: any) => 'maintainer="' + d(data.config.docker.maintainer) + '"',
        (data: any) =>
          d(data.config.docker.labels.domain) +
          '.wise-version="' +
          this.wise.version +
          '"',
        (data: any) =>
          d(data.config.docker.labels.domain) +
          '.license="' +
          this.license.code +
          '"',
        (data: any) =>
          d(data.config.docker.labels.domain) +
          '.repository="' +
          d(data.repository.name) +
          '"'
      ]
    },
    generateDockerfileFrontMatter: (data: any) =>
      d(data.config.docker.labels.defaultLabels)
        .map((label: (data: any) => string) => "LABEL " + label(data))
        .join("\n")
  };

  repository = {
    github: { organization: "wise-team" },
    readme: {
      badges: [
        (data: any) => ({
          title: "License",
          image:
            "https://img.shields.io/github/license/" +
            d(data.config.repository.github.organization) +
            "/" +
            d(data.repository.name) +
            ".svg?style=flat-square",
          link:
            "https://github.com/" +
            d(data.config.repository.github.organization) +
            "/" +
            d(data.repository.name) +
            "/blob/master/LICENSE"
        }),
        (data: any) => ({
          title: "PRs Welcome",
          image:
            "https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square",
          link: "http://makeapullrequest.com"
        }),
        (data: any) => ({
          // [![]()](" + + ")"
          title: "Chat",
          image:
            "https://img.shields.io/badge/chat%20on%20" +
            d(data.config.communitation.chat.name) +
            "-6b11ff.svg?style=flat-square",
          link: d(data.config.communitation.chat.url)
        }),
        (data: any) => ({
          title: "Wise operations count",
          image:
            "https://img.shields.io/badge/dynamic/json.svg?label=wise%20operations%20count" +
            "&url=" +
            encodeURIComponent(
              d(data.config.sql.url.production) + "operations?select=count"
            ) +
            "&query=" +
            encodeURIComponent("$[0].count") +
            "&colorB=blue&style=flat-square",
          link:
            d(data.config.sql.url.production) +
            "operations?select=moment,delegator,voter,operation_type&order=moment.desc"
        })
      ],
      generateDefaultBadges: (data: any) => {
        let npmBadge: string = "";
        if (data.npm)
          npmBadge =
            "[![npm](https://img.shields.io/npm/v/" +
            d(data.npm.package) +
            ".svg?style=flat-square)](https://www.npmjs.com/package/" +
            d(data.npm.package) +
            ") ";
        return (
          "\n" +
          npmBadge +
          config.repository.readme.badges
            .map((badge: any) => {
              const badgeObj = badge(data, d);
              return (
                "[![" +
                badgeObj.title +
                "](" +
                badgeObj.image +
                ")](" +
                badgeObj.link +
                ")"
              );
            })
            .join(" ") +
          "\n"
        );
      },
      generateHelpUsMd: (data: any) => {
        const helpUsTemplateMd = d(
          fs.readFileSync(
            __dirname + "/wise-config/help-us-template.md",
            "UTF-8"
          )
        );
        return helpUsTemplateMd
          .replace(
            new RegExp("{githubOrgName}", "g"),
            d(config.repository.github.organization)
          )
          .replace(new RegExp("{repositoryName}", "g"), d(data.repository.name))
          .replace(
            new RegExp("{securityEmail}", "g"),
            config.team.securityEmail
          )
          .replace(
            new RegExp("{witnessAccount}", "g"),
            d(data.config.witness.account)
          );
      },
      generateHelpMd: (data: any) => {
        const helpTemplateMd = d(
          fs.readFileSync(__dirname + "/wise-config/help-template.md", "UTF-8")
        );
        return helpTemplateMd
          .replace(
            new RegExp("{githubOrgName}", "g"),
            config.repository.github.organization
          )
          .replace(new RegExp("{manualUrl}", "g"), config.manual.url.production)
          .replace(new RegExp("{chatUrl}", "g"), config.communitation.chat.url)
          .replace(
            new RegExp("{securityEmail}", "g"),
            config.team.securityEmail
          )
          .replace(new RegExp("{repositoryName}", "g"), data.repository.name);
      }
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
      },
      typesForSteemJs: {
        name: "types-for-steem-js",
        isNode: false,
        isNpm: true,
        nodePath: ""
      }
    }
  };

  vault = {
    servers: {
      production: { url: "https://vault.wise.vote:8200" },
      staging: { url: "https://vault.staging.wise.vote:8200" }
    },
    url: "https://127.0.0.1:8200",
    backendFilePath: "/opt/wise/vault/Vaultfile",
    docker: {
      network: "vault-net",
      services: {
        vault: {
          name: "vault",
          container: "wise-vault",
          image: this.docker.imageHostname + "/vault"
        }
      }
    },
    unseal: {
      secret_shares: 4,
      secret_threshold: 2
    },
    auths: {
      AppRole: {
        type: "approle",
        description: "Docker service login",
        config: {}
      },
      userpass: {
        type: "userpass",
        description: "User login",
        config: {
          ttl: "20m",
          max_ttl: "30m"
        }
      }
      /*Github: {
                type: "github",
                description: "Authenticate devs via github",
                config: {
                    organization: "wise-team",
                    ttl: "20m",
                    max_ttl: "30m"
                }
            }*/
    },
    users: [
      { username: "jblew", policies: ["admin"] },
      { username: "noisy", policies: ["admin"] }
    ],
    policies: (config: Config) => [
      config.hub.vault.policies.api,
      config.hub.vault.policies.publisher
    ],
    roles: (config: Config) => [
      config.hub.docker.services.api.appRole,
      config.hub.docker.services.publisher.appRole
    ],
    secrets: {
      humanEnter: {
        steemConnectClientId: {
          description: "Steemconnect client_id",
          key: "/human/steemconnect/client_id"
        }
      },
      generated: {
        sessionSalt: "/generated/session/salt"
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
    url: _.mapValues(
      this.environments,
      env => env.protocol + "://sql." + env.host + "/"
    ),
    port: 8094,
    protocol: {
      version: "1.0",
      maxRowsPerPage: 1000
    },
    pusher: {
      requestConcurrencyPerNode: 3,
      blockProcessingTimeoutMs: 9000,
      nextBlockDelayMs: this.steem.waitForNextHeadBlockDelayMs
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
          container: "wise-sql-postgrest",
          port: 9002
        },
        api_proxy: {
          name: "wise_sql_api_proxy",
          container: "wise_sql_api_proxy"
        }
      },
      volumes: {
        db: { name: "pgdata" }
      }
    }
  };

  manual = {
    url: _.mapValues(
      this.environments,
      env => env.protocol + "://docs." + env.host + "/introduction"
    ),
    port: 8096,
    docker: {
      services: {
        frontend: {
          name: "frontend",
          container: "wise-manual",
          image: this.docker.imageHostname + "/manual"
        }
      }
    }
  };

  votingPage = {
    port: 8093,
    url: _.mapValues(
      this.environments,
      env => env.protocol + "://" + env.host + "/voting-page/"
    ),
    docker: {
      services: {
        frontend: {
          name: "site",
          container: "voting-page",
          image: this.docker.imageHostname + "/voting-page"
        }
      }
    }
  };

  hub = {
    // the following param sets the protocol and domain. If you change it, the server configuration changes
    url: _.mapValues(
      this.environments,
      env => env.protocol + "://" + env.host + "/"
    ),
    port: 8095,
    visual: {
      read: {
        lastActivity: {
          trxLinkBase: "https://steemd.com/tx/{trx}",
          articleLinkBase: "https://steemit.com/@{author}/{permlink}"
        }
      }
    },
    api: {
      cookie: {
        maxAgeMs: 7 * 24 * 60 * 60 * 1000
      }
    },
    daemon: {
      log: {
        maxHistoryLength: 1000
      }
    },
    urls: {
      api: {
        base: "/api",
        auth: {
          login: {
            scope: {
              empty: "/api/auth/login/scope/empty",
              custom_json: "/api/auth/login/scope/custom_json",
              custom_json_vote_offline:
                "/api/auth/login/scope/custom_json/vote/offline"
            }
          },
          callback: "/api/auth/callback",
          logout: "/api/auth/logout",
          revoke_all: "/api/auth/revoke_all",
          test_login: "/api/auth/test_login"
        },
        user: {
          base: "/api/user",
          settings: "/api/user/settings"
        },
        accounts: {
          base: "/api/accounts"
        }
      }
    },
    docker: {
      images: {
        backend: {
          name: this.docker.imageHostname + "/hub-backend"
        }
      },
      services: {
        nginx: {
          name: "nginx"
          // container: "wise-hub-serve"
        },
        redis: {
          name: "redis",
          // container: "wise-hub-redis",
          volume: "wise_hub_redis"
        },
        api: {
          name: "api",
          // container: "wise-hub-api",
          appRole: {
            role: "wise-hub-api",
            policies: (config: Config) => [config.hub.vault.policies.api.name]
          },
          secrets: {
            appRoleId: "hub-api-approle-id",
            appRoleSecret: "hub-api-approle-secret"
          }
        },
        daemon: {
          name: "daemon"
          // container: "wise-hub-daemon",
        },
        publisher: {
          name: "publisher",
          // container: "wise-hub-publisher",
          appRole: {
            role: "wise-hub-publisher", // TODO rename
            policies: (config: Config) => [
              config.hub.vault.policies.publisher.name
            ]
          },
          secrets: {
            appRoleId: "hub-publisher-approle-id",
            appRoleSecret: "hub-publisher-approle-secret"
          }
        },
        realtime: {
          name: "realtime",
          // container: "wise-hub-realtime",
          port: 8099
        }
      }
    },
    vault: {
      secrets: {
        users: "/hub/steemconnect/users",
        userProfiles: "/hub/steemconnect/users/profiles",
        accessTokens: "/hub/steemconnect/users/access_tokens",
        refreshTokens: "/hub/steemconnect/users/refresh_tokens"
      },
      policies: {
        // TODO publish these policies to production and staging
        api: {
          name: "wise-hub-api",
          policy: (config: Config) => `
                    path "secret/hub/public/*" { capabilities = ["create", "read", "update", "delete", "list"] }
                    path "secret${
                      config.vault.secrets.humanEnter.steemConnectClientId.key
                    }" { capabilities = [ "read" ] }
                    path "secret${
                      config.vault.secrets.generated.sessionSalt
                    }" { capabilities = [ "read" ] }
                    path "secret${
                      config.hub.vault.secrets.userProfiles
                    }/*" { capabilities = [ "create", "read", "update", "delete", "list" ] }
                    path "secret${
                      config.hub.vault.secrets.accessTokens
                    }/*" { capabilities = [ "create", "read", "update", "delete" ] }
                    path "secret${
                      config.hub.vault.secrets.refreshTokens
                    }/*" { capabilities = [ "create", "read", "update", "delete" ] }
                    `
        },
        publisher: {
          name: "wise-hub-publisher", // TODO rename
          policy: (config: Config) => `
                    path "secret/hub/public/*" { capabilities = ["create", "read", "update", "delete", "list"] }
                    path "secret${
                      config.vault.secrets.humanEnter.steemConnectClientId.key
                    }" { capabilities = [ "read" ] }
                    path "secret${
                      config.hub.vault.secrets.users
                    }/*" { capabilities = [ "create", "read", "update", "delete", "list" ] }
                    path "secret${
                      config.hub.vault.secrets.accessTokens
                    }/*" { capabilities = [ "read", "update" ] }
                    path "secret${
                      config.hub.vault.secrets.refreshTokens
                    }/*" { capabilities = [ "read" ] }
                    `
        }
      }
    }
  };

  test = {
    healthcheck: {
      metrics: {
        periodMs: 3 * 24 * 3600 * 1000 // 3 days
      },
      hostedLogs: {
        // the following param sets the protocol and domain. If you change it, the server configuration changes
        url: _.mapValues(
          this.environments,
          env => env.protocol + "://test." + env.host + "/"
        ),
        port: 8097
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
        browsers: ["firefox"]
      },
      api: {
        testThroughProxy: false
      },
      log: {
        dockerVolume: "wise.test.logs"
      },
      slack: {
        // it sends private messages only once, when a test turns red. Requires a slack ID (can be found in profile settings)
        mentionUsers: [/* jblew -> */ "UAEGKTY3T", /* noisy -> */ "UASN9CGJ0"],
        webhookUrlFilePath: "/opt/wise/slackWebhook.url"
      }
    },
    websites: {
      brokenLinks: {
        excludes: [
          "*linkedin.com*",
          "*/operations?select=moment,delegator,voter,operation_type&order=moment.desc"
        ]
      },
      forbiddenPhrases: ["noisy-witness", "noisy witness", "smartvote", "muon"]
    }
  };

  utils = {
    createdAccounts: {
      port: 8092,
      url: _.mapValues(
        this.environments,
        env => env.protocol + "://" + env.host + "/"
      )
    }
  };

  proxy = {
    docker: {
      container: "wise-proxy"
    }
  };

  websites = [
    { url: this.wise.homepage, checkBrokenLinks: true },
    { url: this.team.website.url, checkBrokenLinks: true },
    {
      url: this.manual.url.production,
      checkBrokenLinks: false /* it is a part of wise homepage */
    }
  ];

  steemconnect = {
    oauth2Settings: {
      baseAuthorizationUrl: "https://steemconnect.com/oauth2/authorize",
      tokenUrl: "https://steemconnect.com/api/oauth2/token",
      tokenRevocationUrl: "https://steemconnect.com/api/oauth2/token/revoke"
    },
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
      production: {
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
            this.hub.url.production + "api/auth/callback"
          ],
          name: "WISE",
          description:
            "Vote delegation system for STEEM blockchain: " +
            this.wise.homepage,
          icon:
            "https://wise.vote/wise-assets/wise/wise-logo-color_128x128.png",
          website: this.wise.homepage,
          beneficiaries: null,
          is_public: true,
          is_disabled: false,
          created_at: "2018-07-06T09:53:05.827Z",
          updated_at: "2018-12-19T15:50:35.436Z"
        }
      },
      staging: {
        app: {
          account: "wisevote.staging",
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
          id: 718,
          client_id: "wisevote.staging",
          owner: "wise.vote",
          redirect_uris: [
            this.votingPage.url.staging,
            this.hub.url.staging + "api/auth/callback",
            "http://localhost:8080",
            "http://localhost:8080/api/auth/callback"
          ],
          name: "Staging WISE",
          description: "Staging WISE",
          icon:
            "https://wise.vote/wise-assets/wise/wise-logo-color_128x128.png",
          website: this.hub.url.staging,
          beneficiaries: null,
          is_public: false,
          is_disabled: false,
          created_at: "2018-12-14T10:47:57.939Z",
          updated_at: "2018-12-19T16:07:48.365Z"
        }
      }
    }
  };

  urls = {
    voteForWitness: "https://steemit.com/~witnesses",
    daemonInstallationInstructions: "https://docs.wise.vote/installation"
  };
}

export const config = new Config();
