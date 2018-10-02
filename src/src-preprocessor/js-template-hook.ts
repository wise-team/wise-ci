import * as fs from "fs";
import * as paths from "path";
import * as vm from "vm";
import * as _ from "lodash";

import { SourcePreprocessor } from "./index";

export function jsTemplate (filter: (f: string) => boolean, dataObject: any): SourcePreprocessor.Hook {
    return async (f: string) => {
        if (!filter(f)) return;

        const primaryFileContents = fs.readFileSync(f, "UTF-8");
        let fileContents = primaryFileContents;

        fileContents = processBlockCommentsTemplates(
            fileContents, dataObject,
            /\/\*§([^§]*)§\*\/([^§]+)\/\*§([^§]*)§\*\//gmui,
            (left, value, right) => "/*" + "§" + left + "§" + "*/" + value + "/*" + "§" + right + "§" + "*/"
        );

        fileContents = processBlockCommentsTemplates(
            fileContents, dataObject,
            /<!--§([^§]*)§-->([^§]*)<!--§([^§]*)§-->/gmui,
            (left, value, right) => "<!--" + "§" + left + "§" + "-->" + value + "<!--" + "§" + right + "§" + "-->"
        );

        if (fileContents !== primaryFileContents) {
            fs.writeFileSync(f, fileContents);
            console.log("Modified " + f);
        }
    };
}


function executeTemplate(data: any, codeLeft: string, codeRight: string): string {
    const context = vm.createContext({
        data: _.cloneDeep(data)
    });
    const leftResult = (codeLeft.trim().length > 0) ? new vm.Script(codeLeft).runInContext(context) : "";
    const rightResult = (codeRight.trim().length > 0) ? new vm.Script(codeRight).runInContext(context) : "";
    return  leftResult + rightResult;
}


function processBlockCommentsTemplates(fileContents: string, dataObject: any, regex: RegExp, replacer: (left: string, value: string, right: string) => string): string {
    let m;
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
            newValue = executeTemplate(dataObject, left, right);
            console.log("§ result: `" + newValue + "`");

            const replacement = replacer(left, newValue, right);

            fileContents = fileContents.replace(wholeMatch, replacement);
        }
    }
    return fileContents;
}