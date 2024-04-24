import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getNotes(){
    const [data] = await pool.query("SELECT * FROM notes");
    return data
}

export async function getNoteByID(id){
    const [data] = await pool.query(`
    SELECT *
    FROM notes
    WHERE id = ?
    `, [id])
    return data[0]
}

export async function createNote(title, content){
    const [result] = await pool.query(`
    INSERT INTO notes (title, contents)
    VALUES (?, ?)
    `, [title, content])
    // return result.insertId
    return getNoteByID(result.insertId)
}