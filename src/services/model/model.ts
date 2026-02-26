export class Application {
    appName!: string;
    title!: string;
    shortTitle!: string;
    host!: string;
}

export class AllComponentsResponse {
    apps!: { [s: string]: Application; };
    domain!: string;
}

export class CardApp {
    title!: string;
    shortTitle!: string;
    appName!: string;
    isFavorite!: boolean;
    host!: string;

    constructor(title: string, shortTitle: string, appName: string, host: string, isFavorite: boolean = false) {
        this.title = title;
        this.shortTitle = shortTitle;
        this.appName = appName;
        this.isFavorite = isFavorite;
        this.host = host;
    }
}

export class Token {
    bearer!: string;
    expirationTime!: number;
    createAt!: number;
}

enum ValidPermit {
    VALID = "VALID",
    INVALID = "INVALID"
}
export enum EModeAdministration {
    ROOT = "ROOT",
    ADMIN = "ADMIN",
    USER = "USER"
}

export class PostLoginResponse {
    groups!: Map<string, ValidPermit>;
    error!: any;
    applicationToken!: Token;
    aplications!: string[]
}

export class MemberOf {
    name!: string;
    cn!: string;
    bankCode!: string;
}

export class TokenContent {
    aplications!: string[];
    bankCode!: string;
    userOu!: string;
    name!: string;
    username!: string;
    memberOf!: MemberOf[];
    memberOfBanks!: string[];
    maxUserLvl!: EModeAdministration;
}

export class GetLoginResponse {
    content!: TokenContent;
    valid!: boolean;
}

class ErrorDetail {
    type!: string
    message!: string
}

export class ErrorResponse {
    code!: string
    status!: number
    title!: string
    message!: string
    instance!: string
    details!: ErrorDetail[]
}

export class Ou {
    name!: string;
    distinguishedName!: string;
    users!: User[]
    bankCode!: string;
}

export class User {
    cn!: string;
    name!: string;
    samAccountName!: string;
    userPrincipalName!: string;
    displayName!: string;
    givenName!: string;
    sn!: string;
    distinguishedName!: string;
    memberOf!: MemberOf[];
    accountExpires: number;
}

export class UserDto {
    cn!: string;
    name!: string;
    samAccountName!: string;
    userPrincipalName!: string;
    displayName!: string;
    givenName!: string;
    sn!: string;
    distinguishedName!: string;
    memberOf!: MemberOf[];
    accountExpires: number;
    bankCode!: string;
    maxUserLvl!: string;
}

export class GetUserResponse {
    ous!: Ou[];
    users!: UserDto[];
}

export class Group {
    samaccountName!: string;
    distinguishedName!: string;
}

export class GetGroupsResponse {
    groups!: Group[];
}
