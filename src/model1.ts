/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-25
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: model specifications and validation
 */

import validator from "validator";
import { isDate } from "lodash";
import {
    ComputedMethodsType, ComputedValueType, DataTypes, DocDescType,
    FieldDescType, ModelOptionsType, ModelRelationType, ModelType,
    ValidateMethodsType, ValueParamsType, ValueToDataTypes,
} from "./ormTypes";
import {
    ValidateResponseType, FieldValueTypes, CrudTaskType, CrudOptionsType,
    newDeleteRecord, newGetRecord, newGetRecordStream, newSaveRecord
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
    transformDocValueObject(docValue: ValueParamsType): ValueToDataTypes {
        let transformType: ValueToDataTypes = {};
        try {
            for (const key in Object.keys(docValue)) {
                const modelDocValue = docValue[key];
                if (Array.isArray(modelDocValue)) {
                    if (modelDocValue.every((item: any) => typeof item === "number")) {
                        transformType[key] = DataTypes.ARRAY_NUMBER;
                    } else if (modelDocValue.every((item: any) => typeof item === "string")) {
                        transformType[key] = DataTypes.ARRAY_STRING;
                    } else if (modelDocValue.every((item: any) => typeof item === "boolean")) {
                        transformType[key] = DataTypes.ARRAY_BOOLEAN;
                    } else if (modelDocValue.every((item: any) => typeof item === "object")) {
                        transformType[key] = DataTypes.ARRAY_OBJECT;
                    } else {
                        transformType[key] = DataTypes.ARRAY;
                    }
                } else if (typeof modelDocValue === "object") {
                    // check the model desc type of docDesc[key]
                    // const itemDescType = docDesc[key];
                    transformType[key] = DataTypes.OBJECT;
                } else if (typeof modelDocValue === "string") {
                    // check all base string formats
                    if (isDate(new Date(modelDocValue))) {
                        transformType[key] = DataTypes.DATETIME;
                    } else if (validator.isEmail(modelDocValue)) {
                        transformType[key] = DataTypes.EMAIL;
                    } else if (validator.isMongoId(modelDocValue)) {
                        transformType[key] = DataTypes.MONGODB_ID;
                    } else if (validator.isUUID(modelDocValue)) {
                        transformType[key] = DataTypes.UUID;
                    } else if (validator.isJSON(modelDocValue)) {
                        transformType[key] = DataTypes.JSON;
                    } else if (validator.isCreditCard(modelDocValue)) {
                        transformType[key] = DataTypes.CREDIT_CARD;
                    } else if (validator.isCurrency(modelDocValue)) {
                        transformType[key] = DataTypes.CURRENCY;
                    } else if (validator.isURL(modelDocValue)) {
                        transformType[key] = DataTypes.URL;
                    } else if (validator.isPort(modelDocValue)) {
                        transformType[key] = DataTypes.PORT;
                    } else if (validator.isIP(modelDocValue)) {
                        transformType[key] = DataTypes.IP;
                    } else if (validator.isMimeType(modelDocValue)) {
                        transformType[key] = DataTypes.MIME;
                    } else if (validator.isMACAddress(modelDocValue)) {
                        transformType[key] = DataTypes.MAC_ADDRESS;
                    } else if (validator.isJWT(modelDocValue)) {
                        transformType[key] = DataTypes.JWT;
                    } else if (validator.isLatLong(modelDocValue)) {
                        transformType[key] = DataTypes.LAT_LONG;
                    } else if (validator.isISO31661Alpha2(modelDocValue)) {
                        transformType[key] = DataTypes.ISO2;
                    } else if (validator.isISO31661Alpha3(modelDocValue)) {
                        transformType[key] = DataTypes.ISO3;
                    } else if (validator.isPostalCode(modelDocValue, "any")) {
                        transformType[key] = DataTypes.POSTAL_CODE;
                    } else {
                        transformType[key] = DataTypes.STRING;
                    }
                } else if (typeof modelDocValue === "number") {
                    if (validator.isDecimal(modelDocValue.toString())) {
                        transformType[key] = DataTypes.DECIMAL;
                    } else if (validator.isFloat(modelDocValue.toString())) {
                        transformType[key] = DataTypes.FLOAT;
                    } else if (validator.isInt(modelDocValue.toString())) {
                        transformType[key] = DataTypes.INTEGER;
                    } else {
                        transformType[key] = DataTypes.NUMBER;
                    }
                } else if (typeof modelDocValue === "boolean") {
                    transformType[key] = DataTypes.BOOLEAN;
                } else {
                    transformType[key] = DataTypes.UNDEFINED;
                }
            }
            return transformType;
        } catch (e) {
            console.error(e);
            throw new Error("Error transforming docValue types: " + e.message);
        }
    }

    transformDocValueType(docValue: ValueParamsType, transformType: ValueToDataTypes = {}, parentKeys: Array<string> = []): ValueToDataTypes {
        // let transformType: ValueToDataTypes = {};
        const docDesc = this.modelDocDesc;
        try {
            for (const key in Object.keys(docValue)) {
                const modelDocValue = docValue[key];
                // TODO: key-level composition
                if (Array.isArray(modelDocValue)) {
                    if (modelDocValue.every((item: any) => typeof item === "number")) {
                        transformType[key] = DataTypes.ARRAY_NUMBER;
                    } else if (modelDocValue.every((item: any) => typeof item === "string")) {
                        transformType[key] = DataTypes.ARRAY_STRING;
                    } else if (modelDocValue.every((item: any) => typeof item === "boolean")) {
                        transformType[key] = DataTypes.ARRAY_BOOLEAN;
                    } else if (modelDocValue.every((item: any) => typeof item === "object")) {
                        // recursive checking | TODO: refactor transformType with correct key/sub-keys
                        const objectTransform = this.transformDocValueType(docValue[key] as ValueParamsType, transformType)
                        // transformType[key] = DataTypes.ARRAY_OBJECT;
                    } else {
                        transformType[key] = DataTypes.ARRAY;
                    }
                } else if (typeof modelDocValue === "object") {
                    // check the model desc type of docDesc[key]
                    // const itemDescType = docDesc[key];
                    transformType[key] = DataTypes.OBJECT;
                } else if (typeof modelDocValue === "string") {
                    // check all base string formats
                    if (isDate(new Date(modelDocValue))) {
                        transformType[key] = DataTypes.DATETIME;
                    } else if (validator.isEmail(modelDocValue)) {
                        transformType[key] = DataTypes.EMAIL;
                    } else if (validator.isMongoId(modelDocValue)) {
                        transformType[key] = DataTypes.MONGODB_ID;
                    } else if (validator.isUUID(modelDocValue)) {
                        transformType[key] = DataTypes.UUID;
                    } else if (validator.isJSON(modelDocValue)) {
                        transformType[key] = DataTypes.JSON;
                    } else if (validator.isCreditCard(modelDocValue)) {
                        transformType[key] = DataTypes.CREDIT_CARD;
                    } else if (validator.isCurrency(modelDocValue)) {
                        transformType[key] = DataTypes.CURRENCY;
                    } else if (validator.isURL(modelDocValue)) {
                        transformType[key] = DataTypes.URL;
                    } else if (validator.isPort(modelDocValue)) {
                        transformType[key] = DataTypes.PORT;
                    } else if (validator.isIP(modelDocValue)) {
                        transformType[key] = DataTypes.IP;
                    } else if (validator.isMimeType(modelDocValue)) {
                        transformType[key] = DataTypes.MIME;
                    } else if (validator.isMACAddress(modelDocValue)) {
                        transformType[key] = DataTypes.MAC_ADDRESS;
                    } else if (validator.isJWT(modelDocValue)) {
                        transformType[key] = DataTypes.JWT;
                    } else if (validator.isLatLong(modelDocValue)) {
                        transformType[key] = DataTypes.LAT_LONG;
                    } else if (validator.isISO31661Alpha2(modelDocValue)) {
                        transformType[key] = DataTypes.ISO2;
                    } else if (validator.isISO31661Alpha3(modelDocValue)) {
                        transformType[key] = DataTypes.ISO3;
                    } else if (validator.isPostalCode(modelDocValue, "any")) {
                        transformType[key] = DataTypes.POSTAL_CODE;
                    } else {
                        transformType[key] = DataTypes.STRING;
                    }
                } else if (typeof modelDocValue === "number") {
                    if (validator.isDecimal(modelDocValue.toString())) {
                        transformType[key] = DataTypes.DECIMAL;
                    } else if (validator.isFloat(modelDocValue.toString())) {
                        transformType[key] = DataTypes.FLOAT;
                    } else if (validator.isInt(modelDocValue.toString())) {
                        transformType[key] = DataTypes.INTEGER;
                    } else {
                        transformType[key] = DataTypes.NUMBER;
                    }
                } else if (typeof modelDocValue === "boolean") {
                    transformType[key] = DataTypes.BOOLEAN;
                } else {
                    transformType[key] = DataTypes.UNDEFINED;
                }
            }
            return transformType;
        } catch (e) {
            console.error(e);
            throw new Error("Error transforming docValue types: " + e.message);
        }
    }

    flatModelDocDesc(mDocDesc: DocDescType, newDocDesc: DocDescType = {}): DocDescType {
        // flatten docDesc for easy defaultValue updates and validation
        try {
            let docDesc: DocDescType = newDocDesc;
            // const modelDocDesc = mDocDesc;
            // map all field-desc by types:
            for (const [name, desc] of Object.entries(mDocDesc)) {
                switch (desc) {
                    case desc as DataTypes:
                        docDesc = {...docDesc, ...{[name]: desc}};
                        break;
                    case desc as FieldDescType:
                        docDesc = {...docDesc, ...{[name]: desc}};
                        break;
                    default:
                        break;
                }
            }
            return docDesc;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    flatDocValue(docValue: ValueParamsType, ftDocValue: ValueParamsType = {}): ValueParamsType {
        try {
            let flatDocVal: ValueParamsType = ftDocValue;
            for (const key of Object.keys(docValue)) {
                const docValItem = docValue[key];
                if (typeof docValItem === "object") {
                    // recursive flattening | keys over-write issue => ensure unique naming across all depths
                    this.flatDocValue(docValItem as ValueParamsType, flatDocVal);
                    // flatDocVal = {...flatDocVal, ...docValItem};
                } else {
                    flatDocVal = {...flatDocVal, ...{[key]: docValue[key]}}
                }
            }
            return flatDocVal;
        } catch (e) {
            throw new Error(e.message);
        } finally {

        }
    }

    async updateDefaultValues(docValue: ValueParamsType): Promise<ValueParamsType> {
        // set default values, for null fields | then setValue (transform), if specified
        try {
            const setDocValue: ValueParamsType = docValue;
            const docDesc: DocDescType = this.flatModelDocDesc(this.modelDocDesc);
            for (const key of Object.keys(docValue)) {
                // defaultValue setting applies to FieldDescType only
                const docFieldDesc = docDesc[key];
                const docFieldValue = docValue[key] || null;
                // set default values, for null docFieldValue
                if (!docFieldValue) {
                    switch (docFieldDesc) {
                        case docFieldDesc as FieldDescType:
                            // type of defaultValue and docFieldValue must be equivalent (re: validateMethod)
                            if (docFieldDesc.defaultValue) {
                                const defaultValue = docFieldDesc.defaultValue;
                                switch (defaultValue) {
                                    // defaultValue may of types: ComputedMethodType or FieldValueTypes
                                    case defaultValue as ComputedValueType:
                                        if (typeof defaultValue === "function") {
                                            setDocValue[key] = await defaultValue();
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
                // setValue / transform field-value prior to save-task (create / update)
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

    async validateModelDocValue(docValue: ValueParamsType, taskName: string): Promise<ValidateResponseType> {
        // validate valueParams by model definition (this.docDesc / this.validate)
        try {
            // defaultValues should be set/updated for null doc-fields, prior to validation
            const modelDocValue = await this.updateDefaultValues(docValue);
            // TODO: ?? flatten docDesc for easy validation - returns only DataTypes & FieldDescType
            const flatDocDesc: DocDescType = this.flatModelDocDesc(this.modelDocDesc);
            // get docValue transformed types
            const docValueTypes = this.transformDocValueType(docValue);
            // perform model-defined docValue validation
            let modelDocFieldType;
            for (const key of Object.keys(modelDocValue)) {
                const docFieldDesc = flatDocDesc[key] || null;
                if (!docFieldDesc) {
                    const errMsg = `Invalid key: ${key} is not defined in the model`;
                    return {
                        ok    : false,
                        errors: {[key]: errMsg,},
                    }
                }
                switch (docFieldDesc) {
                    case docFieldDesc as DataTypes:
                        // validate only the fieldType
                        modelDocFieldType = docFieldDesc;
                        if (docValueTypes[key] !== modelDocFieldType) {
                            const errMsg = `Invalid Type for: ${key}. Expected ${modelDocFieldType}. Got ${docValueTypes[key]}`;
                            return {
                                ok    : false,
                                errors: {[key]: errMsg,},
                            }
                        }
                        break;
                    case docFieldDesc as FieldDescType:
                        modelDocFieldType = docFieldDesc.fieldType;
                        // validate fieldType,
                        if (docValueTypes[key] !== modelDocFieldType) {
                            const errMsg = docFieldDesc.validateMessage ?
                                docFieldDesc.validateMessage : `Invalid Type for:  ${key}. Expected ${modelDocFieldType}, Got ${docValueTypes[key]}`;
                            return {
                                ok    : false,
                                errors: {[key]: errMsg,},
                            }
                        }
                        // validate allowNull, fieldLength, min/maxValues...
                        if (!docValue[key] && !docFieldDesc.allowNull) {
                            const errMsg = docFieldDesc.validateMessage ?
                                docFieldDesc.validateMessage : `Value is required for:  ${key}.}`;
                            return {
                                ok    : false,
                                errors: {[key]: errMsg,},
                            }
                        }
                        if (docValueTypes[key] === DataTypes.STRING && docFieldDesc.fieldLength) {
                            const fieldLength = docValue[key].toString().length;
                            if (fieldLength > docFieldDesc.fieldLength) {
                                const errMsg = docFieldDesc.validateMessage ?
                                    docFieldDesc.validateMessage : `Size of ${key} cannot be longer than ${docFieldDesc.fieldLength}`;
                                return {
                                    ok    : false,
                                    errors: {[key]: errMsg,},
                                }
                            }
                        }
                        if ((docValueTypes[key] === DataTypes.NUMBER || docValueTypes[key] === DataTypes.INTEGER ||
                            docValueTypes[key] === DataTypes.FLOAT || docValueTypes[key] === DataTypes.BIGFLOAT ||
                            docValueTypes[key] === DataTypes.DECIMAL)
                        ) {
                            if (docFieldDesc.minValue && docFieldDesc.maxValue) {
                                if (docValue[key] < docFieldDesc.minValue || docValue[key] > docFieldDesc.maxValue) {
                                    const errMsg = docFieldDesc.validateMessage ?
                                        docFieldDesc.validateMessage : `Value of: ${key} must be greater than ${docFieldDesc.minValue}, and less than ${docFieldDesc.maxValue}`;
                                    return {
                                        ok    : false,
                                        errors: {[key]: errMsg,},
                                    }
                                }
                            } else if (docFieldDesc.minValue) {
                                if (docValue[key] < docFieldDesc.minValue) {
                                    const errMsg = docFieldDesc.validateMessage ?
                                        docFieldDesc.validateMessage : `Value of: ${key} cannot be less than ${docFieldDesc.minValue}. `;
                                    return {
                                        ok    : false,
                                        errors: {[key]: errMsg,},
                                    }
                                }
                            } else if (docFieldDesc.maxValue) {
                                if (docValue[key] > docFieldDesc.maxValue) {
                                    const errMsg = docFieldDesc.validateMessage ?
                                        docFieldDesc.validateMessage : `Value of: ${key} cannot be greater than ${docFieldDesc.maxValue}. `;
                                    return {
                                        ok    : false,
                                        errors: {[key]: errMsg,},
                                    }
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }

            // perform user-defined docValue validation
            const modelValidateMethod = this.modelValidateMethods[taskName];
            // get validate method for the docValue task by task_name
            if (modelValidateMethod) {
                return modelValidateMethod(modelDocValue);
            } else {
                // => no user-defined validation
                return {ok: true};
            }
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
            if (params.actionParams && Array.isArray(params.actionParams) && params.actionParams.length) {
                for (const docValue of params.actionParams) {
                    // flatten the docValue
                    const flatDocValue = this.flatDocValue(docValue);
                    // validate actionParam-item (docValue) field-value
                    const validateRes = await this.validateModelDocValue(flatDocValue, taskName);
                    if (!validateRes.ok && validateRes.errors && Object.keys(validateRes.errors).length) {
                        return getParamsMessage(validateRes.errors);
                    }
                }
            } else {
                return getResMessage("paramsError", {message: "action-params is required to perform save operation."});
            }

            // TODO: once validated, organize actionParams data by modelType & validated docValue

            // instantiate CRUD-save class with computedSaveParams & perform save-crud tasks (create / update)
            options = {
                ...options, ...this.modelOptionValues,
            };
            const crud = newSaveRecord(params, options);
            return await crud.saveRecord();
        } catch (e) {
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
        } catch (error) {
            console.error(error);
            throw new Error(`notFound: ${error.message}`);
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
            return getResMessage("readError");
        }
    }

    async delete(params: CrudTaskType, options: CrudOptionsType = {}): Promise<ResponseMessage> {
        // validate queryParams based on model/docDesc
        try {
            // model specific params
            params.coll = this.collName;
            const crud = newDeleteRecord(params, options);
            return await crud.deleteRecord();
        } catch (e) {
            return getResMessage("deleteError");
        }
    }
}

// factory function
export function newModel(model: ModelType, options = {}) {
    return new Model(model, options);
}
