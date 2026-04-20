import express from "express";
import multer from "multer";
import * as musicController from "../controllers/music.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

/* POST /api/music/upload */
router.post(
  "/upload",
  authMiddleware.authArtistMiddleware,
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  musicController.uploadMusic,
);

/* GET /api/music/ */
router.get(
  "/",
  authMiddleware.authUserMiddleware,
  musicController.getAllMusics,
);

/* GET /api/music/get-details/:id */
router.get(
  "/get-details/:id",
  authMiddleware.authUserMiddleware,
  musicController.getMusicById,
);

/* GET /api/music/artist-musics */
router.get(
  "/artist-musics",
  authMiddleware.authArtistMiddleware,
  musicController.getArtistMusics,
);

/* POST /api/music/playlist */
router.post(
  "/playlist",
  authMiddleware.authArtistMiddleware,
  musicController.createPlaylist,
);

/* GET /api/music/playlist/artist */
router.get(
  "/playlist/artist",
  authMiddleware.authArtistMiddleware,
  musicController.getArtistPlaylists,
);

/* GET /api/music/playlists */
router.get(
  "/playlist",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylists,
);

router.get("/playlist/artist", authMiddleware.authArtistMiddleware);

router.get(
  "/playlist/:id",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylistById,
);
export default router;

// error : UIDIA server seems to have an issue.
