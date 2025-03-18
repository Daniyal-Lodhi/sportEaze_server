import { DeleteSocialMediaDto } from "src/modules/user/player/dto/delete-socia-media-links.dto";
import { Player } from "src/modules/user/player/entities/player.entity";

export function HandleDeleteSocialMediaLink(
  deleteSocialMediaLinkDto: DeleteSocialMediaDto,
  player: Player,
): string {
  let msg: string = "Deleted ";

  if (deleteSocialMediaLinkDto.deleteFbLink) {
    player.fbLink = null;
    msg += "Facebook, ";
  }

  if (deleteSocialMediaLinkDto.deleteInstaLink) {
    player.instaLink = null;
    msg += "Instagram, ";
  }

  if (deleteSocialMediaLinkDto.deleteXLink) {
    player.xLink = null;
    msg += "X, ";
  }

  return msg.substring(0, msg.length - 2) + " link(s)";
}
