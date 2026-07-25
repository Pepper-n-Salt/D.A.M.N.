import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

class Media extends Model {
  declare id: string;
  declare fileName: string;
  declare mimeType: string;
  declare fileUrl: string;
}

Media.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "file_name",
    },
    mimeType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "mime_type",
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "file_url",
    },
  },
  {
    sequelize: db,
    tableName: "media",
    timestamps: false,
    underscored: true,
  }
);

export default Media;
