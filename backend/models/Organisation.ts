import { DataTypes, Model } from "sequelize";
import db from "../lib/db.ts";

class Organisation extends Model {
  declare id: string;
  declare name: string;
  declare logoId: string;
}

Organisation.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "logo_id",
    },
  },
  {
    sequelize: db,
    tableName: "organisation",
    timestamps: false,
    underscored: true,
  }
);

export default Organisation;
