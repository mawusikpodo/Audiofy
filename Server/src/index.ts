import express from 'express'
import 'dotenv/config'
import "express-async-errors"
import './db'

import authRouter from './routers/auth'
import audioRouter from './routers/audio'
import favoriteRouter from './routers/favorite'
import playlistRouter from './routers/playlist'
import profileRouter from './routers/profile'
import historyRouter from './routers/history'
import "./utils/schedule"
import swaggerDocs from './utils/swagger'
import { errorHandler } from './middleware/error'

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));

// Routes
app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);


app.get("/", (req, res) => {
    res.json({
        alive: true,
    })
})

app.get("*", (req, res) => {
    res.status(404).json({
        error: "Not Found",
    })
})

app.use(errorHandler)

const PORT = process.env.PORT || 8989;

// Swagger Documentation
swaggerDocs(app, PORT);

// Server Start

app.listen(PORT, () => {
    console.log('Port is listening on port ' + PORT);
});


/**
 * The plan and features
 * upload audio files
 * listen to single audio
 * add to favorites
 * create playlist
 * remove playlist (public-private)
 * remove audios
 * get latest uploads
 * recommended audio
 * auto generated playlist get route
 * get followers -private -public
 * get followings
 * many more
 */