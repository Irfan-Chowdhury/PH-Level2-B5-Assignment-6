import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;


const StartServer =  async() => {

    try {
        console.log(envVars.NODE_ENV);

        await mongoose.connect(envVars.DB_URL);

        console.log("Connected to DB !!!");

        server = app.listen(envVars.PORT, () => {
            console.log("Server is listening to port 5000");
        });
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await StartServer()
    await seedSuperAdmin()
})();


// process.on("unhandledRejection", (error) => {
//     console.log("Unhandled Rejection detected... Server Shutting down...", error);

//     if(server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     }

//     process.exit(1);
// });

// process.on("uncaughtException", (error) => {
//     console.log("Uncaught Exception detected... Server Shutting down...", error);

//     if(server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     }

//     process.exit(1);
// });

// process.on("SIGTERM", () => {
//     console.log("SIGTERM single received... Server Shutting down...");

//     if(server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     }

//     process.exit(1);
// });

// process.on("SIGINT", () => {
//     console.log("SIGINT single received... Server Shutting down...");

//     if(server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     }

//     process.exit(1);
// });

// unhandled rejection error
// Promise.reject(new Error("I forget to catch this promise."));


// uncaught rejection error
// throw new Error("I forgot to handle this local error.");


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination (sigterm)
 */















