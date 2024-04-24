import express from "express";
import { getNotes, createNote, getNoteByID } from "./db.js";
const app = express();

app.use(express.json())
app.get('/notes', async (req, res) => {
    const notes = await getNotes();
    res.send(notes)
})

app.get('/notes/:id', async (req, res) => {
    const id = req.params.id
    const note = await getNoteByID(id)
    res.send(note)
})

app.post("/notes", async (req, res) => {
    const { title, content } = req.body;
    const note = await createNote(title, content);
    res.send(note)
})

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})