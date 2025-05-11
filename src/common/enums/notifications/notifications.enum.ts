export enum NotificationType {
    CONNECTION_REQUEST = 1,
    CONNECTION_ACCEPTED = 2,
    FOLLOW = 3,
    POST_LIKED = 4,
    POST_COMMENTED = 5,
    MSG_RECEIVED = 6,
    CONTRACT_CREATED = 7,
    CONTRACT_UPDATED = 8,
    CONTRACT_ACCEPTED = 9,
}


export enum NotificationRedirectType {
    USER_ID = 1,
    POST_ID = 2,
    CHAT_ID = 3,
}