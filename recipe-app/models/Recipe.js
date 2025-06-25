const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: DataTypes.STRING,
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('instructions');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('instructions', JSON.stringify(value));
    }
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('ingredients');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('ingredients', JSON.stringify(value));
    }
  },
  time: DataTypes.INTEGER,
  servings: DataTypes.INTEGER,
  difficulty: DataTypes.STRING,
  photo_path: DataTypes.STRING,
}, {
  timestamps: true,
});

module.exports = Recipe;
