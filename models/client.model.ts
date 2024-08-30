import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../src/config/database';

// Definindo os atributos do modelo Client
interface ClientAttributes {
  id: number;
  uuid: string;
  customer_code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definindo os atributos que são opcionais ao criar um novo registro de Client
interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'> {}

// Definindo o modelo Client
class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  declare id: number;
  declare uuid: string;
  declare customer_code: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true, // Ativa os timestamps para incluir createdAt e updatedAt
  }
);

export default Client;
