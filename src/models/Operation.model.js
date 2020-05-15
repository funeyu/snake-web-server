const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Operation = sequelize.define(
    "Operation",
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
        defaultValue: 0
      },
      docId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'doc_id',
        defaultValue: 0
      },
      word: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
      },
      type: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 1
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
      tableName: "operations",
      underscored: false,
      freezeTableName: false,
      indexes: [
        {
          unique: false,
          fields: ["doc_id", "user_id"]
        }
      ]
    }
  );

  return Operation;
};
