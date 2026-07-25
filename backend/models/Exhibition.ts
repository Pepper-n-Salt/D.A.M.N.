import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";

class Exhibition extends Model {
  declare id: string;
  declare coverImageId: string | null;
  declare startDate: Date;
  declare endDate: Date;
  declare openingEvent: string | null;
  declare specialEvent: string | null;
  declare closingEvent: string | null;
  declare createdBy: string;
  declare lastEditedBy: string | null;
  declare isArchived: boolean;
  declare isDeleted: boolean;
  declare primaryColor: string | null;
  declare secondaryColor: string | null;
  declare backgroundColor: string;
  declare textColor: string;
  declare headlineFont: string | null;
  declare textFont: string | null;
  declare roundness: "none" | "small" | "medium" | "large";
}

Exhibition.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    coverImageId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "cover_image_id",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "end_date",
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
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_archived",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_deleted",
    },
    primaryColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: "#000000",
      field: "primary_color",
    },
    secondaryColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      field: "secondary_color",
    },
    backgroundColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#ffffff",
      field: "background_color",
    },
    textColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "white",
      field: "text_color",
    },
    headlineFont: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "headline_font",
    },
    textFont: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "text_font",
    },
    roundness: {
      type: DataTypes.ENUM("none", "small", "medium", "large"),
      allowNull: false,
      defaultValue: "none",
    },
  },
  {
    sequelize: db,
    tableName: "exhibition",
    timestamps: true,
    underscored: true,
  }
);

export default Exhibition;
