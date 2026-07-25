import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

class User extends Model {
  declare id: string;
  declare organisationId: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare role: "super" | "admin" | "user";
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    organisationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "organisation_id",
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("super", "admin", "user"),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "user",
    timestamps: true,
    underscored: true,
  }
);

export default User;
