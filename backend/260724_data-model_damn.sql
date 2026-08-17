CREATE TABLE "exhibition_translation"(
    "exhibition_id" UUID NOT NULL,
    "language_code" VARCHAR(7) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255) NULL,
    "location" VARCHAR(255) NULL,
    "description" TEXT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "ai_generated" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_screen" BOOLEAN NOT NULL DEFAULT FALSE
);
ALTER TABLE
    "exhibition_translation" ADD PRIMARY KEY("exhibition_id", "language_code");
ALTER TABLE
    "exhibition_translation" ADD CONSTRAINT "exhibition_translation_language_code_unique" UNIQUE("language_code");
ALTER TABLE
    "exhibition_translation" ADD CONSTRAINT "exhibition_translation_slug_unique" UNIQUE("slug");
CREATE TABLE "exhibition"(
    "id" UUID NOT NULL,
    "cover_image_id" UUID NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "opening_event" VARCHAR(255) NULL,
    "special_event" VARCHAR(255) NULL,
    "closing_event" VARCHAR(255) NULL,
    "created_by" UUID NOT NULL,
    "last_edited_by" UUID NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT FALSE,
    "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "primary_color" VARCHAR(7) NULL DEFAULT '#000000',
    "secondary_color" VARCHAR(7) NULL,
    "background_color" VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    "text_color" VARCHAR(7) NOT NULL DEFAULT 'white',
    "headline_font" VARCHAR(255) NULL,
    "text_font" VARCHAR(255) NULL,
    "roundness" VARCHAR(255) CHECK
        (
            "roundness" IN('none', 'small', 'medium', 'large')
        ) NOT NULL DEFAULT 'none'
);
ALTER TABLE
    "exhibition" ADD PRIMARY KEY("id");
CREATE TABLE "artwork_translation"(
    "artwork_id" UUID NOT NULL,
    "language_code" VARCHAR(7) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255) NULL,
    "origin" VARCHAR(255) NULL,
    "material" VARCHAR(255) NULL,
    "description" TEXT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "ai_generated" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_screen" BOOLEAN NOT NULL DEFAULT FALSE
);
ALTER TABLE
    "artwork_translation" ADD PRIMARY KEY("artwork_id", "language_code");
ALTER TABLE
    "artwork_translation" ADD CONSTRAINT "artwork_translation_language_code_unique" UNIQUE("language_code");
ALTER TABLE
    "artwork_translation" ADD CONSTRAINT "artwork_translation_slug_unique" UNIQUE("slug");
CREATE TABLE "artwork"(
    "id" UUID NOT NULL,
    "year" BIGINT NULL,
    "dimensions" VARCHAR(255) NULL,
    "image_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "last_edited_by" UUID NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "artwork" ADD PRIMARY KEY("id");
CREATE TABLE "artwork_artist_association"(
    "id" UUID NOT NULL,
    "artist_id" UUID NOT NULL,
    "artwork_id" UUID NOT NULL
);
ALTER TABLE
    "artwork_artist_association" ADD PRIMARY KEY("id");
CREATE TABLE "artist_translation"(
    "artist_id" UUID NOT NULL,
    "language_code" VARCHAR(7) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "country" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "ai_generated" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_screen" BOOLEAN NOT NULL DEFAULT FALSE
);
ALTER TABLE
    "artist_translation" ADD PRIMARY KEY("artist_id", "language_code");
ALTER TABLE
    "artist_translation" ADD CONSTRAINT "artist_translation_language_code_unique" UNIQUE("language_code");
ALTER TABLE
    "artist_translation" ADD CONSTRAINT "artist_translation_slug_unique" UNIQUE("slug");
CREATE TABLE "artist"(
    "id" UUID NOT NULL,
    "image_id" UUID NULL,
    "date_of_birth" DATE NULL,
    "date_of_death" DATE NULL,
    "created_by" UUID NOT NULL,
    "last_edited_by" UUID NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "artist" ADD PRIMARY KEY("id");
CREATE TABLE "media"(
    "id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL
);
ALTER TABLE
    "media" ADD PRIMARY KEY("id");
CREATE TABLE "user"(
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) CHECK
        ("role" IN('super', 'admin', 'user')) NOT NULL,
        "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "user" ADD PRIMARY KEY("id");
CREATE INDEX "user_organisation_id_index" ON
    "user"("organisation_id");
ALTER TABLE
    "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");
CREATE TABLE "organisation"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo_id" UUID NOT NULL
);
ALTER TABLE
    "organisation" ADD PRIMARY KEY("id");
ALTER TABLE
    "organisation" ADD CONSTRAINT "organisation_name_unique" UNIQUE("name");
ALTER TABLE
    "artwork" ADD CONSTRAINT "artwork_created_by_foreign" FOREIGN KEY("created_by") REFERENCES "user"("id");
ALTER TABLE
    "artwork_artist_association" ADD CONSTRAINT "artwork_artist_association_artwork_id_foreign" FOREIGN KEY("artwork_id") REFERENCES "artwork"("id");
ALTER TABLE
    "artwork" ADD CONSTRAINT "artwork_image_id_foreign" FOREIGN KEY("image_id") REFERENCES "media"("id");
ALTER TABLE
    "artwork" ADD CONSTRAINT "artwork_last_edited_by_foreign" FOREIGN KEY("last_edited_by") REFERENCES "user"("id");
ALTER TABLE
    "artwork_translation" ADD CONSTRAINT "artwork_translation_artwork_id_foreign" FOREIGN KEY("artwork_id") REFERENCES "artwork"("id");
ALTER TABLE
    "exhibition_translation" ADD CONSTRAINT "exhibition_translation_exhibition_id_foreign" FOREIGN KEY("exhibition_id") REFERENCES "exhibition"("id");
ALTER TABLE
    "artist_translation" ADD CONSTRAINT "artist_translation_artist_id_foreign" FOREIGN KEY("artist_id") REFERENCES "artist"("id");
ALTER TABLE
    "artwork_artist_association" ADD CONSTRAINT "artwork_artist_association_artist_id_foreign" FOREIGN KEY("artist_id") REFERENCES "artist"("id");
ALTER TABLE
    "exhibition" ADD CONSTRAINT "exhibition_cover_image_id_foreign" FOREIGN KEY("cover_image_id") REFERENCES "media"("id");
ALTER TABLE
    "exhibition" ADD CONSTRAINT "exhibition_created_by_foreign" FOREIGN KEY("created_by") REFERENCES "user"("id");
ALTER TABLE
    "artist" ADD CONSTRAINT "artist_created_by_foreign" FOREIGN KEY("created_by") REFERENCES "user"("id");
ALTER TABLE
    "exhibition" ADD CONSTRAINT "exhibition_last_edited_by_foreign" FOREIGN KEY("last_edited_by") REFERENCES "user"("id");
ALTER TABLE
    "organisation" ADD CONSTRAINT "organisation_logo_id_foreign" FOREIGN KEY("logo_id") REFERENCES "media"("id");
ALTER TABLE
    "artist" ADD CONSTRAINT "artist_image_id_foreign" FOREIGN KEY("image_id") REFERENCES "media"("id");
ALTER TABLE
    "artist" ADD CONSTRAINT "artist_last_edited_by_foreign" FOREIGN KEY("last_edited_by") REFERENCES "user"("id");
ALTER TABLE
    "user" ADD CONSTRAINT "user_organisation_id_foreign" FOREIGN KEY("organisation_id") REFERENCES "organisation"("id");