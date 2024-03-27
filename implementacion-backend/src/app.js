import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import config from "./config/config.js"
import passport from "passport";
import session from "express-session"
import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import { MessageModel } from "./dao/models/messages.model.js";
import { Server } from "socket.io"
import { initializedPassport } from "./config/passport.config.js";
import errorMiddleware from "./middlewares/error/error.middleware.js";
import { middlewareLogger } from "./middlewares/logger/logger.middleware.js";

import swaggerJsdoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"

import { router as producstRouter } from "./routes/products.router.js"
import { router as cartsRouter } from "./routes/carts.router.js"
import { router as viewsRouter } from "./routes/views.router.js"
import { router as userRouter } from "./routes/user.router.js";
import { router as ticketsRouter } from "./routes/tickets.router.js"
import { router as mockRouter } from "../src/routes/mocking.router.js"
import { router as loggerRouter } from "./routes/logger.router.js";


const { PORT, MongoURL, MongoSecret, MongoTestURL } = config
const app = express()
const httpServer = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
const socketServer = new Server(httpServer)

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce API",
      description: "APIrestful developed during the backend programming course at coderhouse"
    }
  },
  apis: [`${process.cwd()}/src/docs/**/*.yaml`]
}

const specs= swaggerJsdoc(swaggerOptions)
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(process.cwd() + "/public"))

app.engine("handlebars", handlebars.engine({
  defaultLayout: 'main',
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
}))
app.set("views", process.cwd() + "/src/views")
app.set("view engine", "handlebars")

app.use(errorMiddleware)
app.use(middlewareLogger)

mongoose.connect(MongoTestURL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error);
    process.exit(1);
  });

app.use(session({
  store: MongoStore.create({
    mongoUrl: MongoTestURL,
  }),
  secret: MongoSecret,
  resave: false,
  saveUninitialized: false
}))

app.use(cookieParser())
initializedPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products", producstRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", userRouter)
app.use("/api/tickets", ticketsRouter)
app.use(mockRouter)
app.use(loggerRouter)
app.use(viewsRouter)

app.get("/", (req, res) => {
  res.send("PreEntrega3")
})

let messages = []
let users = []
socketServer.on('connection', (socket) => {
  console.log('handshake');

  socket.on('authenticate', (username) => {
    users[socket.id] = username;
    socket.emit('authenticated', username);

    MessageModel.find()
      .then((messages) => {
        socket.emit('messagesLogs', messages);
      })
      .catch((error) => {
        console.error('Error loading messages from database:', error);
      });

    socket.broadcast.emit('userConnected', username);
  });

  socket.on('message', (data) => {

    const newMessage = new MessageModel({
      user: data.user,
      message: data.message,
    });

    newMessage.save()
      .then(() => {
        console.log('Message saved');
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });

    messages.push(data);
    socketServer.emit('messagesLogs', messages);
  });
});