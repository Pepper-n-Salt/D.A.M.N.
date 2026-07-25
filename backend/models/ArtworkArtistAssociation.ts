import { DataTypes, Model } from "sequelize";
import db from "../lib/db.ts";

class ArtworkArtistAssociation extends Model {
  declare id: string;
  declare artworkId: string;
  declare artistId: string;
}

ArtworkArtistAssociation.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    artworkId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "artwork_id",
    },
    artistId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "artist_id",
    },
  },
  {
    sequelize: db,
    tableName: "artwork_artist_association",
    timestamps: false,
    underscored: true,
  }
);

export default ArtworkArtistAssociation;
