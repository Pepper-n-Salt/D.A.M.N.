import { DataTypes, Model } from "sequelize";
import db from "../lib/db.js";
import ArtistTranslation from "./ArtistTranslation.js";
import User from "./User.js";
import Media from "./Media.js";

class Artist extends Model {
  declare id: string;
  declare imageId: string | null;
  declare dateOfBirth: Date | null;
  declare dateOfDeath: Date | null;
  declare createdBy: string;
  declare lastEditedBy: string | null;
  declare isDeleted: boolean;

  declare ArtistTranslations?: ArtistTranslation[];
  declare creator?: User;
  declare Medium?: Media;
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
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_deleted",
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
