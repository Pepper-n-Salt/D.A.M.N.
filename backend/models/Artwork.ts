import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

class Artwork extends Model {
  declare id: string;
  declare year: number | null;
  declare dimensions: string | null;
  declare imageId: string;
  declare createdBy: string;
  declare lastEditedBy: string | null;
  declare isDeleted: boolean;
}

Artwork.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    year: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    imageId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "image_id",
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
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_deleted",
    },
  },
  {
    sequelize: db,
    tableName: "artwork",
    timestamps: true,
    underscored: true,
  }
);

export default Artwork;
