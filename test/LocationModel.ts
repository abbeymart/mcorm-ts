/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-08-04
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: user model/instance testing
 */

import { DataTypes, ErrorType, Model, ModelType, ValidateResponseType, ValueParamsType } from "..";
import { isEmail, isName, isNameNoSpace, isPassword, isStringChar } from "../../mc-utils/src";

// helper methods
function validateUserRegister(docParams: ValueParamsType): ValidateResponseType {
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

// model instance/docDesc and docValue
const locationModelDef: ModelType = {
    collName      : "locations",
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
            // messages: {
            //     minValue: "The password length should not be less than 8",
            // }
        },
        groups    : DataTypes.ARRAY_STRING,
        language  : {
            fieldType  : DataTypes.STRING,
            fieldLength: 25,
        },
    },
    timeStamp      : true,
    activeStamp    : true,
    actorStamp     : true,
    validateMethods: validateUserRegister,
}

class LocationModel extends Model {
    constructor(userModel: ModelType) {
        super(userModel);
    }
}

export const locationModel = new LocationModel(locationModelDef);

