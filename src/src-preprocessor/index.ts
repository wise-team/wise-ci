import * as fs from "fs";
import * as paths from "path";
import * as _ from "lodash";
import * as defaultHooks from "./default-hooks";
import * as defaultFilters from "./default-filters";
import { jsTemplate } from "./js-template-hook";


export class SourcePreprocessor {
    private parent: string;
    private excludes: string [] = [ ".", "..", ".DS_Store", "node_modules", "vendor", ".git", ".venv" ];

    public constructor(parent: string) {
        this.parent = paths.resolve(parent);
    }

    public async preprocess(dataObject: any, hooks: SourcePreprocessor.Hook [], excludes: string []) {
        await this.visitDir(this.parent, dataObject, hooks, [...this.excludes, ...excludes]);
    }

    private async visitFile(path_: string, dataObject: any, hooks: SourcePreprocessor.Hook []) {
        const path = paths.resolve(path_);
        for (let i = 0; i < hooks.length; i++) {
            await hooks[i](path, dataObject);
        }
    }

    private async visitDir(path_: string, dataObject_: any, hooks_: SourcePreprocessor.Hook [], excludes_: string []) {
        const path = paths.resolve(path_);
        if (paths.resolve(path + "/..") === this.parent) console.log("> Processing " + path);
        const dataObject: any = _.cloneDeep(dataObject_);
        const hooks: SourcePreprocessor.Hook [] = _.cloneDeep(hooks_) as SourcePreprocessor.Hook [];
        let excludes: string [] = _.cloneDeep(excludes_);
        const preprocessPath = paths.resolve(path, ".preprocess.ts");

        if (fs.existsSync(preprocessPath)) {
            const preprocessFileObj = await import(preprocessPath);
            if (!preprocessFileObj.hooks) throw new Error(preprocessPath + " file is missing 'hooks' export");
            if (!preprocessFileObj.data) throw new Error(preprocessPath + " file is missing 'data' export");
            preprocessFileObj.hooks.forEach((hook: SourcePreprocessor.Hook) => hooks.push(hook));
            _.merge(dataObject, preprocessFileObj.data);
            if (preprocessFileObj.excludes) excludes = [...excludes, ...preprocessFileObj.excludes];
        }

        this.visitFile(path, hooks, dataObject);

        const children = fs.readdirSync(path);
        for (let i = 0; i < children.length; i++) {
            const child = paths.resolve(path, children[i]);
            const basename = paths.basename(child);
            if (this.isIncluded(child) && excludes.filter(e => e === basename).length === 0) {
                const childStat = fs.lstatSync(child);
                if (childStat.isDirectory()) {
                    await this.visitDir(child, dataObject, hooks /* here we pass hooks without templater, as it is applied in each dir separately*/, excludes);
                }
                else if (childStat.isFile()) {
                    const hooksWithTemplater: SourcePreprocessor.Hook [] = [jsTemplate(() => true, dataObject), ...hooks];
                    await this.visitFile(child, dataObject, hooksWithTemplater);
                }
            }
        }
    }

    private isIncluded(path: string): boolean {
        const extname = paths.extname(path).toLowerCase();
        if ([ ".jpg", ".jpeg", ".bin", ".png", ".tiff" ].filter(ext => ext === extname).length > 0) return false;
        const stats = fs.statSync(path);
        if (stats.size > 1024 * 1024) return false; // block files that are > 1mb.
        return true;
    }
}

export namespace SourcePreprocessor {
    export type Hook = (path: string, data: any) => Promise<void>;

    export const hooks = defaultHooks;
    export const filters = defaultFilters;
}

export function d <T> (input: T | undefined): T {
    if (typeof input !== "undefined") return input;
    else throw new Error("Input value is undefined (d() fn)");
}
