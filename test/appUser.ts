/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-26
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: bookmark socket.io
 */
import { UserInfoType } from "../";

export const dbName = "mc-central";

export const appUser = {
    tokenId     : '1724091e4c2828cf095c00ddb21114fd3c8afc424d0b7da7d94c963a92d206a8',
    testUserInfo: {
        token    : "1724091e4c2828cf095c00ddb21114fd3c8afc424d0b7da7d94c963a92d206a8",
        group    : "5b4543a417d6841d393e0e99",
        email    : "abbeya1@yahoo.com",
        firstName: "Abi",
        language : "en-US",
        lastName : "Akindele",
        loginName: "abbeya1@yahoo.com",
        userId   : "5b0e139b3151184425aae01c",
        groups   : [],
    },
};

export const userInfo: UserInfoType = {
    token    : "1724091e4c2828cf095c00ddb21114fd3c8afc424d0b7da7d94c963a92d206a8",
    group    : "5b4543a417d6841d393e0e99",
    email    : "abbeya1@yahoo.com",
    firstName: "Abi",
    language : "en-US",
    lastName : "Akindele",
    loginName: "abbeya1@yahoo.com",
    userId   : "5b0e139b3151184425aae01c",
    groups   : [],
};

export const inValidUserInfo: UserInfoType = {
    token    : "",
    group    : "5b4543a417d6841d393e0e99",
    email    : "abbeya1@yahoo.com",
    firstName: "Abi",
    language : "en-US",
    lastName : "Akindele",
    loginName: "abbeya1@yahoo.com",
    userId   : "5b0e139b3151184425aae09c",
    groups   : [],
};

export const token = "1724091e4c2828cf095c00ddb21114fd3c8afc424d0b7da7d94c963a92d206a8";
