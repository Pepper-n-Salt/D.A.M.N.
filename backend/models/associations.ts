import Artist from "./Artist.js";
import ArtistTranslation from "./ArtistTranslation.ts";
import Artwork from "./Artwork.ts";
import ArtworkTranslation from "./ArtworkTranslation.ts";
import ArtworkArtistAssociation from "./ArtworkArtistAssociation.ts"; // brauche ich diese wirklich?
import Exhibition from "./Exhibition.js";
import ExhibitionTranslation from "./ExhibitionTranslation.ts";
import Media from "./Media.ts";
import Organisation from "./Organisation.ts";
import User from "./User.ts";

// Organisation

Organisation.hasMany(User, {
  foreignKey: "organisationId",
});

User.belongsTo(Organisation, {
  foreignKey: "organisationId",
});

Organisation.belongsTo(Media, {
  foreignKey: "logoId",
});

// Media

Artist.belongsTo(Media, {
  foreignKey: "imageId",
});

Artwork.belongsTo(Media, {
  foreignKey: "imageId",
});

Exhibition.belongsTo(Media, {
  foreignKey: "coverImageId",
});

// User

Artist.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Artist.belongsTo(User, {
  foreignKey: "lastEditedBy",
  as: "editor",
});

Artwork.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Artwork.belongsTo(User, {
  foreignKey: "lastEditedBy",
  as: "editor",
});

Exhibition.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Exhibition.belongsTo(User, {
  foreignKey: "lastEditedBy",
  as: "editor",
});

// ArtistTranslation

Artist.hasMany(ArtistTranslation, {
  foreignKey: "artistId",
});

ArtistTranslation.belongsTo(Artist, {
  foreignKey: "artistId",
});

// ArtworkTranslation

Artwork.hasMany(ArtworkTranslation, {
  foreignKey: "artworkId",
});

ArtworkTranslation.belongsTo(Artwork, {
  foreignKey: "artworkId",
});

// ExhibitionTranslation

Exhibition.hasMany(ExhibitionTranslation, {
  foreignKey: "exhibitionId",
});

ExhibitionTranslation.belongsTo(Exhibition, {
  foreignKey: "exhibitionId",
});

// Artwork : Artist // n : m

Artwork.belongsToMany(Artist, {
  through: ArtworkArtistAssociation,
  foreignKey: "artworkId",
  otherKey: "artistId",
});

Artist.belongsToMany(Artwork, {
  through: ArtworkArtistAssociation,
  foreignKey: "artistId",
  otherKey: "artworkId",
});
