import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

class Media extends Model {
  declare id: string;
  declare mimeType: string;
  declare fileUrl: string;
  declare publicId: string; // brauchen wir, um das bild später aus cloudinary löschen oder ersetzen zu können
}

Media.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    publicId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "public_id",
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
