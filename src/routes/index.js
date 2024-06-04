const { Router } = require("express")

const usersRouter = require("./users.routes")
const movieNotesRouter = require("./movie.notes.routes")
const movieTagsRouter = require("./movie.tags.routes")
const sessionsRouter = require("./sessions.routes");

const routes = Router()
routes.use("/users", usersRouter)
routes.use("/movie_notes", movieNotesRouter)
routes.use("/movie_tags", movieTagsRouter)
routes.use("/sessions", sessionsRouter);

module.exports = routes
