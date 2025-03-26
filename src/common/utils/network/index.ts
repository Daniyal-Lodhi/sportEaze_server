import { UserType } from "src/common/enums/user/user-type.enum";

export function canConnect(requesterRole: UserType, receiverRole: UserType): boolean {
    const connectionRules: Record<UserType, UserType[]> = {
      [UserType.FAN]: [UserType.FAN, UserType.MENTOR],
      [UserType.PATRON]: [UserType.PATRON, UserType.MENTOR],
      [UserType.MENTOR]: [UserType.MENTOR, UserType.PATRON, UserType.FAN],
      [UserType.PLAYER]: [], // Players cannot form connections
    };

    return connectionRules[requesterRole].includes(receiverRole);
  }

  