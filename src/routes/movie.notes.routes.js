const { Router } = require("express")

const MovieNotesController = require("../controllers/MovieNotesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const movieNotesRoutes = Router()

const movieNotesController = new MovieNotesController()

movieNotesRoutes.use(ensureAuthenticated);
movieNotesRoutes.get("/", movieNotesController.getFilters)
movieNotesRoutes.get("/:id", movieNotesController.getById)
movieNotesRoutes.post("/", movieNotesController.create)
movieNotesRoutes.delete("/:id", movieNotesController.delete)

module.exports = movieNotesRoutes
