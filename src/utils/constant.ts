const regExpUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\/+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\/+.~#?&//=]*)/;

const regExpUrlPicture = /https?:\/\/.*\.(jpg|jpeg|png|gif)/i;

const STATUS_CREATED = 201;

export { regExpUrl, regExpUrlPicture, STATUS_CREATED };
