import Artist from "./Artist.js";
import ArtistTranslation from "./ArtistTranslation.js";
import Artwork from "./Artwork.js";
import ArtworkTranslation from "./ArtworkTranslation.js";
import ArtworkArtistAssociation from "./ArtworkArtistAssociation.js"; // was soll das?
import Exhibition from "./Exhibition.js";
import ExhibitionTranslation from "./ExhibitionTranslation.js";
import Media from "./Media.js";
import Organisation from "./Organisation.js";
import User from "./User.js";

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
