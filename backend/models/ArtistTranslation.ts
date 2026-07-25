import { DataTypes, Model } from "sequelize";
import db from "../lib/db.ts";

class ArtistTranslation extends Model {
  declare artistId: string;
  declare languageCode: string;
  declare firstName: string;
  declare lastName: string;
  declare description: string | null;
  declare country: string;
  declare slug: string;
  declare aiGenerated: boolean;
  declare isScreen: boolean;
}

ArtistTranslation.init(
  {
    artistId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: "artist_id",
    },
    languageCode: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      field: "language_code",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    aiGenerated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "ai_generated",
    },
    isScreen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_screen",
    },
  },
  {
    sequelize: db,
    tableName: "artist_translation",
    timestamps: false,
    underscored: true,
  }
);

export default ArtistTranslation;
