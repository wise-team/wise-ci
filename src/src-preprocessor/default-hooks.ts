import * as fs from "fs";
import * as paths from "path";
import * as vm from "vm";
import * as _ from "lodash";
import * as jsonpath from "jsonpath";

import { SourcePreprocessor } from "./index";

export function ensureChildFile (filter: (f: string) => boolean, filename: string, fileContents: string): SourcePreprocessor.Hook {
    return async (f: string) => {
        if (!filter(f)) return;

        if (fs.lstatSync(f).isDirectory()) {
            const pathResolved = paths.resolve(f, filename);
            if (fs.existsSync(pathResolved)) {
                const currentContents = fs.readFileSync(pathResolved, "UTF-8");
                if (currentContents !== fileContents) {
                    fs.writeFileSync(pathResolved, fileContents);
                    console.log("Modified file " + pathResolved);
                }
            }
            else {
                fs.writeFileSync(pathResolved, fileContents);
                console.log("Modified file " + pathResolved);
            }
        }
    };
}

export function ensureChildDirectory (filter: (f: string) => boolean, dirname: string): SourcePreprocessor.Hook {
    return async (f: string) => {
        if (!filter(f)) return;

        if (fs.lstatSync(f).isDirectory()) {
            const pathResolved = paths.resolve(f, dirname);
            if (fs.existsSync(pathResolved)) {
                if (!fs.lstatSync(f).isDirectory()) throw new Error("File " + f + " has child " + dirname + ", but it is not a directory!");
            }
            else {
                fs.mkdirSync(pathResolved);
                console.log("Created dir " + pathResolved);
            }
        }
    };
}

export function jsonPathRules (filter: (f: string) => boolean, rules: [string, (obj: any, value: any) => any] []): SourcePreprocessor.Hook {
    return async (f: string) => {
        if (!filter(f)) return;

        const fileContents = fs.readFileSync(f, "UTF-8");
        const primaryObj = JSON.parse(fileContents);
        const obj = _.cloneDeep(primaryObj);
        rules.forEach(rule => {
            const matches: any [] = jsonpath.query(obj, rule[0]);
            if (matches.length === 0) {
                jsonpath.value(obj, rule[0], rule[1](obj, undefined));
            }
            else jsonpath.apply(obj, rule[0], (value) => rule[1](obj, value));
        });

        if (!_.isEqual(primaryObj, obj)) {
            const newFileContents = JSON.stringify(obj, undefined, 2);
            fs.writeFileSync(f, newFileContents);
            console.log("Modified " + f);
        }
    };
}

export function jsTemplate (filter: (f: string) => boolean, dataObject: any): SourcePreprocessor.Hook {
    return async (f: string) => {
        if (!filter(f)) return;

        const primaryFileContents = fs.readFileSync(f, "UTF-8");
        let fileContents = primaryFileContents;

        let m;

        // block comments
        const regex = /\/\*§([^§]*)§\*\/([^§]+)\/\*§([^§]*)§\*\//gmui;
        while ((m = regex.exec(fileContents)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (m.length >= 4) {
                const wholeMatch = m[0];
                console.log("§ Processing template " + wholeMatch);
                const left = m[1];
                const value = m[2];
                const right = m[3];

                let newValue = "";

                const context = vm.createContext({
                    data: _.cloneDeep(dataObject)
                });
                const leftResult = (left.trim().length > 0) ? new vm.Script(left).runInContext(context) : "";
                const rightResult = (right.trim().length > 0) ? new vm.Script(right).runInContext(context) : "";
                newValue = leftResult + rightResult;
                console.log("§ result: `" + newValue + "`");

                const replacement = "/*" + "§" + left + "§" + "*/" + newValue + "/*" + "§" + right + "§" + "*/";

                fileContents = fileContents.replace(wholeMatch, replacement);
            }
        }

        if (fileContents !== primaryFileContents) {
            fs.writeFileSync(f, fileContents);
            console.log("Modified " + f);
        }
    };
}
