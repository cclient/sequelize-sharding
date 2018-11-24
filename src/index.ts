import {Sequelize,Model} from 'sequelize'

export let getYYMMDD = function(date) {
    if (!date) {
        date = new Date()
    }
    let yymmdd = ('0' + (date.getFullYear())).slice(-4) + "_" + ('0' + (date.getMonth() + 1)).slice(-2) + "_" + ('0' + date.getDate()).slice(-2)
    return yymmdd
}

export let getYYMM = function(date) {
    if (!date) {
        date = new Date()
    }
    let yymmdd = ('0' + (date.getFullYear())).slice(-4) + "_" + ('0' + (date.getMonth() + 1)).slice(-2)
    return yymmdd
}

const HOOK_NAME="_useCustomTableName"
const BACK_TABLE_NAME_KEY="_originalTableName"

//https://github.com/sequelize/sequelize/blob/master/lib/hooks.js
const BEFORE_HOOKS=["beforeFind","beforeCount","beforeSave","beforeUpsert"]
const AFTER_HOOKS=["afterFind","afterbeforeCount","afterbeforeSave","afterbeforeUpsert"]

export let useCustomTableName=function(sequelize: Sequelize, sequelizeModel:Model<any, any>,value:string, isColumn:boolean=true,generatePostfixFunc?:Function,beforeHooks?:string[]){
    if (!sequelize) throw new Error('Missing required arg: sequelize')
    if (!sequelizeModel) throw new Error('Missing required arg: sequelizeModel')
    if (!value) throw new Error('Missing required arg: value')
    if(!beforeHooks){
        beforeHooks=BEFORE_HOOKS;
    }
    if(!generatePostfixFunc){
        generatePostfixFunc=getYYMM
    }else{
        if (typeof generatePostfixFunc !== 'function') {
            throw new Error('generatePostfixFunc is not a function')
        }
    }

    beforeHooks.forEach(hookName=>{
        if(!sequelizeModel["BACK_TABLE_NAME_KEY"]){
            sequelizeModel["BACK_TABLE_NAME_KEY"]=sequelizeModel.tableName
        }
        sequelizeModel.removeHook(hookName,HOOK_NAME)
        sequelizeModel.addHook(hookName,HOOK_NAME, (entity:Map<string,any>, options) => {
            if(isColumn){
                value=entity[value]
            }
            value=generatePostfixFunc(value)
            sequelizeModel.tableName=sequelizeModel["BACK_TABLE_NAME_KEY"]+"_"+value
        })
    })
    AFTER_HOOKS.forEach(hookName=>{
        if(sequelizeModel["BACK_TABLE_NAME_KEY"]){
            sequelizeModel.tableName=sequelizeModel["BACK_TABLE_NAME_KEY"]
        }
    })
}