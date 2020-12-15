/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-25
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: orm types
 */

import { FieldValueTypes, ValidateResponseType } from "../../mc-crud-mg/src";

export enum DataTypes {
    STRING = "string",
    // STRING_ALPHA = "stringalpha",
    // STRING_ALPHA_NUMERIC = "stringalphanumeric",
    POSTAL_CODE = "postalcode",
    MONGODB_ID = "objectid",
    UUID = "uuid",
    NUMBER = "number",
    INTEGER = "integer",
    DECIMAL = "decimal",
    FLOAT = "float",
    BIGINT = "bigint",
    BIGFLOAT = "bigfloat",
    OBJECT = "object",     // key-value pairs
    ARRAY = "array",
    ARRAY_STRING = "arrayofstring",
    ARRAY_NUMBER = "arrayofnumber",
    ARRAY_BOOLEAN = "arrayofboolean",
    ARRAY_OBJECT = "arrayofobject",
    BOOLEAN = "boolean",
    JSON = "json",
    DATETIME = "datetime",
    // DATE = "date",
    // TIME = "time",
    TIMESTAMP = "timestamp",
    TIMESTAMPZ = "timestampz",
    POSITIVE = "positive",
    EMAIL = "email",
    URL = "url",
    PORT = "port",
    IP = "ipaddress",
    JWT = "jwt",
    LAT_LONG = "latlong",
    ISO2 = "iso2",
    ISO3 = "iso3",
    MAC_ADDRESS = "macaddress",
    MIME = "mime",
    CREDIT_CARD = "creditcard",
    CURRENCY = "currency",
    IMEI = "imei",
    // ENUM = "enum",       // Enumerations
    SET = "set", // Unique values set
    // WEAK_SET = "weakset",
    MAP = "map",     // Table/Map/Dictionary
    // WEAK_MAP = "weakmap",
    MCDB = "mcdb",       // Database connection handle
    // MODEL = "model",   // Model record definition
    // MODEL_VALUE = "modelvalue",
    UNDEFINED = "undefined",
}

export enum RelationTypes {
    ONE_TO_ONE,
    ONE_TO_MANY,
    MANY_TO_MANY,
    MANY_TO_ONE,
}

export enum RelationActionTypes {
    RESTRICT,       // must remove target-record(s), prior to removing source-record
    CASCADE,        // default for ON UPDATE | update foreignKey value or delete foreignKey record/value
    NO_ACTION,      // leave the foreignKey value, as-is
    SET_DEFAULT,    // set foreignKey to specified default value
    SET_NULL,       // set foreignKey value to null or ""
}

// export type FieldDataTypes = "string" | "number" | "boolean" | "symbol" | "object"

// ModelValue will be validated based on the Model definition
export interface ValueParamsType {
    [key: string]: FieldValueTypes;         // fieldName: fieldValue, must match fieldType (re: validate) in model definition
}

export interface DocValueType {
    [key: string]: ValueParamsType;
}

export interface ValueToDataTypes {
    [key: string]: DataTypes;
}

export type GetValueType = <T>() => T;
export type SetValueType = <T>(docValue: T) => T; // receive docValue-object as parameter
export type DefaultValueType = <T, R>(docValue?: T) => R; // may/optionally receive docValue-object as parameter
export type ValidateMethodType = <T>(docValue?: T) => boolean;  // may/optionally receive docValue-object as parameter
export type ValidateMethodResponseType = <T>(docValue: T) => ValidateResponseType;  // receive docValue-object as parameter
export type ComputedValueType = <T, R>(docValue: T) => R;   // receive docValue-object as parameter

export interface ValidateMethodsType {
    [key: string]: ValidateMethodResponseType;
}

export interface ComputedMethodsType {
    [key: string]: ComputedValueType;
}

// for field and model methods: docValue may be auto-injected, as a closure,
// to be checked and used internally by the method/func
export interface FieldDescType {
    fieldType: DataTypes;
    fieldLength?: number;   // default: 255 for DataTypes.STRING
    fieldPattern?: string;  // "/^[0-9]{10}$/" => includes 10 digits, 0 to 9 | "/^[0-9]{6}.[0-9]{2}$/ => max 16 digits and 2 decimal places
    allowNull?: boolean;    // default: true
    unique?: boolean;
    indexable?: boolean;
    primaryKey?: boolean;
    minValue?: number;
    maxValue?: number;
    setValue?: SetValueType;   // set/transform fieldValue prior to save(create/insert), T=>fieldType
    defaultValue?: DefaultValueType | FieldValueTypes;            // result/T must be of fieldType
    validate?: ValidateMethodType;   // T=>fieldType, returns a bool (valid=true/invalid=false)
    validateMessage?: string;
}

export interface ModelRelationType {
    sourceColl: string;
    targetColl: string;
    sourceField: string;
    targetField: string;
    relationType: RelationTypes;
    sourceModel?: ModelType;
    targetModel?: ModelType;
    foreignField?: string; // source-to-targetField map
    relationField?: string; // relation-targetField, for many-to-many
    relationColl?: string;  // optional collName for many-to-many | default: source_target Coll Coll or sourceTarget
    onDelete?: RelationActionTypes;
    onUpdate?: RelationActionTypes;
}

export interface DocDescType {
    [key: string]: DataTypes | FieldDescType;
}

export interface ModelType {
    collName: string;
    docDesc: DocDescType;
    timeStamp?: boolean;        // auto-add: createdAt and updatedAt | default: true
    actorStamp?: boolean;       // auto-add: createdBy and updatedBy | default: true
    activeStamp?: boolean;      // record active status, isActive (true | false) | default: true
    relations?: Array<ModelRelationType>;
    computedMethods?: ComputedMethodsType;   // model-level functions, e.g fullName(a, b: T): T
    validateMethods?: ValidateMethodsType;
    alterSyncColl?: boolean;    // create / alter collection and sync existing data, if there was a change to the Coll structure | default: true
                                // if alterSyncColl: false; it will create/re-create the Coll, with no data sync
}

export interface ModelOptionsType {
    timeStamp?: boolean;        // auto-add: createdAt and updatedAt | default: true
    actorStamp?: boolean;       // auto-add: createdBy and updatedBy | default: true
    activeStamp?: boolean;      // auto-add isActive, if not already set | default: true
    docValueDesc?: DocDescType;
    docValue?: ValueParamsType;
}
