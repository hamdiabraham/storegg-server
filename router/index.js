const mainRoute = require("express").Router();
const dashboardRoute = require("./dashboarRouter");
const categoryRoute = require("./categoryRouter");
const nominalRoute = require("./nominalRouter");
const voucherRoute = require("./voucherRouter");
const bankRoute = require("./bankRouter");
const paymentRoute = require("./paymentRouter");
const userRoute = require("./userRouter");
const transactionRoute = require("./transactionRouter");
const playerRoute = require("./playerRouter");
const authRouter = require("./authRouter");

const api = `/api/v1`;

mainRoute.use(dashboardRoute);
mainRoute.use(categoryRoute);
mainRoute.use(nominalRoute);
mainRoute.use(voucherRoute);
mainRoute.use(bankRoute);
mainRoute.use(paymentRoute);
mainRoute.use(userRoute);
mainRoute.use(transactionRoute);

// api
mainRoute.use(`${api}`, playerRoute);
mainRoute.use(`${api}`, authRouter);

module.exports = mainRoute;
