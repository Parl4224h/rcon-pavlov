# rcon-Pavlov
A fully typed RCON package for Pavlov VR, built natively in TypeScript

# Features
## Typed Functions
Every RCON command is fully typed allowing for seamless integration into existing projects

## Custom Error Types
All possible errors have their own type allowing for easy error handling

## Object Based IDs
All in game items exist under the exported object Items with the pattern `Items.Category.Item` ie `Items.Rifles.M4`

# Example

```ts
import Server, {Items} from "rcon-pavlov";
const ip = "127.0.0.1";
const port = 9100;
const password = process.env.RCON_PASSWORD; // Never store passwords in code
const maxWaitTime = 3; // Time in seconds to wait on server response
const delay = (ms: number) => {return new Promise( resolve => setTimeout(resolve, ms));}

const main = async () => {
    const server = new Server(ip, port, password, maxWaitTime);
    
    await server.connect();
    
    // Wait 2 seconds before sending any commands or else authentication may fail
    await delay(2000);
    
    // Get server info
    console.log(await server.serverInfo());
    
    console.log(await server.giveAll("0", Items.Rifles.M4));
    
    // Close server before terminating process
    await server.close();
}

main().then(() => {console.log('done')}).catch(console.error);
```

## Change Log
- v1.2.2
  - Fixed another issue where a single request could last forever preventing resolving
- v1.2.1
  - Fixed an issue where a single request could last forever preventing resolving
- v1.2.0
  - Commands are now sent using a queue to prevent too many listeners from being created and preserve order of commands
- v1.1.0
  - Remove union types and use enums instead to fully resolve typing issues
- v1.0.8
  - Update build process to no longer duplicate enum types, allowing for usage of enums in code without issues
- v1.0.5
  - Added connected() which checks if there is an active connection to the server
- v1.0.3
  - Exported error type for easier error handling

