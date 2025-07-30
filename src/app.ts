import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status-codes";
import { success } from "zod";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";

const app =  express();

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}));
app.use("/api/v1", router);


app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message : "Welcome to Tour Management System Backend"
    });
});


// 1st Approch
// app.use((error:any, req: Request, res: Response, next: NextFunction) => {    
//     res.status(500).json({
//         success:false,
//         message:`Something Went Wrong!! ${error.message}`,
//         error,
//         stack: envVars.NODE_ENV === "development" ? error.stack : null
//     })
// })

// 2nd Approach
app.use(globalErrorHandler);


// 1st Approach
// app.use((req: Request, res: Response) => {
//     res.status(httpStatus.NOT_FOUND).json({
//         success:false,
//         message: "Route Not Found"
//     })
// });

// 2nd Approach
app.use(notFound);


export default app;

