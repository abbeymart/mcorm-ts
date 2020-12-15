/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-25
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: model specifications and validation
 */

import validator from "validator";
import { isDate } from "lodash";
import {
    ComputedMethodsType, DataTypes, DefaultValueType, DocDescType,
    FieldDescType, ModelOptionsType, ModelRelationType, ModelType,
    ValidateMethodsType, ValueParamsType, ValueToDataTypes,
} from "./ormTypes";
import {
    ValidateResponseType, FieldValueTypes, CrudTaskType, CrudOptionsType,
    newDeleteRecord, newGetRecord, newGetRecordStream, newSaveRecord, MessageObject
} from "../../mc-crud-mg/src";
import { getResMessage, ResponseMessage } from "../../mc-response/src";
import { getParamsMessage } from "../../mc-utils/src";
import { Cursor } from "mongodb";

export class Model {
    private readonly collName: string;
    private readonly docDesc: DocDescType;
    private readonly timeStamp: boolean;
    private readonly actorStamp: boolean;
    private readonly activeStamp: boolean;
    private readonly relations: Array<ModelRelationType>;
    private readonly computedMethods: ComputedMethodsType;
    private readonly validateMethods: ValidateMethodsType;
    private readonly alterSyncColl: boolean;
    protected taskName: string;
    protected modelOptions: ModelOptionsType;

    constructor(model: ModelType, options: ModelOptionsType = {}) {
        const defaultValidateMethod = {};
        this.collName = model.collName || "";
        this.docDesc = model.docDesc || {};
        this.timeStamp = model.timeStamp || true;
        this.actorStamp = model.actorStamp || true;
        this.activeStamp = model.activeStamp || true;
        this.relations = model.relations || [];
        this.computedMethods = model.computedMethods || {};
        this.validateMethods = model.validateMethods || defaultValidateMethod;
        this.alterSyncColl = model.alterSyncColl || false;
        this.taskName = "";
        this.modelOptions = options ? options : {
            timeStamp  : this.timeStamp,
            actorStamp : this.actorStamp,
            activeStamp: this.activeStamp,
        };
    }

    // ***** instance methods: getters | setters *****
    get modelCollName(): string {
        return this.collName;
    }

    get modelDocDesc(): DocDescType {
        return this.docDesc;
    }

    get modelRelations(): Array<ModelRelationType> {
        return this.relations;
    }

    get modelOptionValues(): ModelOptionsType {
        return this.modelOptions;
    }

    get modelComputedMethods(): ComputedMethodsType {
        return this.computedMethods;
    }

    get modelValidateMethods(): ValidateMethodsType {
        return this.validateMethods;
    }

    get modelAlterSyncColl(): boolean {
        return this.alterSyncColl;
    }

    // instance methods
    getParentRelations(): Array<ModelRelationType> {
        // extract relations/collections where targetColl === this.collName
        // sourceColl is the parentColl of this.collName(target/child)
        let parentRelations: Array<ModelRelationType> = [];
        try {
            const modelRelations = this.modelRelations;
            for (const item of modelRelations) {
                if (item.targetColl === this.modelCollName) {
                    parentRelations.push(item);
                }
            }
            return parentRelations;
        } catch (e) {
            // throw new Error(e.message);
            return parentRelations;
        }
    }

    getChildRelations(): Array<ModelRelationType> {
        // extract relations/collections where sourceColl === this.collName
        // targetColl is the childColl of this.collName(source/parent)
        let childRelations: Array<ModelRelationType> = [];
        try {
            const modelRelations = this.modelRelations;
            for (const item of modelRelations) {
                if (item.sourceColl === this.modelCollName) {
                    childRelations.push(item);
                }
            }
            return childRelations;
        } catch (e) {
            // throw new Error(e.message);
            return childRelations;
        }
    }

    getParentColls(): Array<string> {
        let parentColls: Array<string>;
        const parentRelations = this.getParentRelations();
        parentColls = parentRelations.map(rel => rel.sourceColl);
        return parentColls;
    }

    getChildColls(): Array<string> {
        let childColls: Array<string>;
        const childRelations = this.getChildRelations();
        childColls = childRelations.map(rel => rel.targetColl);
        return childColls;
    }

    // ***** helper methods *****
    computeDocValueType(docValue: ValueParamsType): ValueToDataTypes {
        let computedType: ValueToDataTypes = {};
        try {
            for (const key in Object.keys(docValue)) {
                const modelDocValue = docValue[key];
                if (Array.isArray(modelDocValue)) {
                    if (modelDocValue.every((item: any) => typeof item === "number")) {
                        computedType[key] = DataTypes.ARRAY_NUMBER;
                    } else if (modelDocValue.every((item: any) => typeof item === "string")) {
                        computedType[key] = DataTypes.ARRAY_STRING;
                    } else if (modelDocValue.every((item: any) => typeof item === "boolean")) {
                        computedType[key] = DataTypes.ARRAY_BOOLEAN;
                    } else if (modelDocValue.every((item: any) => typeof item === "object")) {
                        computedType[key] = DataTypes.ARRAY_OBJECT;
                    } else {
                        computedType[key] = DataTypes.ARRAY;
                    }
                } else if (typeof modelDocValue === "object") {
                    computedType[key] = DataTypes.OBJECT;
                } else if (typeof modelDocValue === "string") {
                    // check all base string formats
                    if (isDate(new Date(modelDocValue))) {
                        computedType[key] = DataTypes.DATETIME;
                    } else if (validator.isEmail(modelDocValue)) {
                        computedType[key] = DataTypes.EMAIL;
                    } else if (validator.isMongoId(modelDocValue)) {
                        computedType[key] = DataTypes.MONGODB_ID;
                    } else if (validator.isUUID(modelDocValue)) {
                        computedType[key] = DataTypes.UUID;
                    } else if (validator.isJSON(modelDocValue)) {
                        computedType[key] = DataTypes.JSON;
                    } else if (validator.isCreditCard(modelDocValue)) {
                        computedType[key] = DataTypes.CREDIT_CARD;
                    } else if (validator.isCurrency(modelDocValue)) {
                        computedType[key] = DataTypes.CURRENCY;
                    } else if (validator.isURL(modelDocValue)) {
                        computedType[key] = DataTypes.URL;
                    } else if (validator.isPort(modelDocValue)) {
                        computedType[key] = DataTypes.PORT;
                    } else if (validator.isIP(modelDocValue)) {
                        computedType[key] = DataTypes.IP;
                    } else if (validator.isMimeType(modelDocValue)) {
                        computedType[key] = DataTypes.MIME;
                    } else if (validator.isMACAddress(modelDocValue)) {
                        computedType[key] = DataTypes.MAC_ADDRESS;
                    } else if (validator.isJWT(modelDocValue)) {
                        computedType[key] = DataTypes.JWT;
                    } else if (validator.isLatLong(modelDocValue)) {
                        computedType[key] = DataTypes.LAT_LONG;
                    } else if (validator.isISO31661Alpha2(modelDocValue)) {
                        computedType[key] = DataTypes.ISO2;
                    } else if (validator.isISO31661Alpha3(modelDocValue)) {
                        computedType[key] = DataTypes.ISO3;
                    } else if (validator.isPostalCode(modelDocValue, "any")) {
                        computedType[key] = DataTypes.POSTAL_CODE;
                    } else {
                        computedType[key] = DataTypes.STRING;
                    }
                } else if (typeof modelDocValue === "number") {
                    if (validator.isDecimal(modelDocValue.toString())) {
                        computedType[key] = DataTypes.DECIMAL;
                    } else if (validator.isFloat(modelDocValue.toString())) {
                        computedType[key] = DataTypes.FLOAT;
                    } else if (validator.isInt(modelDocValue.toString())) {
                        computedType[key] = DataTypes.INTEGER;
                    } else {
                        computedType[key] = DataTypes.NUMBER;
                    }
                } else if (typeof modelDocValue === "boolean") {
                    computedType[key] = DataTypes.BOOLEAN;
                } else {
                    computedType[key] = DataTypes.UNDEFINED;
                }
            }
            return computedType;
        } catch (e) {
            console.error(e);
            throw new Error("Error computing docValue types: " + e.message);
        }
    }

    async updateDefaultValues(docValue: ValueParamsType): Promise<ValueParamsType> {
        // set default values, for null fields | then setValue (transform), if specified
        try {
            // set base docValue
            const setDocValue: ValueParamsType = docValue;
            // perform defaultValue task
            for (const key of Object.keys(docValue)) {
                // defaultValue setting applies to FieldDescType only | otherwise, the value is required (not null)
                const docFieldDesc = this.modelDocDesc[key];
                const docFieldValue = docValue[key] || null;
                // set default values
                if (!docFieldValue) {
                    switch (docFieldDesc) {
                        case docFieldDesc as FieldDescType:
                            // type of defaultValue and docFieldValue must be equivalent (re: validateMethod)
                            if (docFieldDesc.defaultValue) {
                                const defaultValue = docFieldDesc.defaultValue;
                                switch (defaultValue) {
                                    // defaultValue may of types: ComputedMethodType or FieldValueTypes
                                    case defaultValue as DefaultValueType:
                                        if (typeof defaultValue === "function") {
                                            setDocValue[key] = await defaultValue(docValue);
                                        }
                                        break;
                                    case defaultValue as FieldValueTypes:
                                        setDocValue[key] = defaultValue;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
                // setValue / transform field-value prior-to/before save-task (create / update)
                switch (docFieldDesc) {
                    case docFieldDesc as FieldDescType:
                        const fieldValue = setDocValue[key];
                        if (fieldValue && docFieldDesc.setValue) {
                            setDocValue[key] = await docFieldDesc.setValue(docValue);
                        }
                        break;
                    default:
                        break;
                }
            }
            return setDocValue;
        } catch (e) {
            throw new Error(e.mssage);
        }
    }

    async validateDocValue(modelDocValue: ValueParamsType, taskName: string): Promise<ValidateResponseType> {
        // validate modelDocValue by model definition (this.modelDocDesc)
        try {
            // use updated docValue, defaultValues and setValues, prior to validation
            // get docValue transformed types
            const docValueTypes = this.computeDocValueType(modelDocValue);
            // model-description/definition
            const docDesc = this.modelDocDesc;
            // combine errors/messages
            let validateErrors: MessageObject = {}
            // perform model-defined docValue validation
            for (const key of Object.keys(modelDocValue)) {
                const docFieldDesc = docDesc[key] || null;
                // check field description / definition
                if (!docFieldDesc) {
                    validateErrors[key] = `Invalid key: ${key} is not defined in the model`;
                } else {
                    switch (docFieldDesc) {
                        case docFieldDesc as DataTypes:
                            // validate field-value/type
                            // use values from transform docValue, including default/set-values
                            const fieldValue = modelDocValue[key] || null
                            if (fieldValue && docValueTypes[key] !== docFieldDesc) {
                                validateErrors[key] = `Invalid Type for: ${key}. Expected ${docFieldDesc}. Got ${docValueTypes[key]}`;
                            }
                            break;
                        case docFieldDesc as FieldDescType:
                            // validate fieldType,
                            if (docValueTypes[key] !== docFieldDesc.fieldType) {
                                validateErrors[key] = docFieldDesc.validateMessage ?
                                    docFieldDesc.validateMessage : `Invalid Type for:  ${key}. Expected ${docFieldDesc.fieldType}, Got ${docValueTypes[key]}`;
                            }
                            // validate allowNull, fieldLength, min/maxValues...| TODO: patterns?
                            // use values from transform docValue, including default/set-values
                            const docFieldValue = modelDocValue[key] || null
                            if (docFieldValue && !docFieldValue && !docFieldDesc.allowNull) {
                                validateErrors[`${key}-nullValidation`] = docFieldDesc.validateMessage ?
                                    docFieldDesc.validateMessage : `Value is required for:  ${key}.}`;
                            }
                            if (docValueTypes[key] === DataTypes.STRING && docFieldDesc.fieldLength) {
                                const fieldLength = docFieldValue.toString().length;
                                if (fieldLength > docFieldDesc.fieldLength) {
                                    validateErrors[`${key}-lengthValidation`] = docFieldDesc.validateMessage ?
                                        docFieldDesc.validateMessage : `Size of ${key} cannot be longer than ${docFieldDesc.fieldLength}`;
                                }
                            }
                            if ((docValueTypes[key] === DataTypes.NUMBER || docValueTypes[key] === DataTypes.INTEGER ||
                                docValueTypes[key] === DataTypes.FLOAT || docValueTypes[key] === DataTypes.BIGFLOAT ||
                                docValueTypes[key] === DataTypes.DECIMAL)
                            ) {
                                if (docFieldDesc.minValue && docFieldDesc.maxValue) {
                                    if (docFieldValue < docFieldDesc.minValue || docFieldValue > docFieldDesc.maxValue) {
                                        validateErrors[`${key}-minMaxValidation`] = docFieldDesc.validateMessage ?
                                            docFieldDesc.validateMessage : `Value of: ${key} must be greater than ${docFieldDesc.minValue}, and less than ${docFieldDesc.maxValue}`;
                                    }
                                } else if (docFieldDesc.minValue) {
                                    if (docFieldValue < docFieldDesc.minValue) {
                                        validateErrors[`${key}-minMaxValidation`] = docFieldDesc.validateMessage ?
                                            docFieldDesc.validateMessage : `Value of: ${key} cannot be less than ${docFieldDesc.minValue}. `;
                                    }
                                } else if (docFieldDesc.maxValue) {
                                    if (docFieldValue > docFieldDesc.maxValue) {
                                        validateErrors[`${key}-minMaxValidation`] = docFieldDesc.validateMessage ?
                                            docFieldDesc.validateMessage : `Value of: ${key} cannot be greater than ${docFieldDesc.maxValue}. `;
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

            // check validateErrors
            if (Object.keys(validateErrors).length > 0) {
                return {
                    ok    : false,
                    errors: validateErrors,
                }
            }

            // perform user-defined docValue validation
            // get validate method for the docValue task by task_name
            const modelValidateMethod = this.modelValidateMethods[taskName];
            if (modelValidateMethod) {
                const valRes = await modelValidateMethod(modelDocValue);
                if (!valRes.ok || (valRes.errors && Object.keys(valRes.errors).length > 0)) {
                    return valRes
                }
            }
            // return success
            return {ok: true, errors: {}};
        } catch (e) {
            throw new Error(e.message);
        }
    }

    // ***** crud operations / methods : interface to the CRUD modules *****

    async save(params: CrudTaskType, options: CrudOptionsType = {}): Promise<ResponseMessage> {
        try {
            // model specific params
            params.coll = this.collName;
            const taskName = params.taskName || "";
            this.taskName = taskName;
            if (!taskName) {
                return getResMessage("paramsError", {message: "taskName is required. "});
            }

            // validate task/actionParams (docValue), prior to saving, via this.validateDocValue
            let actParams = []
            if (params.actionParams && Array.isArray(params.actionParams) && params.actionParams.length) {
                for (const docValue of params.actionParams) {
                    // update defaultValues and setValues, before/prior to save
                    const modelDocValue = await this.updateDefaultValues(docValue);
                    // validate actionParam-item (docValue) field-value
                    const validateRes = await this.validateDocValue(modelDocValue, taskName);
                    if (!validateRes.ok || (validateRes.errors && Object.keys(validateRes.errors).length > 0)) {
                        return getParamsMessage(validateRes.errors);
                    }
                    // update actParams
                    actParams.push(modelDocValue)
                }
            } else {
                return getResMessage("paramsError", {message: "action-params is required to perform save operation."});
            }
            // update CRUD params and options
            params.actionParams = actParams
            options = {
                ...options, ...this.modelOptionValues,
            };
            // instantiate CRUD-save class with computedSaveParams & perform save-crud tasks (create / update)
            const crud = newSaveRecord(params, options);
            return await crud.saveRecord();
        } catch (e) {
            console.error(e);
            return getResMessage("saveError", {message: e.message});
        }
    }

    async get(params: CrudTaskType, options: CrudOptionsType = {}): Promise<ResponseMessage> {
        try {
            // model specific params
            params.coll = this.collName;
            const crud = newGetRecord(params, options);
            return await crud.getRecord();
        } catch (e) {
            console.error(e);
            return getResMessage("readError");
        }
    }

    async getStream(params: CrudTaskType, options: CrudOptionsType = {}): Promise<Cursor> {
        // get stream of document(s), returning a cursor or error
        try {
            // model specific params
            params.coll = this.collName;
            const crud = newGetRecordStream(params, options);
            return await crud.getRecordStream();
        } catch (e) {
            console.error(e);
            throw new Error(`notFound: ${e.message}`);
        }
    }

    async gets(params: CrudTaskType, options: CrudOptionsType = {}): Promise<ResponseMessage> {
        // get composite/aggregate docs based on queryParams and model-relations definition
        try {
            // model specific params
            params.coll = this.collName;
            const crud = newGetRecord(params, options);
            return await crud.getRecord();
        } catch (e) {
            console.error(e);
            return getResMessage("readError");
        }
    }

    async delete(params: CrudTaskType, options: CrudOptionsType = {}): Promise<ResponseMessage> {
        // validate queryParams based on model/docDesc
        try {
            // model specific params
            params.coll = this.collName;
            // update options
            options = {
                ...options, ...{
                    parentColls: this.getParentColls(),
                    childColls : this.getChildColls(),
                }
            }
            const crud = newDeleteRecord(params, options);
            return await crud.deleteRecord();
        } catch (e) {
            console.error(e);
            return getResMessage("deleteError");
        }
    }
}

// factory function
export function newModel(model: ModelType, options = {}) {
    return new Model(model, options);
}
