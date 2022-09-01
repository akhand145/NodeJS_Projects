module.exports = (sequelize, DataTypes) => {

    const OTP = sequelize.define("otps", {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        OTP: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expiryTime: {
            type: DataTypes.DATE
        },
        isVerify: {
            type: DataTypes.STRING,
            defaultValue: 'No'
        },
    });
    return OTP;
}
