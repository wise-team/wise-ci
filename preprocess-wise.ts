import { SourcePreprocessor as SP, d } from "./src/src-preprocessor";
import { Config, config } from "./wise.config";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";


async function run(basePath: string) {
    console.log(JSON.stringify(config, undefined, 2));
    if (!config) throw new Error("Config could not be found");

    const data = { config: config };
    const preprocessor = new SP(basePath);

    await preprocessor.preprocess(data, [
        // Repository rules
        SP.hooks.ensureChildFile(
            SP.filters.directoryHasChild(".git"),
            "LICENSE",
            fs.readFileSync(__dirname + "/LICENSE", "UTF-8")
            .replace(
                /^Copyright \(c\) \d\d\d\d(-\d\d\d\d)? .*$/gmu,
                "Copyright (c) 2018" + ((new Date()).getFullYear() === 2018 ? "" : "-" + (new Date()).getFullYear()) + " "
                + d(config.repository.github.organization)
            )
        ),
        SP.hooks.ensureChildFile(
            SP.filters.directoryHasChild(".git"),
            "CODE_OF_CONDUCT.md", fs.readFileSync(__dirname + "/CODE_OF_CONDUCT.md", "UTF-8")
        ),
        SP.hooks.ensureChildDirectory(
            SP.filters.directoryHasChild(".git"),
            ".github"
        ),
        SP.hooks.ensureChildFile(
            SP.filters.directoryHasChild(".github"),
            ".github/ISSUE_TEMPLATE.md", fs.readFileSync(__dirname + "/.github/ISSUE_TEMPLATE.md", "UTF-8")
        ),
        SP.hooks.ensureChildFile(
            SP.filters.directoryHasChild(".github"),
            ".github/PULL_REQUEST_TEMPLATE.md", fs.readFileSync(__dirname + "/.github/PULL_REQUEST_TEMPLATE.md", "UTF-8")
        ),

        // npm project rules
        SP.hooks.ensureChildFile(
            SP.filters.directoryHasChild("package.json"),
            ".nvmrc",
            ("v" + d(config.npm.node.version))
        ),

        SP.hooks.regexpReplace(
            SP.filters.isFileNamed(".nvmrc"),
            /^.*$/gui, ("v" + d(config.npm.node.version))
        ),

        // package.json rules
        SP.hooks.jsonPathRules(
            SP.filters.isFileNamed("package.json"),
            [
                // ["$.version", (obj, value) => d(config.wise.version), {}],
                ["$.engines.node", (obj, value) => ">=" + d(config.npm.node.version), {}],
                ["$.repository.type", (obj, value) => "git", {}],
                ["$.repository.url", (obj, value, data) => "git+https://github.com/" + d(config.repository.github.organization) + "/" + d(data.repository.name) + ".git", {}],
                ["$.keywords", (obj, value) => d(config.npm.keywords), {}],
                ["$.author", (obj, value) => d(config.npm.author), {}],
                ["$.license", (obj, value) => d(config.license.code), {}],
                ["$.homepage", (obj, value) => d(config.wise.homepage), {}],
                ["$.bugs.url", (obj, value, data) => "https://github.com/" + d(config.repository.github.organization) + "/" + d(data.repository.name) + "/issues", {}],
                // ["$.dependencies[\"steem-wise-core\"]", (obj, value, data) => "^" + d(config.wise.version), { doNotCreate: true }],
            ]
        ),

        // package-lock.json rules
        SP.hooks.jsonPathRules(
            SP.filters.isFileNamed("package-lock.json"),
            [
                // ["$.version", (obj, value) => d(config.wise.version), {}],
            ]
        ),

        // .dockerignore file
        SP.hooks.ensureChildFile(
            SP.filters.directoryHasChild("Dockerfile"),
            ".dockerignore",
            "/node_modules\n/dist"
        ),
    ],
    // exclude:
    [ ".vscode" ])
    .then(
        () => {
            console.log("Preprocessing done");
        },
        (error) => {
            console.error("Preprocessing failed");
            console.error(error);
            process.exit(1);
        }
    );
}

const args = process.argv.slice(2);
if (args.length === 0) {
    throw new Error("You must specify path");
}
const basePath = args[0];
run(basePath);