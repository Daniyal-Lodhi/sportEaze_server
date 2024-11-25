import { DeleteSocialMediaDto } from "src/modules/user/player/dto/delete-socia-media-links.dto";
import { Player } from "src/modules/user/player/entities/player.entity";

export function HandleDeleteSocialMediaLink(
  deleteSocialMediaLinkDto: DeleteSocialMediaDto,
  player: Player,
): string {
  let msg: string = "Deleted ";

  if (deleteSocialMediaLinkDto.Delete_FB_link) {
    player.FB_link = null;
    msg += "Facebook, ";
  }

  if (deleteSocialMediaLinkDto.Delete_INSTA_link) {
    player.INSTA_link = null;
    msg += "Instagram, ";
  }

  if (deleteSocialMediaLinkDto.Delete_X_link) {
    player.X_link = null;
    msg += "X, ";
  }

  return msg.substring(0, msg.length - 2) + " link(s)";
}
