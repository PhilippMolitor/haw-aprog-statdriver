-- noinspection SqlNoDataSourceInspectionForFile

PRAGMA foreign_keys = false;

DROP TABLE IF EXISTS "entries";
CREATE TABLE "entries"
(
    "entry_id"      INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scoreboard_id" INTEGER NOT NULL,
    "player_name"   TEXT    NOT NULL,
    "score"         integer NOT NULL,
    "date"          DATE    NOT NULL DEFAULT (datetime('now', 'localtime')),
    CONSTRAINT "entries_scoreboard_id__scoreboards_scoreboard_id" FOREIGN KEY ("scoreboard_id") REFERENCES "scoreboards" ("scoreboard_id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "games";
CREATE TABLE "games"
(
    "game_id"  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner_id" INTEGER NOT NULL,
    "name"     TEXT    NOT NULL,
    CONSTRAINT "games_owner_id__user_user_id" FOREIGN KEY ("owner_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "scoreboards";
CREATE TABLE "scoreboards"
(
    "scoreboard_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "game_id"       INTEGER NOT NULL,
    "name"          TEXT    NOT NULL,
    "set_key"       TEXT    NOT NULL,
    "get_key"       TEXT    NOT NULL,
    "embed_enabled" integer NOT NULL DEFAULT 0,
    "embed_title"   TEXT    NOT NULL,
    CONSTRAINT "scoreboards_scoreboard_id__game_game_id" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "users";
CREATE TABLE "users"
(
    "user_id"       INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"          TEXT    NOT NULL,
    "password_hash" TEXT    NOT NULL,
    "email"         TEXT    NOT NULL
);

DROP TABLE IF EXISTS "installed";
CREATE TABLE "installed"
(
    "installed" INTEGER NULL
);

PRAGMA foreign_keys = true;
