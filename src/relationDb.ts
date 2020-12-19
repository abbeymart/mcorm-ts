/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-08-01
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: relations-db store
 */

// import fs = require("fs");
import * as fs from 'fs';
import { ModelRelationType } from "./types";

export function saveDbRelations(relations: Array<ModelRelationType>): Set<ModelRelationType> {
    let relationsDb: Set<ModelRelationType>;

    try {
        // retrieve the relationsDb from localDb-store
        const relationsJson = fs.readFileSync("relationsDb.json");

        relationsDb = JSON.parse(relationsJson.toString());
        if (!relationsDb || relationsDb.size < 1) {
            // initialize the set
            relationsDb = new Set<ModelRelationType>();
        }

        // add the model relations to the relationsDb (repository)
        for (const item of relations) {
            relationsDb.add(item);
        }
        // write to the json file
        fs.writeFileSync("relationsDb.json", JSON.stringify(relationsDb));

        // return the relationsDb | to be used for CRUD operations
        return relationsDb;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
        // return  relationsDb;
    }
}

export function getDbRelations(): Set<ModelRelationType> {
    let relationsDb: Set<ModelRelationType>;

    try {
        // retrieve the relationsDb from localDb-store
        const relationsJson = fs.readFileSync("relationsDb.json");

        relationsDb = JSON.parse(relationsJson.toString());

        // return the relationsDb | to be used for CRUD operations
        return relationsDb;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}
