import { MigrationInterface, QueryRunner } from "typeorm";

export class TableNameConventions1743108499696 implements MigrationInterface {
    name = 'TableNameConventions1743108499696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" DROP CONSTRAINT "FK_f69432f9c6c0052237d601c7db4"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP CONSTRAINT "FK_67a614446eab992e4d0580afebf"`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."postMedia_mediatype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."postMedia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaType" "sportEaze"."postMedia_mediatype_enum" NOT NULL, "mediaLink" character varying NOT NULL, "mediaThumbnail" character varying, "mediaOrder" integer NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_16997abe67085a9214352e42f78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."postLikes_reacttype_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."postLikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "reactType" "sportEaze"."postLikes_reacttype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_29f4abfe59a4ba82c8371037a20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."postComments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentCommentId" uuid, CONSTRAINT "PK_2a435e7782859bb301cf07e6a50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."patrons_patrontype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."patrons_supportedsports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."patrons_preferredplayerlevels_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."patrons_preferredfundingtypes_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."patrons_status_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."patrons" ("id" uuid NOT NULL, "patronType" "sportEaze"."patrons_patrontype_enum" NOT NULL, "industryType" character varying, "supportedSports" "sportEaze"."patrons_supportedsports_enum" array NOT NULL, "preferredPlayerLevels" "sportEaze"."patrons_preferredplayerlevels_enum" array NOT NULL, "preferredFundingTypes" "sportEaze"."patrons_preferredfundingtypes_enum" array NOT NULL, "website" character varying, "linkedIn" character varying, "fbLink" character varying, "xLink" character varying, "instaLink" character varying, "status" "sportEaze"."patrons_status_enum" NOT NULL DEFAULT '1', "reviewedByAdminId" uuid, "adminReviewComment" text, CONSTRAINT "PK_1adfd7a9fbee37c2558f07e2ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."users_gender_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."users_sportinterests_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."users_usertype_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "profilePicUrl" character varying NOT NULL DEFAULT 'https://res.cloudinary.com/dpe70dvug/image/upload/v1743014138/Untitled_200_x_200_px_1_cie24l.png', "fullName" character varying(100), "username" character varying(100), "dob" date, "gender" "sportEaze"."users_gender_enum", "sportInterests" "sportEaze"."users_sportinterests_enum" array, "userType" "sportEaze"."users_usertype_enum", "deleted" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."players_primarysport_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."players_secondarysports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."players_playinglevel_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."players" ("id" uuid NOT NULL, "primarySport" "sportEaze"."players_primarysport_enum" NOT NULL, "secondarySports" "sportEaze"."players_secondarysports_enum" array, "playingLevel" "sportEaze"."players_playinglevel_enum" NOT NULL, "currentTeam" character varying(50), "coachName" character varying(50), "playerBio" character varying(200), "trainingLocation" character varying(200), "fbLink" character varying(255), "instaLink" character varying(255), "xLink" character varying(255), "availableForSponsorship" boolean NOT NULL, CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."ratingAndReviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "review" character varying(100) NOT NULL, "playerId" uuid, CONSTRAINT "CHK_def5c14c38d0081ce837384c75" CHECK (rating >= 1 AND rating <= 5), CONSTRAINT "PK_ebce718abee7d4577d84a6eb83e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."contracts_status_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."contracts" ("contractId" SERIAL NOT NULL, "terms" character varying(100) NOT NULL, "start" date NOT NULL, "end" date NOT NULL, "status" "sportEaze"."contracts_status_enum" NOT NULL, "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_686f69fa690be997cd7ca5a77f1" PRIMARY KEY ("contractId"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."achievements" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "description" character varying(250), "dateAchieved" date NOT NULL, CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."followers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playerId" uuid NOT NULL, "followerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_36787d7df2eab731a3f65847a1e" UNIQUE ("playerId", "followerId"), CONSTRAINT "PK_c90cfc5b18edd29bd15ba95c1a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."connections_status_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "status" "sportEaze"."connections_status_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_871860083f7521d7cb204946eb" UNIQUE ("senderId"), CONSTRAINT "REL_7a7cc4dfe8b8fe397b1faf6698" UNIQUE ("receiverId"), CONSTRAINT "PK_0a1f844af3122354cbd487a8d03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postMedia" ADD CONSTRAINT "FK_d62b3cb0bbeaa943820bf232797" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postLikes" ADD CONSTRAINT "FK_d3a2b7367faf9b6bcf2428a2883" FOREIGN KEY ("userId") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postLikes" ADD CONSTRAINT "FK_26b3ed62ec22e48b9be15663ab0" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postComments" ADD CONSTRAINT "FK_a5684ccafa70506db03bf0ad975" FOREIGN KEY ("userId") REFERENCES "sportEaze"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postComments" ADD CONSTRAINT "FK_3e81ef6f8d912fa1e62ac7ca88a" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postComments" ADD CONSTRAINT "FK_8bff5b56a2bd7ad47ef06601f49" FOREIGN KEY ("parentCommentId") REFERENCES "sportEaze"."postComments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ADD CONSTRAINT "FK_f69432f9c6c0052237d601c7db4" FOREIGN KEY ("userId") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."patrons" ADD CONSTRAINT "FK_1adfd7a9fbee37c2558f07e2ed9" FOREIGN KEY ("id") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."players" ADD CONSTRAINT "FK_de22b8fdeee0c33ab55ae71da3b" FOREIGN KEY ("id") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."ratingAndReviews" ADD CONSTRAINT "FK_80973e6327fa01bb439603a060d" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."followers" ADD CONSTRAINT "FK_961531ce4bb0d72d182db1e6af1" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."followers" ADD CONSTRAINT "FK_451bb9eb792c3023a164cf14e0a" FOREIGN KEY ("followerId") REFERENCES "sportEaze"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."connections" ADD CONSTRAINT "FK_871860083f7521d7cb204946eb2" FOREIGN KEY ("senderId") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."connections" ADD CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a" FOREIGN KEY ("receiverId") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD CONSTRAINT "FK_67a614446eab992e4d0580afebf" FOREIGN KEY ("id") REFERENCES "sportEaze"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP CONSTRAINT "FK_67a614446eab992e4d0580afebf"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."connections" DROP CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."connections" DROP CONSTRAINT "FK_871860083f7521d7cb204946eb2"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."followers" DROP CONSTRAINT "FK_451bb9eb792c3023a164cf14e0a"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."followers" DROP CONSTRAINT "FK_961531ce4bb0d72d182db1e6af1"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."ratingAndReviews" DROP CONSTRAINT "FK_80973e6327fa01bb439603a060d"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."players" DROP CONSTRAINT "FK_de22b8fdeee0c33ab55ae71da3b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."patrons" DROP CONSTRAINT "FK_1adfd7a9fbee37c2558f07e2ed9"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" DROP CONSTRAINT "FK_f69432f9c6c0052237d601c7db4"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postComments" DROP CONSTRAINT "FK_8bff5b56a2bd7ad47ef06601f49"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postComments" DROP CONSTRAINT "FK_3e81ef6f8d912fa1e62ac7ca88a"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postComments" DROP CONSTRAINT "FK_a5684ccafa70506db03bf0ad975"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postLikes" DROP CONSTRAINT "FK_26b3ed62ec22e48b9be15663ab0"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postLikes" DROP CONSTRAINT "FK_d3a2b7367faf9b6bcf2428a2883"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."postMedia" DROP CONSTRAINT "FK_d62b3cb0bbeaa943820bf232797"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."connections"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."connections_status_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."followers"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."achievements"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."contracts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."contracts_status_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."ratingAndReviews"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."players"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."players_playinglevel_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."players_secondarysports_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."players_primarysport_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."users"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."users_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."users_sportinterests_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."patrons"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."patrons_status_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."patrons_preferredfundingtypes_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."patrons_preferredplayerlevels_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."patrons_supportedsports_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."patrons_patrontype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."postComments"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."postLikes"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."postLikes_reacttype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."postMedia"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."postMedia_mediatype_enum"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD CONSTRAINT "FK_67a614446eab992e4d0580afebf" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ADD CONSTRAINT "FK_f69432f9c6c0052237d601c7db4" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
