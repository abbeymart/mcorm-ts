/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-23
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: DeleteDoc testing
 */

import { mcTest, assertEquals, postTestResult } from "../../mc-test/src";
import { DeleteDoc, newDeleteDoc } from "../";
import { userInfo, dbName } from "./appUser";
import { newDbMongo } from "../../mc-db/src";
import { dbs } from "../../mc-db/test/config/dbConfig";
import { CrudTaskType } from "../";

let coll = 'locations',
    docIds: Array<string> = [],
    options = {
        logDelete: true,
    };

(async () => {
    // pre-testing setup
    let dbServer = await newDbMongo(dbs.mongodb);
    let appDb = await dbServer.openDb(dbName);
    let params: CrudTaskType = {
        appDb      : appDb,
        coll       : coll,
        userInfo   : userInfo,
        queryParams: {},
        docIds     : docIds,
        token      : "",
    };

    // perform audit-log test tasks
    await mcTest({
        name    : "should connect and return valid instance record, with new call: ",
        testFunc: async () => {
            const crud = new DeleteDoc(params, options);
            assertEquals(typeof crud, "object");
            assertEquals(Object.keys(crud).length > 0, true);
        },
    });
    await mcTest({
        name    : "should connect and return valid instance record, with function-call: ",
        testFunc: async () => {
            const crud = newDeleteDoc(params, options);
            assertEquals(typeof crud, "object");
            assertEquals(Object.keys(crud).length > 0, true);
        },
    });
    await mcTest({
        name    : "should successfully delete record (or return notFound/removeError), by docId: ",
        testFunc: async () => {
            params = {
                appDb      : appDb,
                coll       : coll,
                userInfo   : userInfo,
                queryParams: {},
                docIds     : ['5d02f6ee61ac813a548cb5d8'],
                token      : "",
            };
            const crud = newDeleteDoc(params, options);
            const res = await crud.deleteDoc();
            console.log('response code: ', res.code);
            const resResult = (res.code === "success" || res.code === "notFound" || res.code === "removeError");
            assertEquals(resResult, true);
        },
    });
    await mcTest({
        name    : "should successfully delete record (or return notFound/removeError), by docIds: ",
        testFunc: async () => {
            params = {
                appDb      : appDb,
                coll       : coll,
                userInfo   : userInfo,
                queryParams: {},
                docIds     : ['5d02f6ee61ac813a548cb5d8', '5dd5db3eb7566bae147428c0'],
                token      : "",
            };
            options = {
                ...options, ...{
                    parentColl: ['locations'],
                    childColl : ['locations'],
                }
            };
            const crud = newDeleteDoc(params, options);
            const res = await crud.deleteDoc();
            console.log('response code: ', res.code);
            const resResult = (res.code === "success" || res.code === "notFound" || res.code === "removeError");
            assertEquals(resResult, true);
        },
    });
    await mcTest({
        name    : "should successfully delete records, by queryParams (admin): ",
        testFunc: async () => {
            params = {
                appDb      : appDb,
                coll       : coll,
                userInfo   : userInfo,
                queryParams: {code: 'OY2b',},
                docIds     : [],
                token      : "",
            };
            options = {
                ...options, ...{
                    parentColl: ['locations'],
                    childColl : ['locations'],
                }
            };
            docIds = [];
            const crud = newDeleteDoc(params, options);
            const res = await crud.deleteDoc();
            console.log('response code: ', res.code);
            const resResult = (res.code === "success" || res.code === "notFound" || res.code === "removeError");
            assertEquals(resResult, true);
        },
    });
    await mcTest({
        name    : "should return paramsError, with null required param: ",
        testFunc: async () => {
            params = {
                appDb      : appDb,
                coll       : "",
                userInfo   : userInfo,
                queryParams: {},
                docIds     : [],
                token      : "",
            };
            const crud = newDeleteDoc(params, options);
            const res = await crud.deleteDoc();
            console.log('response code: ', res.code);
            assertEquals(res.code, "paramsError");
        },
    });
    await mcTest({
        name    : "should return subItem msgType/code, for parent item: ",
        testFunc: async () => {
            params = {
                appDb      : appDb,
                coll       : coll,
                userInfo   : userInfo,
                queryParams: {},
                docIds     : ['5b57f583b3db46019a22bda2'],
                token      : "",
            };
            options = {
                ...options, ...{
                    parentColl: ['locations'],
                    childColl : ['locations'],
                }
            };
            docIds = ['5d02f4417288e1397420f75a'];
            const crud = newDeleteDoc(params, options);
            const res = await crud.deleteDoc();
            console.log('response code: ', res.code);
            assertEquals(res.code, "subItems");
        },
    });

    // post testing report
    await postTestResult();

    // close dbServer / avoid memory leak
    await dbServer?.closeDb();
})();
