import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Client from './client.model';

interface MeasureAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  type: 'gas' | 'water';
  hasConfirmed: boolean;
  value: number;
  imageUrl: string | null;
  idClient: number;
}

interface MeasureCreationAttributes extends Optional<MeasureAttributes, 'id' | 'createdAt'> {}

class Measure extends Model<MeasureAttributes, MeasureCreationAttributes> implements MeasureAttributes {
  declare id: number;
  declare uuid: string;
  declare createdAt: Date;
  declare type: 'gas' | 'water';
  declare hasConfirmed: boolean;
  declare value: number;
  declare imageUrl: string | null;
  declare idClient: number;

  static associate() {
    Measure.belongsTo(Client, { foreignKey: 'idClient', as: 'client' });
  }
}

Measure.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  type: {
    type: DataTypes.ENUM('gas', 'water'),
    allowNull: false,
  },
  hasConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idClient: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Client,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Measure',
  tableName: 'measures',
  timestamps: true,
});

export default Measure;
