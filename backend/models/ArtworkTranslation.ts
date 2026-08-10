import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

class ArtworkTranslation extends Model {
  declare artworkId: string;
  declare languageCode: string;
  declare title: string;
  declare subtitle: string | null;
  declare origin: string | null;
  declare material: string | null;
  declare description: string | null;
  declare slug: string;
  declare aiGenerated: boolean;
  declare isScreen: boolean;
}

ArtworkTranslation.init(
  {
    artworkId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: "artwork_id",
    },
    languageCode: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      field: "language_code",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    origin: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false,
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
    tableName: "artwork_translation",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: "unique_artwork_translation_slug_per_language",
        fields: ["language_code", "slug"],
      },
    ],
  }
);

export default ArtworkTranslation;
