import { getPresignedUrl, uploadFile } from "../services/storage.service.js";
import musicModel from "../models/music.model.js";
import playlistModel from "../models/playlist.model.js";

export async function uploadMusic(req, res) {
  try {
    // Production level validation: ensure both files exist before attempting to access [0]
    if (!req.files || !req.files["music"] || !req.files["coverImage"]) {
      return res
        .status(400)
        .json({ message: "Both music and cover image files are required" });
    }

    const musicFile = req.files["music"][0];
    const coverImageFile = req.files["coverImage"][0];

    // Upload sequentially as per original logic, avoiding over-engineering
    const musicKey = await uploadFile(musicFile);
    const coverImageKey = await uploadFile(coverImageFile);

    const music = await musicModel.create({
      title: req.body.title,
      artist: req.user.fullname.firstName + " " + req.user.fullname.lastName,
      artistId: req.user.id,
      musicKey: musicKey,
      coverImageKey: coverImageKey,
    });
    return res.status(201).json({
      message: "Music uploaded successfully",
      music,
    });
  } catch (err) {
    console.error("Error uploading music:", err);
    res.status(500).json({ message: "Failed to upload music" });
  }
}

export async function getArtistMusics(req, res) {
  try {
    const musicsDocs = await musicModel.find({ artistId: req.user.id }).lean();

    let musics = [];

    for (let music of musicsDocs) {
      music.musicUrl = await getPresignedUrl(music.musicKey);
      music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
      musics.push(music);
    }
    return res.status(200).json({ musics });
  } catch (err) {
    console.error("Error getting artist musics:", err);
    res.status(500).json({ message: "Failed to get artist musics" });
  }
}

export async function createPlaylist(req, res) {
  const { title, musics } = req.body;

  try {
    const playlist = await playlistModel.create({
      title,
      userId: req.user.id,
      musics,
    });

    return res
      .status(201)
      .json({ message: "Playlist created successfully", playlist });
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).json({ message: "Failed to create playlist" });
  }
}
