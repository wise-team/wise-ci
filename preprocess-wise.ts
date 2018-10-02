import { SourcePreprocessor as SP, d } from "./src/src-preprocessor";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

async function run() {
    const config: any = (await import(__dirname + "/wise.config.ts")).default;
    console.log(config);
    // if (!config) throw new Error("Config could not be found");

    const data = { config: config };
    const preprocessor = new SP("..");

    await preprocessor.preprocess(data, [
        // Repository rules
        SP.hooks.ensureChildFile(
            SP.filters.directoryHasChild(".git"), 
            "LICENSE",
            fs.readFileSync(__dirname + "/LICENSE", "UTF-8")
            .replace(
                /^Copyright \(c\) \d\d\d\d(-\d\d\d\d)? .*$/gmu,
                "Copyright (c) 2018" + ((new Date()).getFullYear() === 2018 ? "" : "-" + (new Date()).getFullYear()) + " "
                + d(config.githubOrgName)
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
            ("v" + d(config.nodeVersion))
        ),

        // package.json rules
        SP.hooks.jsonPathRules(
            SP.filters.isFileNamed("package.json"),
            [
                ["$.version", (obj, value) => d(config.wiseVersion)],
                ["$.engines.node", (obj, value) => ">=" + d(config.nodeVersion)],
                ["$.repository.type", (obj, value) => "git"],
                ["$.repository.url", (obj, value) => "git+https://github.com/" + d(config.githubOrgName) + "/" + obj.name + ".git"],
                ["$.keywords", (obj, value) => d(config.npmKeywords)],
                ["$.author", (obj, value) => d(config.npmAuthor)],
                ["$.license", (obj, value) => d(config.license)],
                ["$.homepage", (obj, value) => d(config.wiseHomepage)],
                ["$.bugs.url", (obj, value) => "https://github.com/" + d(config.githubOrgName) + "/" + obj.name + "/issues"],
            ]
        ),
    ])
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

run();