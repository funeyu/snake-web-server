const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      isAdmin: {
        type: DataTypes.NUMBER,
        field: 'is_admin',
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    {
      timestamps: false,
      tableName: "users",
      underscored: false,
      freezeTableName: false,
      indexes: [
        {
          unique: true,
          fields: ["login"]
        }
      ]
    }
  );

  return User;
};
