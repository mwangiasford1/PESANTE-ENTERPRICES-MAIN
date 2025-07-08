const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Property = sequelize.define('Property', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('Residential', 'Commercial', 'Land'), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  bedrooms: { type: DataTypes.INTEGER },
  bathrooms: { type: DataTypes.INTEGER },
  area: { type: DataTypes.DECIMAL(8, 2) },
  image: { type: DataTypes.TEXT('long') },
  status: { type: DataTypes.ENUM('Active', 'Sold', 'Pending'), defaultValue: 'Active' },
  contactPhone: { type: DataTypes.STRING },
  contactEmail: { type: DataTypes.STRING }
});

module.exports = Property; 