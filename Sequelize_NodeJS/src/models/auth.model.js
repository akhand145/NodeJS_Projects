module.exports = (sequelize, DataTypes) => {

    const Auth = sequelize.define("auths", {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Auth;
}