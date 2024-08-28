import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ClientAttributes {
  id: number;
  uuid: string;
  customer_code: string;
}

class Client extends Model<ClientAttributes> implements ClientAttributes {
  declare id: number;
  declare uuid: string;
  declare customer_code: string;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    customer_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true,
  }
);

export default Client;