const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // SQLite only
    storage: 'path/to/database.sqlite',
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const User = sequelize.define('user', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: Sequelize.STRING,
    birthday: Sequelize.DATE
}, { freezeTableName: true, createdAt: false, updatedAt: false, deletedAt: false });


const sequelizeSharding = require('../');

// import { useCustomTableName, getYYMM } from '../';

function test() {
    //hook to use customTableName
    let useCustomTableName = sequelizeSharding.useCustomTableName
    let getYYMM = sequelizeSharding.getYYMM
    let user = {
        name: "china",
        birthday: new Date("2018-10-01")
    }

    let externalValue = new Date("2018-01-01")
        //user_2018_10 from user's column
    useCustomTableName(sequelize, User, "birthday", true)
    User.insertOrUpdate(user)
        .then(() => {
            //user_2018_10_test from func(user's column)
            useCustomTableName(sequelize, User, "birthday", true, function(value) {
                return getYYMM(value) + "_test"
            })
            return User.insertOrUpdate(user)
        }).then(() => {
            //user_2018_01 from externalValue
            useCustomTableName(sequelize, User, externalValue, false)
            return User.insertOrUpdate(user)
        }).then(() => {
            //user_2018_01_test from func(externalValue)
            useCustomTableName(sequelize, User, externalValue, false, function(value) {
                return getYYMM(value) + "_test"
            })
            return User.insertOrUpdate(user)
        }).then(() => {
            //user_2018_10_void from func()
            useCustomTableName(sequelize, User, externalValue, false, function(value) {
                return getYYMM(new Date("2018-10-01")) + "_void"
            })
            return User.insertOrUpdate(user)
        })
}


if (!module.parent) {
    (function() {
        test()
    })()
}