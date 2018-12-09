import * as fs from "fs";
import * as paths from "path";
import * as vm from "vm";
import * as _ from "lodash";
import * as templateMethods from "./template-methods";
import { SourcePreprocessor } from "./index";

export function jsTemplate (filter: (f: string) => boolean, dataObject: any): SourcePreprocessor.Hook {
    return async (f: string, data: any) => {
        if (!filter(f)) return;

        try {
            const primaryFileContents = fs.readFileSync(f, "UTF-8");
            let fileContents = primaryFileContents;

            fileContents = processBlockCommentsTemplates(
                f, fileContents, dataObject,
                /()\/\*§([^§]*)§\*\/([^§]+)\/\*§([^§]*)§\.\*\//gmui,
                (whitespace, left, value, right) => "/*" + "§" + left + "§" + "*/" + value + "/*" + "§" + right + "§." + "*/"
            );

            fileContents = processBlockCommentsTemplates(
                f, fileContents, dataObject,
                /()<!--§([^§]*)§-->([^§]*)<!--§([^§]*)§\.-->/gmui,
                (whitespace, left, value, right) => "<!--" + "§" + left + "§" + "-->" + value + "<!--" + "§" + right + "§." + "-->"
            );

            fileContents = processBlockCommentsTemplates(
                f, fileContents, dataObject,
                /^(\s*)#§([^\n]*\n\s*)([^\n)]*)(\n)/gmui,
                (whitespace, left, value, right) => whitespace + "#" + "§" + left + value + right
            );

            fileContents = processBlockCommentsTemplates(
                f, fileContents, dataObject,
                /^(\s*)\/\/§([^\n]*\n\s*)([^\n)]*)(\n)/gmui,
                (whitespace, left, value, right) => whitespace + "//" + "§" + left + value + right
            );

            fileContents = processBlockCommentsTemplates(
                f, fileContents, dataObject,
                /^(\s*)([^#\n]+)#§<([^\n]*)(\n)/gmui,
                (whitespace, left, value, right) => whitespace + value + " #" + "§<" + left + right,
                { whitespace: 1, value: 2, left: 3, right: 4 }
            );

            fileContents = processBlockCommentsTemplates(
                f, fileContents, dataObject,
                /()##§([^§]*)§##([^§]+)##§([^§]*)§\.##/gmui,
                (whitespace, left, value, right) => "##" + "§" + left + "§" + "##" + value + "##" + "§" + right + "§." + "##"
            );

            if (fileContents !== primaryFileContents) {
                fs.writeFileSync(f, fileContents);
                console.log("Modified " + f);
            }
        }
        catch (error) {
            console.error("Error while preprocessing template in " + f);
            throw error;
        }
    };
}

function executeTemplate(f: string, data: any, codeLeft: string, value: string, codeRight: string): string {
    try {
        let contextData: any = {
            data: _.cloneDeep(data),
            value: value,
            __filename: f,
            __dirname: paths.dirname(f),
            path: paths,
            fs: fs
        };
        contextData = _.merge(contextData, templateMethods);

        const context = vm.createContext(contextData);
        const leftResult = (codeLeft.trim().length > 0) ? new vm.Script(codeLeft).runInContext(context) : "";
        const rightResult = (codeRight.trim().length > 0) ? new vm.Script(codeRight).runInContext(context) : "";
        const result =  leftResult + rightResult;

        if (
            (codeLeft.indexOf("allowUndefined()") === -1 && codeRight.indexOf("allowUndefined()") === -1)
            && result.indexOf("undefined") !== -1
        )
            throw new Error("Template evaluation result contains word \"undefined\"! If this is intended, please use allowUndefined() inside the script.");
        return result;
    }
    catch (error) {
        console.error("Template left: " + codeLeft);
        console.error("Template right: " + codeRight);
        throw error;
    }
}


function processBlockCommentsTemplates(f: string, fileContents: string, dataObject: any, regex: RegExp, replacer: (whitespace: string, left: string, value: string, right: string) => string, groupOrder: { whitespace: number; left: number; value: number; right: number } = { whitespace: 1, left: 2, value: 3, right: 4 }): string {
    let m;
    while ((m = regex.exec(fileContents)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        if (m.length >= 5) {
            const wholeMatch = m[0];
            const whitespace = m[groupOrder.whitespace];
            const left = m[groupOrder.left];
            const value = m[groupOrder.value];
            const right = m[groupOrder.right];
            let newValue = "";
            newValue = executeTemplate(f, dataObject, left, value, right);

            const replacement = replacer(whitespace, left, newValue, right);

            fileContents = fileContents.replace(wholeMatch, replacement);
        }
    }
    return fileContents;
}