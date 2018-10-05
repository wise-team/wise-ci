import * as fs from "fs";
import * as paths from "path";
import * as _ from "lodash";

import { SourcePreprocessor } from "./index";

export function directoryHasChild (childName: string): (f: string) => boolean {
    return (f: string) => {
        if (fs.lstatSync(f).isDirectory()) {
            return fs.existsSync(paths.resolve(f, childName));
        }
        else return false;
    };
}

export function isFileNamed (fileName: string): (f: string) => boolean {
    return (f: string) => {
        return paths.basename(f) === fileName && fs.lstatSync(f).isFile();
    };
}

export function hasExtension (ext: string): (f: string) => boolean {
    return (f: string) => {
        return fs.lstatSync(f).isFile() && paths.extname(f) === ext;
    };
}