import {
    Ammo,
    Attachments,
    Grenades,
    Heavies,
    Medical,
    Misc,
    Pistols,
    Push,
    Rifles,
    RocketLaunchers,
    SMGs, Snipers, TheHide, TTT, Vehicles
} from "./itemEnums";

interface PlayerInspect {
    PlayerName: string;
    UniqueId: string;
    KDA: string;
    Score: string;
    Dead: boolean;
    Cash: string;
    TeamId: string;
    Ping: number;
    Gag: boolean;
}

export enum GameModes {
    DeathMatch= "DM",
    KingOfTheHill= "KOTH",
    GunGame= "GUN",
    OneInTheChamber= "OITC",
    SearchAndDestroy= "SND",
    WW2TeamDeathMatch= "WW2TDM",
    TeamDeathMatch= "TDM",
    TroubleInTerroristTown= "TTT",
    TroubleInTerroristTownClassic= "TTTclassic",
    WW2GunGame= "WW2GUN",
    ZombieWaveSurvival= "ZWV",
    TheHidden= "HIDE",
    HiddenInfection= "INFECTION",
    Push= "PUSH",
    PropHunt= "PH",
}

export enum AmmoTypes {
    Unlimited= 0,
    LimitedGeneric= 1,
    LimitedSpecific= 2,
    Custom= 3,
    LimitedSpecial= 4,
    Boxless= 5,
}

export const Items = {
    Ammo: Ammo,
    Attachments: Attachments,
    Grenades: Grenades,
    Heavies: Heavies,
    Medical: Medical,
    Misc: Misc,
    Pistols: Pistols,
    Push: Push,
    Rifles: Rifles,
    RocketLaunchers: RocketLaunchers,
    SMGs: SMGs,
    Snipers: Snipers,
    TheHide: TheHide,
    TTT: TTT,
    Vehicles: Vehicles,
}

export enum TTTRole {
    Detective= "Detective",
    Sheriff= "Sheriff",
    Tank= "Tank",
    Innocent= "Innocent",
    Mercenary= "Mercenary",
    Survivalist= "Survivalist",
    Glitch= "Glitch",
    Jester= "Jester",
    Psychopath= "Psychopath",
    LoneWolf= "Lone Wolf",
    Traitor= "Traitor",
    Hypnotist= "Hypnotist",
    Soulmate= "Soulmate",
    Zombie= "Zombie",
}

export interface BaseCommandResponse {
    Command: string;
    Successful: boolean;
}

export interface AddModResponse extends BaseCommandResponse {
    AddMod: boolean;
    UniqueID: string;
}

export interface BanResponse extends BaseCommandResponse {
    Ban: boolean;
    UniqueID: string;
}

export interface BanlistResponse extends BaseCommandResponse {
    BanList: string[];
}

export interface EnableCompModeResponse extends BaseCommandResponse {
    CompModeState: boolean;
    EnableCompMode: boolean;
}

export interface EnableVerboseLoggingResponse extends BaseCommandResponse {
    VerboseLoggingState: boolean;
    EnableVerboseLogging: boolean;
}

export interface EnableWhitelistResponse extends BaseCommandResponse {
    WhiteListState: boolean;
    EnableWhiteList: boolean;
}

export interface GagResponse extends BaseCommandResponse {
    Gag: boolean;
    UniqueID: string;
}

export interface GiveAllResponse extends BaseCommandResponse {
    GiveAll: boolean;
    TeamID: string;
    ItemID: string;
}

export interface GiveCashResponse extends BaseCommandResponse {
    GiveCash: boolean;
    UniqueID: string;
}

export interface GiveItemResponse extends BaseCommandResponse {
    GiveItem: boolean;
    UniqueID: string;
}

export interface GiveTeamCashResponse extends BaseCommandResponse {
    GiveTeamCash: boolean;
    TeamID: string;
}

export interface InspectAllResponse extends BaseCommandResponse {
    InspectList: PlayerInspect[];
}

export interface InspectPlayerResponse extends BaseCommandResponse {
    PlayerInfo: PlayerInspect;
}

export interface InspectTeamResponse extends BaseCommandResponse {
    InspectList: PlayerInspect[];
}

export interface ItemListResponse extends BaseCommandResponse {
    ItemList: string[];
}

export interface KickResponse extends BaseCommandResponse {
    UniqueID: string;
    Kick: boolean;
}

export interface KillResponse extends BaseCommandResponse {
    UniqueID: string;
    Kill: boolean;
}

export interface MapListResponse extends BaseCommandResponse {
    MapList: {
        MapId: string;
        GameMode: string;
    }[];
}

export interface ModeratorListResponse extends BaseCommandResponse {
    ModeratorList: string[];
}

export interface RefreshListResponse extends BaseCommandResponse {
    PlayerList: {
        Username: string;
        UniqueId: string;
    }[]
}

export interface RemoveModResponse extends BaseCommandResponse {
    RemoveMod: boolean;
    UniqueID: string;
}

export interface ResetSNDResponse extends BaseCommandResponse {
    ResetSND: boolean;
}

export interface PauseMatchResponse extends BaseCommandResponse {
    PauseTime: number;
    PauseMatch: boolean;
}

export interface RotateMapResponse extends BaseCommandResponse {
    RotateMap: boolean;
}

export interface ServerInfoResponse extends BaseCommandResponse {
    ServerInfo: {
        MapLabel: string;
        GameMode: string;
        ServerName: string;
        Teams: boolean;
        Team0Score: string;
        Team1Score: string;
        Round: string;
        RoundState: string;
        PlayerCount: string;
    };
}

export interface SetBalanceTableURLResponse extends BaseCommandResponse {
    GithubURL: string;
    SetBalanceTableURL: boolean;
}

export interface SetCashResponse extends BaseCommandResponse {
    SetCash: boolean;
    UniqueID: string;
}

export interface SetLimitedAmmoTypeResponse extends BaseCommandResponse {
    SetLimitedAmmoType: boolean;
    LimitedAmmoType: string;
}

export interface SetMaxPlayersResponse extends BaseCommandResponse {
    SetMaxPlayers: boolean;
    MaxPlayers: number;
}

export interface SetPinResponse extends BaseCommandResponse {
    Successful: boolean;
}

export interface SetPlayerSkinResponse extends BaseCommandResponse {
    SetPlayerSkin: boolean;
    UniqueID: string;
}

export interface SetTimeLimitResponse extends BaseCommandResponse {
    TimeLimit: number;
    SetTimeLimit: boolean;
}

export interface ShowNametagsResponse extends BaseCommandResponse {
    NametagsEnabled: boolean;
    ShowNametags: string;
}

export interface SlapResponse extends BaseCommandResponse {
    UniqueID: string;
}

export interface SwitchMapResponse extends BaseCommandResponse {
    SwitchMap: boolean;
}

export interface SwitchTeamResponse extends BaseCommandResponse {
    SwitchTeam: boolean;
    UniqueID: string;
}

export interface TeleportResponse extends BaseCommandResponse {
    MoveUniqueID: string;
    ToUniqueID: string;
    Teleport: boolean;
}

export interface TTTAlwaysEnableSkinMenuResponse extends BaseCommandResponse {
    TTTAlwaysEnableSkinMenu: boolean;
}

export interface TTTEndRoundResponse extends BaseCommandResponse {

}

export interface TTTFlushKarmaResponse extends BaseCommandResponse {
    TTTFlushKarma: boolean;
}

export interface TTTGiveCreditsResponse extends BaseCommandResponse {
    CreditAmount: number;
    TTTGiveCredits: boolean;
}

export interface TTTPauseTimerResponse extends BaseCommandResponse {
    TTTPauseTimer: boolean;
}

export interface TTTSetKarmaResponse extends BaseCommandResponse {
    TTTSetKarma: boolean;
    UniqueID: string;
    Karma: number;
}

export interface TTTSetRoleResponse extends BaseCommandResponse {
    TTTSetRole: boolean;
    UniqueID: string;
    Role: string;
}

export interface UnbanResponse extends BaseCommandResponse {
    Unban: boolean;
    UniqueID: string;
}

export interface UpdateServerNameResponse extends BaseCommandResponse {
    UpdateServerName: boolean;
}

export interface UGCAddModResponse extends BaseCommandResponse {
    ModId: string;
}

export interface UGCClearModListResponse extends BaseCommandResponse {
    ModList: string[];
}

export interface UGCModListResponse extends BaseCommandResponse {
    ModList: string[];
}

export interface UGCRemoveModResponse extends BaseCommandResponse {
    ModId: string;
}
