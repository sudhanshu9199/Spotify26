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

router.post(
  "/upload",
  authMiddleware.authArtistMiddleware,
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  musicController.uploadMusic,
);

router.get(
  "/",
  authMiddleware.authUserMiddleware,
  musicController.getAllMusics,
);

router.get(
  "/get-details/:id",
  authMiddleware.authUserMiddleware,
  musicController.getMusicById,
);

router.get(
  "/artist-musics",
  authMiddleware.authArtistMiddleware,
  musicController.getArtistMusics,
);

router.post(
  "/playlist",
  authMiddleware.authArtistMiddleware,
  musicController.createPlaylist,
);

router.get(
  "/playlist",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylists,
);

router.get(
  "/playlist/:id",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylistById,
);
export default router;

// error : UIDIA server seems to have an issue.
