"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYYMMDD = function (date) {
    if (!date) {
        date = new Date();
    }
    let yymmdd = ('0' + (date.getFullYear())).slice(-4) + "_" + ('0' + (date.getMonth() + 1)).slice(-2) + "_" + ('0' + date.getDate()).slice(-2);
    return yymmdd;
};
exports.getYYMM = function (date) {
    if (!date) {
        date = new Date();
    }
    let yymmdd = ('0' + (date.getFullYear())).slice(-4) + "_" + ('0' + (date.getMonth() + 1)).slice(-2);
    return yymmdd;
};
const HOOK_NAME = "_useCustomTableName";
const BACK_TABLE_NAME_KEY = "_originalTableName";
//https://github.com/sequelize/sequelize/blob/master/lib/hooks.js
const DEAFULT_TARGET_HOOKS = ["Find", "Count", "Save", "Upsert"];
let DEAFULT_BEFORE_HOOKS = DEAFULT_TARGET_HOOKS.map(targetHook => "before" + targetHook);
let DEAFULT_AFTER_HOOKS = DEAFULT_TARGET_HOOKS.map(targetHook => "after" + targetHook);
exports.useCustomTableName = function (sequelize, sequelizeModel, value, isColumn = true, generatePostfixFunc, targetHooks) {
    if (!sequelize)
        throw new Error('Missing required arg: sequelize');
    if (!sequelizeModel)
        throw new Error('Missing required arg: sequelizeModel');
    if (!value)
        throw new Error('Missing required arg: value');
    let beforeHooks = DEAFULT_BEFORE_HOOKS;
    let afterHooks = DEAFULT_AFTER_HOOKS;
    if (targetHooks) {
        beforeHooks = targetHooks.map(targetHook => "before" + targetHook);
        afterHooks = targetHooks.map(targetHook => "after" + targetHook);
    }
    if (!generatePostfixFunc) {
        generatePostfixFunc = exports.getYYMM;
    }
    else if (typeof generatePostfixFunc !== 'function') {
        throw new Error('generatePostfixFunc is not a function');
    }
    beforeHooks.forEach(hookName => {
        sequelizeModel.removeHook(hookName, HOOK_NAME);
        if (!sequelizeModel[BACK_TABLE_NAME_KEY]) {
            sequelizeModel[BACK_TABLE_NAME_KEY] = sequelizeModel.tableName;
        }
        sequelizeModel.addHook(hookName, HOOK_NAME, (entity, options) => {
            if (isColumn) {
                value = entity[value];
            }
            value = generatePostfixFunc(value);
            sequelizeModel.tableName = sequelizeModel[BACK_TABLE_NAME_KEY] + "_" + value;
        });
    });
    afterHooks.forEach(hookName => {
        sequelizeModel.removeHook(hookName, HOOK_NAME);
        if (sequelizeModel[BACK_TABLE_NAME_KEY]) {
            sequelizeModel.tableName = sequelizeModel[BACK_TABLE_NAME_KEY];
        }
    });
};

//# sourceMappingURL=index.js.map
