import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

class ExhibitionTranslation extends Model {
  declare exhibitionId: string;
  declare languageCode: string;
  declare title: string;
  declare subtitle: string | null;
  declare location: string | null;
  declare description: string | null;
  declare openingEvent: string | null;
  declare specialEvent: string | null;
  declare closingEvent: string | null;
  // declare slug: string;
  declare aiGenerated: boolean;
  declare isScreen: boolean;
}

ExhibitionTranslation.init(
  {
    exhibitionId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: "exhibition_id",
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
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    openingEvent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "opening_event",
    },
    specialEvent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "special_event",
    },
    closingEvent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "closing_event",
    },
    // slug: {
    //   type: DataTypes.STRING(100),
    //   allowNull: false,
    // },
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
    tableName: "exhibition_translation",
    timestamps: false,
    underscored: true,
  }
);

export default ExhibitionTranslation;
