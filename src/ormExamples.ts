/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-31
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: bookmark socket.io
 */

import { DataTypes, ModelType } from "../../mc-types";

const UserProfileModel: ModelType = {
    collName: "userProfiles",
    docDesc : {
        firstName : {
            fieldType  : DataTypes.STRING,
            fieldLength: 255,
        },
        middleName: {
            fieldType  : DataTypes.STRING,
            fieldLength: 255,
        },
        lastName  : {
            fieldType  : DataTypes.STRING,
            fieldLength: 255,
        },
    }
}

const UserModel: ModelType = {
    collName   : "users",
    docDesc    : {
        _id       : DataTypes.UUID,
        acceptTerm: DataTypes.BOOLEAN,
        isAdmin   : DataTypes.BOOLEAN,
        language  : {
            fieldType  : DataTypes.STRING,
            fieldLength: 25,
        },
        profile   : UserProfileModel,
        firstName : {
            fieldType  : DataTypes.STRING,
            fieldLength: 255,
        },
        middleName: {
            fieldType  : DataTypes.STRING,
            fieldLength: 255,
        },
        lastName  : {
            fieldType  : DataTypes.STRING,
            fieldLength: 255,
        },
    },
    timeStamp  : true,
    activeStamp: true,
    actorStamp : true,
}
