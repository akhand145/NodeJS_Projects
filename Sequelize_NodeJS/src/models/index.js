const dbConfig = require('../../config/db.config');

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB_NAME,
    dbConfig.DB_USER,
    dbConfig.DB_PASS, {
    host: dbConfig.DB_HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    }
}
);

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database');
    }).catch(err => {
        console.log('Error', + err);
    });


const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model')(sequelize, DataTypes);
db.auths = require('./auth.model')(sequelize, DataTypes);
db.posts = require('./post.model')(sequelize, DataTypes);
db.otps = require('./otp.model')(sequelize, DataTypes);


// Set up associations for foreign KEYS - One-To-One
db.users.hasOne(db.auths, {
    foreignKey: { name: "userID", unique: true },
    sourceKey: "id",
});

// Set up associations for foreign KEYS - One-To-Many
db.users.hasOne(db.posts, {
    foreignKey: { name: "userID", unique: false },
    sourceKey: "id",
});

// Set up associations for foreign KEYS - One-To-One
db.users.hasOne(db.otps, {
    foreignKey: { name: "userID", unique: true },
    sourceKey: "id",
});


db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Yes re-sync done!');
    });

module.exports = db;