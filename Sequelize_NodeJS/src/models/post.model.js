module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define("posts", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Active'
        },
        isDeleted: {
            type: DataTypes.STRING,
            defaultValue: 'No'
        },
    });
    return Post;
}

