const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
      },
      gitLogin: {
        type: DataTypes.STRING,
        defaultValue: "",
        field: 'git_login',
        allowNull: false
      },
      gitFollowers: {
        type: DataTypes.NUMBER,
        field: 'git_followers',
        defaultValue: 0,
        allowNull: false
      },
      domain: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
      },
      schema: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
        allowNull: false
      },
      path: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
      },
      speed: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
        allowNull: false
      },
      articleNum: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
        field: 'article_num',
        allowNull: false
      },
      favicon: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
      },
      keywords: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
      },
      lang: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
        allowNull: false
      },
      score: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'blogs',
      underscored: false,
      freezeTableName: false,
      indexes: [
        {
          unique: false,
          fields: ['domain', 'git_followers']
        }
      ]
    }
  );

  return Blog;
};
