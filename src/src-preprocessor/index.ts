import * as fs from "fs";
import * as paths from "path";
import * as _ from "lodash";
import * as defaultHooks from "./default-hooks";
import * as defaultFilters from "./default-filters";

export class SourcePreprocessor {
    private parent: string;
    private excludeFiles: string [] = [ ".", "..", ".DS_Store", "node_modules", "vendor" ];

    public constructor(parent: string) {
        this.parent = parent;
    }

    public async preprocess(dataObject: any, hooks: SourcePreprocessor.Hook []) {
        await this.visitDir(this.parent, dataObject, hooks);
    }

    private async visitFile(path_: string, hooks: SourcePreprocessor.Hook []) {
        const path = paths.resolve(path_);
        for (let i = 0; i < hooks.length; i++) {
            await hooks[i](path);
        }
    }

    private async visitDir(path_: string, dataObject_: any, hooks_: SourcePreprocessor.Hook []) {
        const path = paths.resolve(path_);
        const dataObject: any = _.cloneDeep(dataObject_);
        const hooks: SourcePreprocessor.Hook [] = _.cloneDeep(hooks_) as SourcePreprocessor.Hook [];
        const preprocessPath = paths.resolve(path, ".preprocess.js");

        if (fs.existsSync(preprocessPath)) {
            const preprocessFileObj = await import(preprocessPath);
            if(!preprocessFileObj.hooks) throw new Error(preprocessPath + " file is missing 'hooks' export");
            if(!preprocessFileObj.data) throw new Error(preprocessPath + " file is missing 'data' export");
            hooks.push(preprocessFileObj.hooks)
            _.merge(dataObject, preprocessFileObj.data);
        }

        this.visitFile(path, hooks);

        const children = fs.readdirSync(path);
        for (let i = 0; i < children.length; i++) {
            const child = paths.resolve(path, children[i]);
            const basename = paths.basename(child);
            if (this.excludeFiles.filter(e => e === basename).length === 0) {
                const childStat = fs.lstatSync(child);
                if (childStat.isDirectory()) {
                    await this.visitDir(child, dataObject, hooks /* here we pass hooks without templater, as it is applied in each dir separately*/);
                }
                else if (childStat.isFile()) {
                    const hooksWithTemplater: SourcePreprocessor.Hook [] = [defaultHooks.jsTemplate(() => true, dataObject), ...hooks];
                    await this.visitFile(child, hooksWithTemplater);
                }
            }
        }
    }
}

export namespace SourcePreprocessor {
    export type Hook = (path: string) => Promise<void>;

    export const hooks = defaultHooks;
    export const filters = defaultFilters;
}

export function d <T> (input: T | undefined): T {
    if (typeof input !== "undefined") return input;
    else throw new Error("Input value is undefined (d() fn)");
};
