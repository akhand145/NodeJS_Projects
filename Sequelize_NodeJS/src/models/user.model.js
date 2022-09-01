module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("users", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userType: {
            type: DataTypes.STRING,
            defaultValue: 'User'
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Active'
        },
        isVerify: {
            type: DataTypes.STRING,
            defaultValue: 'No'
        },
        isDeleted: {
            type: DataTypes.STRING,
            defaultValue: 'No'
        }
    });
    return User;
}

