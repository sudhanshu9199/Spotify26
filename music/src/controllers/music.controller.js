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

export async function getMusicById(req, res) {
  const { id } = req.params;

  try {
    const music = await musicModel.findById(id).lean();

    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }
    music.musicUrl = await getPresignedUrl(music.musicKey);
    music.coverImageUrl = await getPresignedUrl(music.coverImageKey);

    return res.status(200).json({ music });
  } catch (err) {
    console.error("Error getting music by id:", err);
    res.status(500).json({ message: "Failed to get music by id" });
  }
}

export async function getAllMusics(req, res) {
  const { skip = 0, limit = 10 } = req.query;

  try {
    const musicsDocs = await musicModel.find().skip(skip).limit(limit).lean();

    const musics = [];

    for (let music of musicsDocs) {
      music.musicUrl = await getPresignedUrl(music.musicKey);
      music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
      musics.push(music);
    }

    return res
      .status(200)
      .json({ message: "Musics fetched successfully", musics });
  } catch (err) {
    console.error("Error getting musics:", err);
    res.status(500).json({ message: "Failed to get musics" });
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
      artist: req.user.fullname.firstName + " " + req.user.fullname.lastName,
      artistId: req.user.id,
      title,
      // userId: req.user.id,
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

export async function getPlaylists(req, res) {
  try {
    const playlists = await playlistModel.find({ artistId: req.user.id });

    return res.status(200).json({ playlists });
  } catch (err) {
    console.error("Error getting playlist:", err);
    res.status(500).json({ message: "Failed to get playlist" });
  }
}

export async function getPlaylistById(req, res) {
  const { id } = req.params;

  try {
    const playlistDoc = await playlistModel.findById(id).lean();

    if (!playlistDoc) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const musics = [];

    for (let musicId of playlistDoc.musics) {
      const music = await musicModel.findById(musicId).lean();
      if (music) {
        music.musicUrl = await getPresignedUrl(music.musicKey);
        music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
        musics.push(music);
      }
    }

    playlistDoc.musics = musics;

    return res.status(200).json({ playlist: playlistDoc });
  } catch (err) {
    console.error("Error getting playlist by id:", err);
    res.status(500).json({ message: "Failed to get playlist by id" });
  }
}
