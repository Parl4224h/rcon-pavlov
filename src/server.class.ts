import {RCON} from "./rcon";
import {
    AddModResponse, AmmoTypes,
    BanlistResponse,
    BanResponse, BaseCommandResponse,
    EnableCompModeResponse,
    EnableVerboseLoggingResponse,
    EnableWhitelistResponse,
    GagResponse, GameModes,
    GiveAllResponse,
    GiveCashResponse,
    GiveItemResponse,
    GiveTeamCashResponse,
    InspectAllResponse,
    InspectPlayerResponse,
    InspectTeamResponse,
    ItemListResponse,
    KickResponse,
    KillResponse,
    MapListResponse,
    ModeratorListResponse,
    PauseMatchResponse,
    RefreshListResponse,
    RemoveModResponse,
    ResetSNDResponse,
    RotateMapResponse,
    ServerInfoResponse,
    SetBalanceTableURLResponse,
    SetCashResponse,
    SetLimitedAmmoTypeResponse,
    SetMaxPlayersResponse,
    SetPinResponse,
    SetPlayerSkinResponse, SetTimeLimitResponse,
    ShowNametagsResponse,
    SlapResponse,
    SwitchMapResponse,
    SwitchTeamResponse,
    TeleportResponse,
    TTTAlwaysEnableSkinMenuResponse,
    TTTEndRoundResponse,
    TTTFlushKarmaResponse, TTTGiveCreditsResponse,
    TTTPauseTimerResponse, TTTRole,
    TTTSetKarmaResponse,
    TTTSetRoleResponse,
    UGCAddModResponse, UGCClearModListResponse, UGCModListResponse, UGCRemoveModResponse,
    UnbanResponse,
    UpdateServerNameResponse
} from "./rconTypes";
import {RCONError} from "./RCONError";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
const delayTime = 50; // Time between checks of the response in ms

export class Server extends RCON {
    private readonly maxAttempts: number;
    
    /**
     * Creates a new server object
     * @param ip ip of the pavlov server
     * @param rconPort port for RCON on the server
     * @param rconPassword password for RCON on the server
     * @param timeout max number of seconds to wait on a server response
     * @param autoConnect whether to automatically connect to the server, default is true
     */
    constructor(ip: string, rconPort: number, rconPassword: string, timeout: number, autoConnect: boolean = true) {
        super(ip, rconPort, rconPassword);
        if (autoConnect) {
            this.connect().then();
        }
        this.maxAttempts = (timeout * 1000) / delayTime;
    }

    // Override send to implement non-blocking sends and zero-timeout behavior.
    // - When maxAttempts <= 0: do not write to the socket and resolve immediately.
    // - Otherwise: attach a one-time listener and write, but resolve immediately so
    //   higher-level methods can perform their own timeout polling without blocking here.
    //   A cleanup timer removes the listener if no response arrives within the allowed window.
    async send(command: string, commandName: string, cb: any): Promise<void> {
        if (this.maxAttempts <= 0) {
            return Promise.resolve();
        }
        const cleanupMs = Math.max(0, Math.floor(this.maxAttempts * delayTime));
        return new Promise<void>((resolve) => {
            const socket: any = (this as any).socket || (this as any)["_socket"] || (this as any)["socket"];
            if (!socket) {
                // If socket is not yet available, resolve immediately; higher-level polling will timeout.
                return resolve();
            }
            const handler = (data: any) => {
                try { cb(data); } catch (_) { /* ignore user callback errors here */ }
            };
            socket.once(commandName, handler);
            try { socket.write(command); } catch (_) { /* ignore write errors; outer layers will handle via timeouts */ }
            // Resolve immediately to avoid blocking the API method; it will poll for the response.
            resolve();
            // Ensure we don't leak the listener if the server never responds
            if (cleanupMs > 0) {
                setTimeout(() => {
                    try { socket.removeListener(commandName, handler); } catch (_) { /* noop */ }
                }, cleanupMs);
            } else {
                // If cleanupMs is 0 (very small timeout rounding), remove on next tick
                setImmediate(() => {
                    try { socket.removeListener(commandName, handler); } catch (_) { /* noop */ }
                });
            }
        });
    }

    /**
     * Returns whether there is an active connection to the server or not
     */
    connected(): boolean {
        return this.active;
    }

    /**
     * Adds a map to the server's map rotation. Writes the entry to Game.ini
     * @param map Resource id of the map to add ie industry
     * @param gamemode Gamemode for the map to be on is not case-sensitive but is commonly all caps ie SND, TDM, DM
     */
    async addMapRotation(map: string, gamemode: GameModes): Promise<BaseCommandResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`AddMapRotation ${map} ${gamemode}`, "AddMapRotation", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Adds a moderator to the mods.txt file
     * @param uniqueID ID of the player to make a mod
     */
    async addMod(uniqueID: string): Promise<AddModResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`AddMod ${uniqueID}`, "AddMod", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Bans a user from the server by adding to blacklist.txt
     * @param uniqueID ID of the player to ban
     */
    async ban(uniqueID: string): Promise<BanResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Ban ${uniqueID}`, "Ban", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns all current entries of blacklist.txt
     */
    async banlist(): Promise<BanlistResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Banlist`, "Banlist", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Removes all vehicles not occupied by a player
     */
    async clearEmptyVehicles(): Promise<BaseCommandResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`ClearEmptyVehicles`, "ClearEmptyVehicles", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Toggles comp mode for the next map, you must rotate the map for this to take effect. Writes to Game.ini
     * @param enable whether comp mode should be enabled or not
     */
    async enableCompMode(enable: boolean): Promise<EnableCompModeResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`EnableCompMode ${enable}`, "EnableCompMode", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Toggles verbose logging, writes to Game.ini
     * @param enable whether verbose logging should be enabled or not
     */
    async enableVerboseLogging(enable: boolean): Promise<EnableVerboseLoggingResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`EnableVerboseLogging ${enable}`, "EnableVerboseLogging", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Toggles whether to use whitelist.txt or not
     * @param enable whether whitelist.txt should be enabled or not
     */
    async enableWhitelist(enable: boolean): Promise<EnableWhitelistResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`EnableWhitelist ${enable}`, "EnableWhitelist", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Toggles a players ability to use in game voice chat
     * @param uniqueID ID of player to gag
     * @param gag whether the player should be gagged or not
     */
    async gag(uniqueID: string, gag: boolean): Promise<GagResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Gag ${uniqueID} ${gag}`, "Gag", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Gives an item to all players on the specified team
     * @param teamID ID of team to give item to
     * @param itemID ID of item to
     */
    async giveAll(teamID: string, itemID: string): Promise<GiveAllResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`GiveAll ${teamID} ${itemID}`, "GiveAll", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Gives the specified amount of cash to the player
     * @param uniqueID ID of player to give cash to
     * @param amount amount of cash to give to player
     */
    async giveCash(uniqueID: string, amount: number): Promise<GiveCashResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`GiveCash ${uniqueID} ${amount}`, "GiveCash", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Gives the specified item to a player
     * @param uniqueID ID of player to give item to
     * @param itemID ID of item to give to player
     */
    async giveItem(uniqueID: string, itemID: string): Promise<GiveItemResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`GiveItem ${uniqueID} ${itemID}`, "GiveItem", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Gives the specified amount of cash to each player on the team
     * @param teamID ID of team to give cash to
     * @param amount amount of cash to give to each player
     */
    async giveTeamCash(teamID: string, amount: string): Promise<GiveTeamCashResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`GiveTeamCash ${teamID} ${amount}`, "GiveTeamCash", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns a list of all players on the server along with info about them
     */
    async inspectAll(): Promise<InspectAllResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`InspectAll`, "InspectAll", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns info about the specified player
     * @param uniqueID ID of player to get info on
     */
    async inspectPlayer(uniqueID: string): Promise<InspectPlayerResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`InspectPlayer ${uniqueID}`, "InspectAll", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns a list of all players with info about them on the team specified
     * @param teamID
     */
    async inspectTeam(teamID: string): Promise<InspectTeamResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`InspectTeam ${teamID}`, "InspectTeam", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns a list of all items in the current game
     */
    async itemList(): Promise<ItemListResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`ItemList`, "ItemList", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Kicks the specified player from the server
     * @param uniqueID ID of the player to kick
     */
    async kick(uniqueID: string): Promise<KickResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Kick ${uniqueID}`, "Kick", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Kills the specified player on the server
     * @param uniqueID ID of player to kill
     */
    async kill(uniqueID: string): Promise<KillResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Kill ${uniqueID}`, "Kill", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns a list of all current maps in rotation along with their game-modes
     */
    async mapList(): Promise<MapListResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`MapList`, "MapList", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns all current entries in mods.txt
     */
    async moderatorList(): Promise<ModeratorListResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`ModeratorList`, "ModeratorList", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns a list of all connected players and their uniqueIDs
     */
    async refreshList(): Promise<RefreshListResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`RefreshList`, "RefreshList", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Removes a map from the rotation, gamemode is a case-sensitive match to entry in Game.ini, you can check entries using mapList()
     * @param map resource ID of the map to remove ie industry
     * @param gamemode case-sensitive match of the gamemode to remove for the specified map
     */
    async removeMapRotation(map: string, gamemode: GameModes): Promise<BaseCommandResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`RemoveMapRotation ${map} ${gamemode}`, "RemoveMapRotation", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Removes a mod from mods.txt
     * @param uniqueID ID of mod to remove
     */
    async removeMod(uniqueID: string): Promise<RemoveModResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`RemoveMod ${uniqueID}`, "RemoveMod", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Resets the currently running SND match, cash, kda, points, score, etc. is set to default starting values
     */
    async resetSND(): Promise<ResetSNDResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`ResetSND`, "ResetSND", (response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Pauses the match
     * @param time time to pause match by (0-3600 seconds), if a negative value or no value is passed it will unpause the match
     */
    async pauseMatch(time: number = -1): Promise<PauseMatchResponse> {
        let res: any = '';
        let count = 0;
        if (time < 0) {
            await this.send("PauseMatch",  "PauseMatch",(response: any) => {res = response});
        } else {
            await this.send(`PauseMatch ${time}`, "PauseMatch",(response: any) => {res = response});
        }
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Changes to current map to the next one in the map rotation
     */
    async rotateMap(): Promise<RotateMapResponse> {
        let res: any = '';
        let count = 0;
        await this.send("RotateMap", "RotateMap",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns information about the server including: score, player count, map, etc.
     */
    async serverInfo(): Promise<ServerInfoResponse> {
        let res: any = '';
        let count = 0;
        await this.send("ServerInfo", "ServerInfo",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the balance table url outdated official table: https://github.com/vankruptgames/BalancingTable/blob/Beta_5.1/BalancingTable.csv
     * @param url NOT the full url instead matches this pattern `user/repo/branch` ie `vankruptgames/BalancingTable/Beta_5.1` The specified branch must contain a file with name `BalancingTable.csv`
     */
    async setBalanceTableURL(url: string): Promise<SetBalanceTableURLResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SetBalanceTableURL ${url}`, "SetBalanceTableURL",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the cash of the specified player
     * @param uniqueID ID of the player to set cash of
     * @param amount Amount of cash to set the player's amount to
     */
    async setCash(uniqueID: string, amount: number): Promise<SetCashResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SetCash ${uniqueID} ${amount}`, "SetCash",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the ammo type of the server
     * @param ammoType type of ammo for the server to use a list can be found on this wiki page http://pavlovwiki.com/index.php/Setting_up_a_dedicated_server#Configuring_Game.ini
     */
    async setLimitedAmmoType(ammoType: AmmoTypes): Promise<SetLimitedAmmoTypeResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SetLimitedAmmoType ${ammoType}`, "SetLimitedAmmoType",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the max players allowed on the server, writes to Game.ini
     * @param amount Amount of players to allow 1 to 24
     */
    async setMaxPlayers(amount: number): Promise<SetMaxPlayersResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SetMaxPlayers ${amount}`, "SetMaxPlayers",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the server ping to the provided value
     * @param pin pin to set, can be between 0-9999 leading 0s will be ignored, passing a negative number or not specifying one will remove the pin from the server
     */
    async setPin(pin: number = -1): Promise<SetPinResponse> {
        let res: any = '';
        let count = 0;
        if (pin < 0) {
            await this.send(`SetPin`, "SetPin",(response: any) => {res = response});
        } else {
            await this.send(`SetPin ${pin}`, "SetPin", (response: any) => {res = response});
        }
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the specified player's skin to the one provided
     * @param uniqueID ID of the player to set skin of
     * @param skinID ID of the skin to set for the player
     */
    async setPlayerSkin(uniqueID: string, skinID: number): Promise<SetPlayerSkinResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SetPlayerSkin ${uniqueID} ${skinID}`, "SetPlayerSkin",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the time limit of the current match
     * @param amount how long the current match should last in seconds
     */
    async setTimeLimit(amount: number): Promise<SetTimeLimitResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SetTimeLimit ${amount}`, "SetTimeLimit",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Toggles whether nametags should be displayed or not, writes to Game.ini
     * @param show whether nametags should be displayed or not
     */
    async showNameTage(show: boolean): Promise<ShowNametagsResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`ShowNametags ${show}`, "ShowNametags",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Shutdown the server immediately
     */
    async shutdownServer(): Promise<boolean> {
        let res: any = '';
        let count = 0;
        await this.send(`ShutdownServer`, "ShutdownServer",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        return res == '';
    }

    /**
     * Deals the specified amount of damage to the player ignoring armor.
     * @param uniqueID ID of player to slap
     * @param amount amount of damage to deal, negative numbers give health back and any negative number over 1 million appears to grant god mode
     */
    async slap(uniqueID: string, amount: number): Promise<SlapResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Slap ${uniqueID} ${amount}`, "Slap",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Switches the map to the specified map and gamemode
     * @param map resource ID of the map ie industry
     * @param gamemode gamemode to switch to, convention is all caps but is not case-sensitive ie SND, TDM, DM
     */
    async switchMap(map: string, gamemode: GameModes): Promise<SwitchMapResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SwitchMap ${map} ${gamemode}`, "SwitchMap", (response: any) => {
            res = response
        });
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Switches a player's team
     * @param uniqueID ID of the player to switch the team of
     * @param teamID ID of the team to switch player to
     */
    async switchTeam(uniqueID: string, teamID: string): Promise<SwitchTeamResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`SwitchTeam ${uniqueID} ${teamID}`, "SwitchTeam",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Teleports a player to another player
     * @param sourceUniqueID ID of player to teleport
     * @param targetUniqueID ID of player to teleport to
     */
    async teleport(sourceUniqueID: string, targetUniqueID: string): Promise<TeleportResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Teleport ${sourceUniqueID} ${targetUniqueID}`, "Teleport",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Toggles whether the skin menu should be enabled during the round
     * @param enabled whether the menu should be enabled
     */
    async tttAlwaysEnableSkinMenu(enabled: boolean): Promise<TTTAlwaysEnableSkinMenuResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`TTTAlwaysEnableSkinMenu ${enabled}`, "TTTAlwaysEnableSkinMenu",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Ends the TTT round ??TODO: check if works
     * @param teamID ID of team to win the round
     */
    async tttEndRound(teamID: string): Promise<TTTEndRoundResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`TTTAlwaysEndRound ${teamID}`, "TTTAlwaysEndRound",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Resets all player's karma to 1200
     */
    async tttFlushKarma(): Promise<TTTFlushKarmaResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`TTTFlushKarma`, "TTTFlushKarma",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Gives the specified player credits
     * @param uniqueID ID of player to give credits to
     * @param amount amount of credits to give to player
     */
    async tttGiveCredits(uniqueID: string, amount: number): Promise<TTTGiveCreditsResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`TTTGiveCredits ${uniqueID} ${amount}`, "TTTGiveCredits",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Pauses the TTT round timer
     * @param pause whether the timer should be paused
     */
    async tttPauseTimer(pause: boolean): Promise<TTTPauseTimerResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`TTTPauseTimer ${pause}`, "TTTPauseTimer",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the specified player's karma
     * @param uniqueID ID of player to set karma of
     * @param amount amount of karma to set the player's to
     */
    async tttSetKarma(uniqueID: string, amount: number): Promise<TTTSetKarmaResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`TTTSetKarma ${uniqueID} ${amount}`, "TTTSetKarma",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Sets the specified player's role
     * @param uniqueID ID of player to set role of
     * @param roleID ID of role to set player
     */
    async tttSetRole(uniqueID: string, roleID: TTTRole): Promise<TTTSetRoleResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`TTTSetRole ${uniqueID} ${roleID}`, "TTTSetRole",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Unbans a player by removing from blacklist.txt
     * @param uniqueID ID of player to unban
     */
    async unban(uniqueID: string): Promise<UnbanResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`Unban ${uniqueID}`, "Unban",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Updates the server name, writes to Game.ini
     * @param name name to update the server name to
     */
    async updateServerName(name: string): Promise<UpdateServerNameResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`UpdateServerName ${name}`, "UpdateServerName",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Adds a mod to the server
     * @param ugcModID resource ID of the mod to add
     */
    async ugcAddMod(ugcModID: string): Promise<UGCAddModResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`UGCAddMod ${ugcModID}`, "UGCAddMod",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Removes all server mods
     */
    async ugcClearModList(): Promise<UGCClearModListResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`UGCClearModList`, "UGCClearModList",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Returns a list of all current server mods
     */
    async ugcModList(): Promise<UGCModListResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`UGCModList`, "UGCModList",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }

    /**
     * Removes the specified mod from the server
     * @param ugcModID resource ID of the mod ot remove
     */
    async ugcRemoveMod(ugcModID: string): Promise<UGCRemoveModResponse> {
        let res: any = '';
        let count = 0;
        await this.send(`UGCRemoveMod ${ugcModID}`, "UGCRemoveMod",(response: any) => {res = response});
        while (res == '' && count < this.maxAttempts) {
            await delay(delayTime);
            count++;
        }
        if (res == '') {
            throw new RCONError({
                name: "NO_RESPONSE",
                message: "ServerClass took too long to respond",
            });
        } else {
            return res;
        }
    }
}