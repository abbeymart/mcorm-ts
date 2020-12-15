/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-08-04
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: user model/instance testing
 */

import { DataTypes, DocDescType, ErrorType, Model, ModelType, ValidateResponseType, ValueParamsType } from "..";
import { isEmail, isName, isNameNoSpace, isPassword, isStringChar } from "../../mc-utils/src";
import {getHash} from "../../../apps/auth/lib/authHelpers";
import {mcConfig} from "../../../config/config";

// validation helper functions
export function validateUser(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.acceptTerm) {
            errors.acceptTerm = "Terms of service must be accepted/selected";
        }

        if (docParams.username) {
            // Check input formats/patterns
            const testItem = isName(docParams.username as string);
            if (!testItem) {
                errors.username = "Format-error";
            }
        } else {
            errors.username = "Username is required";
        }

        if (docParams.password) {
            // Check input formats/patterns
            const testItem = isPassword(docParams.password as string);
            if (!testItem) {
                errors.password = "format-error";
            }
        } else {
            errors.password = "Password is required";
        }

        if (docParams.email) {
            // Check input formats/patterns
            const testItem = isEmail(docParams.email as string);
            if (!testItem) {
                errors.email = "format-error";
            }
        } else {
            errors.email = "Email is required";
        }

    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateUserRegister(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate model properties:
    try {
        if (!docParams.acceptTerm) {
            errors.acceptTerm = "Terms of service must be accepted/selected";
        }

        if (docParams.username) {
            // Check input formats/patterns
            const testItem = isName(docParams.username as string);
            if (!testItem) {
                errors.username = "Format-error";
            }
        } else {
            errors.username = "Username is required";
        }

        if (docParams.password) {
            // Check input formats/patterns
            const testItem = isPassword(docParams.password as string);
            if (!testItem) {
                errors.password = "format-error";
            }
        } else {
            errors.password = "Password is required";
        }

        if (docParams.email) {
            // Check input formats/patterns
            const testItem = isEmail(docParams.email as string);
            if (!testItem) {
                errors.email = "format-error";
            }
        } else {
            errors.email = "Email is required";
        }

        if (docParams.confirmPassword) {
            if (!(docParams.confirmPassword === docParams.password)) {
                errors.confirmPassword = "format-error";
            }
        } else {
            errors.confirmPassword = "Confirmed password is required";
        }

        if (docParams.recoveryEmail) {
            // Check input formats/patterns
            const testItem = isEmail(docParams.recoveryEmail as string);
            if (!testItem) {
                errors.recoveryEmail = "format-error";
            }
            if (docParams.recoveryEmail === docParams.email) {
                errors.recoveryEmailCheck = "Recovery email must be different from the main user email";
            }
        }

        if (docParams.firstName) {
            const testItem = isNameNoSpace(docParams.firstName as string);
            if (!testItem) {
                errors.firstName = "Name should contain characters only";
            }
        } else {
            errors.firstName = "Name is required";
        }

        if (docParams.lastName) {
            const testItem = isNameNoSpace(docParams.lastName as string);
            if (!testItem) {
                errors.lastName = "Name should contain characters only";
            }
        } else {
            errors.lastName = "Name is required";
        }

        if (docParams.language) {
            const testItem = isStringChar(docParams.language as string);
            if (!testItem) {
                errors.language = "Language should contain characters only";
            }
        }
    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateVerifyUser(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate model properties:
    try {
        if (docParams.username) {
            // Check input formats/patterns
            const testItem = isName(docParams.username as string);
            if (!testItem) {
                errors.username = "Format-error";
            }
        } else {
            errors.username = "Username is required";
        }

        if (docParams.email) {
            // Check input formats/patterns
            const testItem = isEmail(docParams.email as string);
            if (!testItem) {
                errors.email = "format-error";
            }
        } else {
            errors.email = "Email is required";
        }

        if (docParams.firstName) {
            const testItem = isNameNoSpace(docParams.firstName as string);
            if (!testItem) {
                errors.firstName = "Name should contain characters only";
            }
        } else {
            errors.firstName = "Name is required";
        }

        if (docParams.lastName) {
            const testItem = isNameNoSpace(docParams.lastName as string);
            if (!testItem) {
                errors.lastName = "Name should contain characters only";
            }
        } else {
            errors.lastName = "Name is required";
        }

    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateUserProfile(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (docParams.firstName) {
            // Check input formats/patterns
            const testItem = isNameNoSpace(docParams.firstName as string);
            if (!testItem) {
                errors.firstName = "format-error";
            }
        } else {
            errors.firstName = "First-name is required";
        }

        if (docParams.lastName) {
            // Check input formats/patterns
            const testItem = isNameNoSpace(docParams.lastName as string);
            if (!testItem) {
                errors.lastName = "format-error";
            }
        } else {
            errors.lastName = "Last-name is required";
        }

        if (docParams.middleName) {
            // Check input formats/patterns
            const testItem = isNameNoSpace(docParams.middleName as string);
            if (!testItem) {
                errors.middleName = "format-error";
            }
        }

        if (docParams.recoveryEmail) {
            // Check input formats/patterns
            const testItem = isEmail(docParams.recoveryEmail as string);
            if (!testItem) {
                errors.recoveryEmail = "Format-error";
            }
        } else {
            errors.recoveryEmail = "Recovery-email is required";
        }

        if (docParams.language) {
            const testItem = isStringChar(docParams.language as string);
            if (!testItem) {
                errors.language = "Language should contain characters only";
            }
        }

    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateUserLogout(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.loginName) {
            errors.loginName = "Login-name (email or username) is required";
        }

        if (!docParams.userInfo) {
            errors.userInfo = "User information-object) is required";
        }
    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateUserLogin(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.loginName) {
            errors.loginName = "Login-name (email or username) is required";
        }

        if (!docParams.password) {
            // Check input formats/patterns
            errors.password = "Password is required";
        }
    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateUserRoles(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.loginName) {
            errors.loginName = "Login-name (email or username) is required";
        }

        if (!docParams.userInfo) {
            errors.userInfo = "User information-object) is required";
        }

        if (!docParams.roles || !Array.isArray(docParams.roles)) {
            errors.roles = "Roles (array of string/ObjectId) is required";
        }

    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateChangeRequest(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.loginName) {
            errors.loginName = "Login-name (email or username) is required";
        }

        if (!docParams.changeType) {
            errors.changeType = "Change type (username, email, password) is required";
        }

        if (!docParams.email) {
            errors.email = "Email is required, for verification";
        }

        if (!docParams.userInfo) {
            errors.userInfo = "User information-object) is required";
        }
    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateChangeUsername(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.username) {
            errors.username = "Current Username to be changed is required";
        }
        if (!docParams.loginName) {
            errors.loginName = "Login-name (email or username) is required";
        }

        if (!docParams.password) {
            errors.password = "Password is required";
        }

        if (!docParams.email) {
            errors.email = "Email is required";
        }

        if (!docParams.userInfo) {
            errors.userInfo = "User information-object) is required";
        }
    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateChangeEmail(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.loginName) {
            errors.loginName = "Login-name (email or username) is required";
        }

        if (!docParams.password) {
            errors.password = "Password is required";
        }

        if (!docParams.email) {
            errors.email = "Email is required";
        }

        if (!docParams.userInfo) {
            errors.userInfo = "User information-object) is required";
        }
    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

export function validateChangePassword(docParams: ValueParamsType): ValidateResponseType {
    let errors: ErrorType = {};

    // validate all model properties:
    try {
        if (!docParams.loginName) {
            errors.loginName = "Login-name (email or username) is required";
        }

        if (!docParams.currentPassword) {
            errors.currentPassword = "Current Password is required";
        }

        if (docParams.newPassword) {
            // Check input formats/patterns
            const testItem = isPassword(docParams.newPassword as string);
            if (!testItem) {
                errors.newPassword = "format-error";
            }
        } else {
            errors.newPassword = "New Password is required";
        }

        if (!docParams.email) {
            errors.email = "Email is required, for verification";
        }

        if (!docParams.userInfo) {
            errors.userInfo = "User information-object) is required";
        }
    } catch (e) {
        console.error('Error validating inputs');
        errors.validationError = 'Error validating inputs';
    }

    if (errors || Object.entries(errors)) {
        return {ok: false, errors};
    }
    return {ok: true, errors};
}

// computed methods

async function hashPassword(docValue: ValueParamsType): Promise<string> {
    return await getHash(JSON.stringify(docValue["password"]), mcConfig.secret);
}

// model instance/docDesc and docValue
const profileDesc: DocDescType = {
    firstName    : {
        fieldType  : DataTypes.STRING,
        fieldLength: 255,
    },
    middleName   : {
        fieldType  : DataTypes.STRING,
        fieldLength: 255,
    },
    lastName     : {
        fieldType  : DataTypes.STRING,
        fieldLength: 255,
    },
    recoveryEmail: DataTypes.EMAIL,
    group        : DataTypes.STRING,           // active user-group
    language     : {
        fieldType   : DataTypes.STRING,
        fieldLength : 25,
        defaultValue: "en-US",
    },
    dob          : DataTypes.DATETIME,
}

const userModelDef: ModelType = {
    collName       : "users",
    docDesc        : {
        _id       : DataTypes.MONGODB_ID,
        acceptTerm: DataTypes.BOOLEAN,
        isAdmin   : DataTypes.BOOLEAN,
        username  : {
            fieldType: DataTypes.STRING,
            minValue : 6,
            unique   : true,
        },
        email     : DataTypes.EMAIL,
        password  : {
            fieldType: DataTypes.STRING,
            minValue : 8,
            setValue: hashPassword,
            // messages: {
            //     minValue: "The password length should not be less than 8",
            // }
        },
        groups    : DataTypes.ARRAY_STRING,
        profile   : profileDesc,
    },
    timeStamp      : true,
    activeStamp    : true,
    actorStamp     : true,
    validateMethods: {
        user          : validateUser,
        userRegister  : validateUserRegister,
        verifyUser    : validateVerifyUser,
        userProfile   : validateUserProfile,
        userLogin     : validateUserLogin,
        userLogout    : validateUserLogout,
        userRoles     : validateUserRoles,
        changeRequest : validateChangeRequest,
        changeUsername: validateChangeUsername,
        changeEmail   : validateChangeEmail,
        changePassword: validateChangePassword,
    },
}

class UserModel extends Model {
    constructor(userModel: ModelType) {
        super(userModel);
    }
}

export const userModel = new UserModel(userModelDef);
