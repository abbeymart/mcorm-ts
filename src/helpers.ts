/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-12-28
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: bookmark socket.io
 */

import { DataTypes, FieldDescType, ModelType, ValueParamsType } from "./types";
import { FieldValueTypes } from "@mconnect/mccrudmg";

export function camelToUnderscore(key: string): string {
    return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function jsonToCrudSaveParams(model: ModelType, docValue: ValueParamsType): ValueParamsType {
    try {
        // error checking
        let errorMsg = "";
        let validField = false;
        let defaultValue: FieldValueTypes;

        // check the key type from userModel
        // desc: FieldDescType | DataTypes | ModelType
        let fieldName = name;
        let fieldType, fieldDesc;
        let result: ValueParamsType = {};

        // for each field-item in docValue, validate against corresponding model field-desc =>
        // => by fieldType, defaultValue, fieldPattern?/validateMethod?(handle by model/task validation)

        for (const [name, desc] of Object.entries(model.docDesc)) {
            switch (desc) {
                case desc as DataTypes:
                    result = dataTypesETL(desc, docValue);
                    break;
                case desc as FieldDescType:
                    result = fieldDescTypeETL(desc, docValue);
                    desc.fieldType
                    break;
                default:
                    result[name] = docValue[name];
                    throw new Error(`No model matching type found for ${name}: ${docValue[name]}`)
            }


            // compute save params
        }
        return result;

    } catch (e) {
        throw new Error("Error computing record(s): " + e.message);

    }
}

export function dataTypesETL(desc: DataTypes, docValue: ValueParamsType): ValueParamsType {
    let result: ValueParamsType = {};

    return result;

}

export function fieldDescTypeETL(desc: FieldDescType, docValue: ValueParamsType): ValueParamsType {
    let result: ValueParamsType = {};

    return result;
}
