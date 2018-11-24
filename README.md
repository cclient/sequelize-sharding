### desc

sequelize Model hooks for sharded-table that like [tablename]_yyyy_mm...( table should be created before)

use sequelize original hooks as a "AOP" to change target table name

`user => user_2018_01,user_2018_02, ... ,user_2018_11,user_2018_12`

### start

npm install sequelize

npm install sequelize-sharding

### original sequelize

```js

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


let user = {
        name: "china",
        birthday: new Date("2018-10-01")
    }


```

### hook

#### javascript

```js

const sequelizeSharding = require('sequelize-sharding');
sequelizeSharding.useCustomTableName(sequelize, User, "birthday", true)
User.insertOrUpdate(user)

```

#### typescript

```ts

import { useCustomTableName} from '../';
useCustomTableName(sequelize, User, "birthday", true)
User.insertOrUpdate(user)

```

###

define function to generate table's postfix like

```fun

useCustomTableName(sequelize, User, null, false, function(value) {
    return getYYMM(new Date())
})

detail see test/test.js

```