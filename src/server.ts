import {Server} from "./server.class";
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

export enum AmmoTypes {
    Unlimited= 0,
    LimitedGeneric= 1,
    LimitedSpecific= 2,
    Custom= 3,
    LimitedSpecial= 4,
    Boxless= 5,
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

export enum TTTRoles {
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

export default Server;
