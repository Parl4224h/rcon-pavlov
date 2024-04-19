export enum Rifles {
    Famas= "vanas",
    AUG= "aug",
    M4= "ar",
    AK47= "ak47",
    AK12= "ak12",
    G43= 'g43',
    Garand= "m1garand",
    SVT40= "svt40",
    BAR= "bar",
    BREN= "bren",
    StG44= "stg44",
    DP26= "db27",
    Galil= "Galil",
    M16= "m16",
    SKS= "sks"
}

export enum SMGs {
    Bison= "ak",
    UMP45= "smg",
    MP5= 'mp5',
    P90= "p90",
    Uzi= "uzi",
    MP40= "mp40",
    PPSH= "ppsh",
    Sten= "sten",
    Thompson= "thompson",
    KrissVector= "kross",
    VSS= "vzz",
    AR9= "ar9",
    Drako= "akshorty",
    Skorpion= "skorpion",
}

export enum Pistols {
    Glock= "sock",
    BerettaM9= 'm9',
    TEC9= "cet9",
    NineteenEleven= "1911",
    FiveSeven= "57",
    Revolver= "revolver",
    Luger= "luger",
    Tokarev= "tokarev",
    Webley= "webley"
}

export enum Heavies {
    PumpShotgun= "shotgun",
    SawedOff= "sawedoff",
    M249= "lmga",
    SPAS12= "autoshotgun",
    Saiga12= "drumshotgun",
    MG42= "mg42",
    TrenchShotgun= "trenchgun",
    PKM= "pkm",
}

export enum RocketLaunchers {
    RPG7= "rl_rpg",
    Panzerschreck= "rl_panzer",
    M1Bazooka= "rl_m1ma1",
    PIAT= "rl_piat",
}

export enum Snipers {
    AWP= 'awp',
    BarrettM99= "antitank",
    Kar98= "kar98",
    SCAR20= "scur",
    Mosin= "mosin",
    Springfield= "springfield",
    LeeEnfield= "leeenfield",
    G3= "autosniper",
    HuntingRifle= "hunting",
}

export enum Grenades {
    Grenade= "grenade",
    GrenadeRussia= "grenade_ru",
    GrenadeUS= "grenade_us",
    GrenadeGermany= "grenade_ger",
    GrenadeSoviet= "grenade_svt",
    GrenadeAurora= "grenade_aurora",
    GrenadeDiscombobulation= "grenade_dis",
    Smoke= "smoke",
    SmokeRussia= "smoke_ru",
    SmokeUS= "smoke_us",
    SmokeGermany= "smoke_ger",
    SmokeSoviet= "smoke_svt",
    Flash= "flash",
    FlashAurora= "flash_aurora",
}

export enum Ammo {
    Rifle= "ammo_rifle",
    Sniper= "ammo_sniper",
    SMG= "ammo_smg",
    Pistol= "ammo_pistol",
    Shotgun= "ammo_shotgun",
    Special= "ammo_special",
    Other= "ammo_other",
}

export enum Medical {
    Painkillers= "painkillers",
    WW2Syringe= "ww2syringe",
    MedKit= "medkit",
    Bandage= "bandage",
    WW2MedKit= "ww2medkit",
    Syringe= "syringe",
    WW2Painkillers= "ww2painkillers",
    WW2Bandage= "ww2bandage",
}

export enum Attachments {
    PistolSuppressor= "supp_pistol",
    RifleSuppressor = "supp_rifle",
    X8Scope= "scope",
    AngledGrip= "grip_angled",
    VerticalGrip= "grip_vertical",
    ACOG= "acog",
    Holographic= "holo",
    RifleRedDot= "reddot",
    RifleFlashlight= "flashlight_rifle",
    RifleLaser = "laser_rifle",
    PistolLaser= "laser_pistol",
    Kar98Scope= "scope_kar98",
    LeeEnfieldScope= "scope_leeenfield",
    SpringfieldScope= "scope_springfield",
    MosinScope= "scope_mosin",
    TrenchGunBayonet= "bayonet_trenchgun",
    LeeEnfieldBayonet= "bayonet_leeenfield",
    M1GarandBayonet= "bayonet_m1garand",
    MosinBayonet= "bayonet_mosin",
    SpringfieldBayonet= "bayonet_springfield",
    Kar98Bayonet= "bayonet_kar98",
    RifleRedDotCanted= "canted_reddot",
    PistolRedDor= "reddot_pistol"
}

export enum TTT {
    NewtonianLauncher= "newtonianlauncher",
    Knife= "tttknife",
    Monocular= "monocular",
    Teleporter= "teleporter",
    BallisticShield= "ballisticshield",
    FlareGun= "flaregun",
    DNAScanner= "dnascanner",
    Hypnotiser= "hypnotiser",
    SilencedTec9= "silentcet9",
    DetectiveSMG= "detectivesmg",
    C4= "tttc4",
    GoldenGun= "goldengun",
    Pipe= "pipe",
    StealthDevice= "stealthdevice",
    Radar= "radar",
}

export enum TheHide {
    Adrenaline= "adrenaline",
    TripAlarm= "tripalarm",
    TranquilizerGun= "tranqgun",
}

export enum Push {
    Bomb= "pushbomb",
    AntiTankMine= "antitankmine",
    AntiPersonnelMine= "antipersonnelmine",
    AmmoCrate= "ammocrate",
}

export enum Misc {
    Kevlar= "armour",
    KevlarAndHelmet = 'kevlarhelmet',
    Clips= "pliers",
    Knife= "knife",
    Taser= "taser",
    Crowbar= "crowbar",
    BoltCutters= "boltcutters",
    LockPick= "lockpick",
    HandCuffs= "handcuffs",
    RepairTool= "repairtool",
    Pickaxe= "pickaxe",
    Keycard= "keycard",
    WW2Knife= "ww2knife",
    Snowball= "snowball",
}

export enum Vehicles {
    PanzerTank= "panzer",
    ShermanTank= "sherman",
    T34Tank= "t34",
    TigerTank= "tiger",
    ATV= "atv",
    Truck= "truck",
    WW2GermanCar= 'kubel',
    WillysJeep= "willys",
    WillysSovietJeep = "willys_svt",
    Motorcycle= "motorcycle",
}