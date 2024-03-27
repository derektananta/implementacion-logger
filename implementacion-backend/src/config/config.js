import dotenv from "dotenv"

dotenv.config()

export default {
    MongoURL: process.env.MongoURL,
    PORT: process.env.PORT,
    MongoSecret: process.env.MongoSecret,
    GithubClientId: process.env.GithubClientId,
    GithubClientSecret: process.env.GithubClientSecret,
    ENV: process.env.ENV,
    MongoTestURL: process.env.MongoTestURL
}