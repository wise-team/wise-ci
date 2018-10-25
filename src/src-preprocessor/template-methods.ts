import * as _ from "lodash";
import { URL } from "url";

export function allowUndefined() {} // this function is only used to mark code which allows undefined keyword.

export function d <T> (input: T | undefined): T {
    if (typeof input !== "undefined") return input;
    else throw new Error("Input value is undefined (d() fn)");
}

export function objectAsCode(v: any, indentation: string = "  ", dataParamForMethods: any = {}): string {
    if (v === null) return "null";

    switch (typeof v) {
        case "undefined":
            return "undefined";

        case "string":
            return "\"" + v + "\"";

        case "number":
            return v + "";

        case "boolean":
            return v + "";

        case "function":
            const fnCode = v.toString();
            if (fnCode.indexOf("()") === 0) {
                // this is (data)=>{} function
                const methodOut = v() + "";
                return "() => \"" + methodOut.split("\\").join("\\\\").split("\n").join("\\n").split("\"").join("\\\"")  + "\"";
            }
            else if (fnCode.indexOf("(data)") === 0) {
                // this is (data)=>{} function
                const methodOut = v(dataParamForMethods) + "";
                return "() => \"" + methodOut.split("\\").join("\\\\").split("\n").join("\\n").split("\"").join("\\\"")  + "\"";
            }
            else {
                return "() => { throw new Error(\" Only (data)=>{} or ()=>{} functions can be evaluated in generated config file \"); }";
            }

        case "object":
            if (Array.isArray(v)) {
                return "[ " + v.map(elem => objectAsCode(elem, "", dataParamForMethods)).join(", ") + " ]";
            }
            else { // object
                const ownPropNames: string [] = [];
                _.forOwn(v, (value, ownPropName) => ownPropNames.push(ownPropName));

                if (ownPropNames.length === 0) return "{}";
                else return "{" + (ownPropNames.length > 0 ? "\n" : "")
                    + ownPropNames
                        .map((ownPropName: string) => indentation + "  \"" + ownPropName + "\": "
                            + objectAsCode(v[ownPropName], indentation + "  ", dataParamForMethods) +  ",\n"
                        ).join("")
                    + indentation + "}";
            }

        default:
            throw new Error("Unknown type \"" + (typeof v) + "\" for " + v);
    }
}

export function outputConfig(data: any): string {
    let out = "\n";
    out += "export const data = ";
    // const templateMethods = require(__filename);
    // _.forOwn(templateMethods, (v, propName) => out += templateMethods[propName].toString() + ";\n");
    // out += "config = ";
    const generatedCode = objectAsCode(data, "", data);
    out += generatedCode;
    out += ";" + "\n";
    return out;
}

export function sectionSign(): string {
    return "§";
}

export function url(toBeParsedAsUrl: string): URL {
    return new URL(toBeParsedAsUrl);
}