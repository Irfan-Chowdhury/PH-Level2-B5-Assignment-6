"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./app/routes");
const env_1 = require("./app/config/env");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passport");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONTEND_URL,
    credentials: true
}));
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
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
app.use(globalErrorHandler_1.globalErrorHandler);
// 1st Approach
// app.use((req: Request, res: Response) => {
//     res.status(httpStatus.NOT_FOUND).json({
//         success:false,
//         message: "Route Not Found"
//     })
// });
// 2nd Approach
app.use(notFound_1.default);
exports.default = app;
