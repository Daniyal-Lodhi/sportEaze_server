import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseStructure1747352551944 implements MigrationInterface {
    name = 'BaseStructure1747352551944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sportEaze"."AppSettings" ("id" SERIAL NOT NULL, "allowDeleteUser" boolean NOT NULL DEFAULT true, "allowUpdateUser" boolean NOT NULL DEFAULT true, "shouldTakeConsent" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_6aa09b2e72fe676f59619a8045d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_role_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_sportinterests_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."mentors_primarysport_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."mentors" ("id" uuid NOT NULL, "role" "sportEaze"."mentors_role_enum" NOT NULL, "sportInterests" "sportEaze"."mentors_sportinterests_enum" array NOT NULL, "primarySport" "sportEaze"."mentors_primarysport_enum", "bio" character varying, "yearsOfExperience" integer, "currentAffiliation" character varying(255), "website" character varying, "linkedIn" character varying, "fbLink" character varying, "xLink" character varying, "instaLink" character varying, "verificationDocuments" text array, CONSTRAINT "PK_67a614446eab992e4d0580afebf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Endorsements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer, "review" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL, "playerId" uuid, "mentorId" uuid, CONSTRAINT "CHK_a3c5adfea8afc1aead21512835" CHECK (rating >= 1 AND rating <= 5), CONSTRAINT "PK_4ccc95f4ad44fec089566615100" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "amount" integer NOT NULL, "isAchieved" boolean NOT NULL DEFAULT false, "isPaid" boolean NOT NULL DEFAULT false, "contractId" uuid, CONSTRAINT "PK_3035946cbed11e88315905ccebb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Contracts_status_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(255) NOT NULL, "totalAmount" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" "sportEaze"."Contracts_status_enum" NOT NULL DEFAULT '1', "patronId" uuid, "playerId" uuid, CONSTRAINT "PK_4f88addbb8b532d6e46459c8755" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_primarysport_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_secondarysports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Player_playinglevel_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Player" ("id" uuid NOT NULL, "primarySport" "sportEaze"."Player_primarysport_enum" NOT NULL, "secondarySports" "sportEaze"."Player_secondarysports_enum" array, "playingLevel" "sportEaze"."Player_playinglevel_enum" NOT NULL, "currentTeam" character varying(50), "coachName" character varying(50), "playerBio" character varying(200), "trainingLocation" character varying(200), "fbLink" character varying(255), "instaLink" character varying(255), "xLink" character varying(255), "availableForSponsorship" boolean NOT NULL, CONSTRAINT "PK_c390d9968607986a5f038e3305e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostMedia_mediatype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."PostMedia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaType" "sportEaze"."PostMedia_mediatype_enum" NOT NULL, "mediaLink" character varying NOT NULL, "mediaThumbnail" character varying, "mediaOrder" integer NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_09a711528b07c186c8853981495" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."PostLikes_reacttype_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."PostLikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "reactType" "sportEaze"."PostLikes_reacttype_enum" NOT NULL DEFAULT '2', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f28e59e14e5f90fbd763c541751" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."PostComments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentCommentId" uuid, CONSTRAINT "PK_2440dc3d7ccd7aff688fc008336" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_visibility_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Posts_posttype_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "textContent" text NOT NULL, "visibility" "sportEaze"."Posts_visibility_enum" NOT NULL DEFAULT '1', "shareCount" integer NOT NULL DEFAULT '0', "postType" "sportEaze"."Posts_posttype_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid, "milestoneId" uuid, CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SharedPosts_visibility_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SharedPosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shareMessage" character varying, "visibility" "sportEaze"."SharedPosts_visibility_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "originalPostId" uuid, CONSTRAINT "PK_5380853888c1d325c9281436832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_gender_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_sportinterests_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Users_usertype_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "profilePicUrl" character varying NOT NULL DEFAULT 'https://res.cloudinary.com/dpe70dvug/image/upload/v1743014138/Untitled_200_x_200_px_1_cie24l.png', "fullName" character varying(100), "username" character varying(100), "dob" date, "gender" "sportEaze"."Users_gender_enum", "sportInterests" "sportEaze"."Users_sportinterests_enum" array, "userType" "sportEaze"."Users_usertype_enum", "deleted" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_patrontype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_supportedsports_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_preferredplayerlevels_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_preferredfundingtypes_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Patron_status_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Patron" ("id" uuid NOT NULL, "patronType" "sportEaze"."Patron_patrontype_enum" NOT NULL, "industryType" character varying, "supportedSports" "sportEaze"."Patron_supportedsports_enum" array NOT NULL, "preferredPlayerLevels" "sportEaze"."Patron_preferredplayerlevels_enum" array NOT NULL, "preferredFundingTypes" "sportEaze"."Patron_preferredfundingtypes_enum" array NOT NULL, "website" character varying, "linkedIn" character varying, "fbLink" character varying, "xLink" character varying, "instaLink" character varying, "status" "sportEaze"."Patron_status_enum" NOT NULL DEFAULT '1', "adminReviewComment" text, CONSTRAINT "PK_d6aee0f33518f9362cbcc901356" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cash" integer NOT NULL DEFAULT '0', "payables" integer DEFAULT '0', "patronId" uuid, "playerId" uuid, CONSTRAINT "REL_e25ad6cd7a2ffb94f17c3e7a8c" UNIQUE ("patronId"), CONSTRAINT "REL_1b819dbb677310c78fa807ece0" UNIQUE ("playerId"), CONSTRAINT "PK_22643866c3dcd5442c341d43b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cityName" character varying(100) NOT NULL, CONSTRAINT "PK_52e5d0236e8f2bca8b2792b1e3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Achievements" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "description" character varying(250), "dateAchieved" date NOT NULL, CONSTRAINT "PK_875a7fc75abffd6cbca8adccbd8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."notifications_type_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "sportEaze"."notifications_type_enum" NOT NULL, "redirect" uuid NOT NULL, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL, "actorUserId" uuid, "recipientUserId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user1Id" uuid, "user2Id" uuid, CONSTRAINT "PK_64c36c2b8d86a0d5de4cf64de8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "sentAt" TIMESTAMP NOT NULL, "chatId" uuid, "senderId" uuid, CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."Connections_status_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "status" "sportEaze"."Connections_status_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0ee1f6fd09d463a63ca7cded8b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."Followers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playerId" uuid NOT NULL, "followerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_80d91d874a653fda1e5bdd1110f" UNIQUE ("playerId", "followerId"), CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPostMedia_mediatype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SponsoredPostMedia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaType" "sportEaze"."SponsoredPostMedia_mediatype_enum" NOT NULL, "mediaLink" character varying NOT NULL, "mediaThumbnail" character varying, "mediaOrder" integer NOT NULL, "sponsoredPostId" uuid NOT NULL, CONSTRAINT "PK_fb172ce6568322429d2fe77a80b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPosts_posttype_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SponsoredPosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postType" "sportEaze"."SponsoredPosts_posttype_enum" NOT NULL, "text" text NOT NULL, "ctaLink" text NOT NULL, "targetAudienceAge" character varying(20) NOT NULL, "targetReachableUsers" integer NOT NULL, "amountToSpend" integer NOT NULL, "currency" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af9b42ccc2530ec99ffca517942" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "sportEaze"."SponsoredPostTargetSports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sponsoredPostId" uuid NOT NULL, "sport" "sportEaze"."SponsoredPostTargetSports_sport_enum" NOT NULL, CONSTRAINT "PK_898b0f8a7c49803e545d9cba201" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" ADD CONSTRAINT "FK_67a614446eab992e4d0580afebf" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" ADD CONSTRAINT "FK_88ea7550d553b1ab8d77e3bb569" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" ADD CONSTRAINT "FK_2fa4c0c6a78b3d0bc28a49035a3" FOREIGN KEY ("mentorId") REFERENCES "sportEaze"."mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" ADD CONSTRAINT "FK_851e8f28d8b9a58015df0cc76a6" FOREIGN KEY ("contractId") REFERENCES "sportEaze"."Contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "FK_c26e56a62413f1fb283d5b5920a" FOREIGN KEY ("patronId") REFERENCES "sportEaze"."Patron"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" ADD CONSTRAINT "FK_05655610e77f99bc8814af2b72c" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" ADD CONSTRAINT "FK_c390d9968607986a5f038e3305e" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostMedia" ADD CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ADD CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" ADD CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "sportEaze"."Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" ADD CONSTRAINT "FK_b02e05c9e50df1545bddaf89118" FOREIGN KEY ("parentCommentId") REFERENCES "sportEaze"."PostComments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_e97295d43146eedfbced74f9af8" FOREIGN KEY ("contractId") REFERENCES "sportEaze"."Contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" ADD CONSTRAINT "FK_c8338fde48c5a41672ff831ec81" FOREIGN KEY ("milestoneId") REFERENCES "sportEaze"."Milestones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ADD CONSTRAINT "FK_f69432f9c6c0052237d601c7db4" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" ADD CONSTRAINT "FK_6bd0c3d39dedcef6ed351acca19" FOREIGN KEY ("originalPostId") REFERENCES "sportEaze"."Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" ADD CONSTRAINT "FK_d6aee0f33518f9362cbcc901356" FOREIGN KEY ("id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD CONSTRAINT "FK_e25ad6cd7a2ffb94f17c3e7a8c3" FOREIGN KEY ("patronId") REFERENCES "sportEaze"."Patron"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" ADD CONSTRAINT "FK_1b819dbb677310c78fa807ece05" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ADD CONSTRAINT "FK_016a812ce05a5f196c44d7faedc" FOREIGN KEY ("actorUserId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" ADD CONSTRAINT "FK_0be815cabd15a62a5546a4b1357" FOREIGN KEY ("recipientUserId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" ADD CONSTRAINT "FK_29ebdd46ca7a26482aae61bd8a1" FOREIGN KEY ("user1Id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" ADD CONSTRAINT "FK_64db13a97e3338d4c00f6c6913e" FOREIGN KEY ("user2Id") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" ADD CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e" FOREIGN KEY ("chatId") REFERENCES "sportEaze"."Chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" ADD CONSTRAINT "FK_b4f327890b06f4fd32a2697103c" FOREIGN KEY ("senderId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_afc8205a0693827a5c269e2116b" FOREIGN KEY ("senderId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" ADD CONSTRAINT "FK_02987a11281e42d09924ff1aa58" FOREIGN KEY ("receiverId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe" FOREIGN KEY ("playerId") REFERENCES "sportEaze"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "sportEaze"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostMedia" ADD CONSTRAINT "FK_010b850d2806b75cae6711bf61c" FOREIGN KEY ("sponsoredPostId") REFERENCES "sportEaze"."SponsoredPosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" ADD CONSTRAINT "FK_eb6b18699495add3e4202536cc9" FOREIGN KEY ("userId") REFERENCES "sportEaze"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostTargetSports" ADD CONSTRAINT "FK_4536086bf2a57cbc1a29ffe3c51" FOREIGN KEY ("sponsoredPostId") REFERENCES "sportEaze"."SponsoredPosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostTargetSports" DROP CONSTRAINT "FK_4536086bf2a57cbc1a29ffe3c51"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPosts" DROP CONSTRAINT "FK_eb6b18699495add3e4202536cc9"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SponsoredPostMedia" DROP CONSTRAINT "FK_010b850d2806b75cae6711bf61c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Followers" DROP CONSTRAINT "FK_e23570f14dc2e46a348ac0618fe"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_02987a11281e42d09924ff1aa58"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Connections" DROP CONSTRAINT "FK_afc8205a0693827a5c269e2116b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" DROP CONSTRAINT "FK_b4f327890b06f4fd32a2697103c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Messages" DROP CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" DROP CONSTRAINT "FK_64db13a97e3338d4c00f6c6913e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Chats" DROP CONSTRAINT "FK_29ebdd46ca7a26482aae61bd8a1"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" DROP CONSTRAINT "FK_0be815cabd15a62a5546a4b1357"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."notifications" DROP CONSTRAINT "FK_016a812ce05a5f196c44d7faedc"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP CONSTRAINT "FK_1b819dbb677310c78fa807ece05"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Wallets" DROP CONSTRAINT "FK_e25ad6cd7a2ffb94f17c3e7a8c3"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Patron" DROP CONSTRAINT "FK_d6aee0f33518f9362cbcc901356"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" DROP CONSTRAINT "FK_6bd0c3d39dedcef6ed351acca19"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."SharedPosts" DROP CONSTRAINT "FK_f69432f9c6c0052237d601c7db4"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_c8338fde48c5a41672ff831ec81"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_e97295d43146eedfbced74f9af8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_b02e05c9e50df1545bddaf89118"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostComments" DROP CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" DROP CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostLikes" DROP CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."PostMedia" DROP CONSTRAINT "FK_40da232e721e9e7bf5ac9845b9c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Player" DROP CONSTRAINT "FK_c390d9968607986a5f038e3305e"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "FK_05655610e77f99bc8814af2b72c"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Contracts" DROP CONSTRAINT "FK_c26e56a62413f1fb283d5b5920a"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Milestones" DROP CONSTRAINT "FK_851e8f28d8b9a58015df0cc76a6"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" DROP CONSTRAINT "FK_2fa4c0c6a78b3d0bc28a49035a3"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."Endorsements" DROP CONSTRAINT "FK_88ea7550d553b1ab8d77e3bb569"`);
        await queryRunner.query(`ALTER TABLE "sportEaze"."mentors" DROP CONSTRAINT "FK_67a614446eab992e4d0580afebf"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SponsoredPostTargetSports"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPostTargetSports_sport_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SponsoredPosts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPosts_posttype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SponsoredPostMedia"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SponsoredPostMedia_mediatype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Followers"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Connections"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Connections_status_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Messages"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Chats"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."notifications"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Achievements"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Locations"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Wallets"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Patron"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_status_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_preferredfundingtypes_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_preferredplayerlevels_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_supportedsports_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Patron_patrontype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Users"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_sportinterests_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."SharedPosts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."SharedPosts_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Posts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_posttype_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Posts_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."PostComments"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."PostLikes"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostLikes_reacttype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."PostMedia"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."PostMedia_mediatype_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Player"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_playinglevel_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_secondarysports_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Player_primarysport_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Contracts"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."Contracts_status_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Milestones"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."Endorsements"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."mentors"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_primarysport_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_sportinterests_enum"`);
        await queryRunner.query(`DROP TYPE "sportEaze"."mentors_role_enum"`);
        await queryRunner.query(`DROP TABLE "sportEaze"."AppSettings"`);
    }

}
