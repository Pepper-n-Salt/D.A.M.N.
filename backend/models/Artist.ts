import { DataTypes, Model } from "sequelize";
import db from "../lib/db.ts";

class Artist extends Model {
  declare id: string;
  declare imageId: string | null;
  declare dateOfBirth: Date | null;
  declare dateOfDeath: Date | null;
  declare createdBy: string;
  declare lastEditedBy: string | null;
  declare deleted: boolean;
}

Artist.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    imageId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "image_id",
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date_of_birth",
    },
    dateOfDeath: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date_of_death",
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "created_by",
    },
    lastEditedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "last_edited_by",
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "artist",
    timestamps: true,
    underscored: true,
  }
);

export default Artist;
