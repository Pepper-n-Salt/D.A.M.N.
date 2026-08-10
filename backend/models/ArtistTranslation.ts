import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

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
    // hier könnte es Probleme geben - wenn der Künstler in englisch und deutsch  ja der gleiche ist, dann ist der slug in beiden Sprachen gleich. Dann würde die unique constraint verletzt werden. Wir müssen also den slug pro Sprache eindeutig machen. Das bedeutet, dass wir die unique constraint auf (slug, language_code) setzen müssen. Dann kann der slug in verschiedenen Sprachen gleich sein, aber nicht in der gleichen Sprache.
    //  hier müssen wir unique: true weglassen - aber siehe Zeile 71
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
    tableName: "artist_translation",
    timestamps: false,
    underscored: true,
    // hier müssen wir die unique constraint auf (slug, language_code) setzen. Dann kann der slug in verschiedenen Sprachen gleich sein, aber nicht in der gleichen Sprache.
    indexes: [
      {
        unique: true,
        name: "unique_artist_translation_slug_per_language",
        fields: ["language_code", "slug"],
      },
    ],
  }
);

export default ArtistTranslation;
