const express = require('express')
const db = require('./data/db.js') // 파일 로드를 위한 모듈
const cors = require('cors')
const mysql = require('mysql');
const db_config = require('./src/db/config')
const connection = mysql.createConnection(db_config);

const app = express()

// https://brunch.co.kr/@adrenalinee31/1
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// index page
app.route('/')
    .get((req, res) => {
        res.render('index') // index.html render
    })

// todoList
app.route('/api/todoList')
    .get(async (req, res) => {
        const result = {success: true}
        try {
            const json = await db.getData()
            result.data = json.todoList
        } catch (err) {
            result.success = false
            result.err = err
        }
        await res.json(result)
    })
    .post(async (req, res) => {
        const result = {success: true}
        const todoList = req.body.todoList
        try {
            const json = await db.getData()
            json.todoList = todoList
            await db.setData(json)
        } catch (err) {
            result.success = false
            result.err = err
        }
        await res.json(result)
    })
// detail
app.route('/api/detail/:idx')
    .get(async (req, res) => {
        const result = {success: true}
        const reIdx = req.params.idx
        try {
            const json = await db.getData()
            let list = []
            json.detail.forEach((v, idx) => {
                if (v.idx === reIdx) {
                    list.push(v)
                }
            })
            result.data = list
        } catch (err) {
            result.success = false
            result.err = err
        }
        await res.json(result)
    })
    .post(async (req, res) => {
        const result = {success: true}
        const detail = req.body.detail
        const idx = req.params.idx
        try {
            const json = await db.getData()
            detail.idx = idx
            json.detail.push(detail)
            await db.setData(json)
        } catch (err) {
            result.success = false
            result.err = err
        }
        await res.json(result)
    })
    .put(async (req, res) => {
        const result = {success: true}
        const detail = req.body.detail
        const idx = req.params.idx
        try {
            const json = await db.getData()
            json.detail[idx] = detail
            await db.setData(json)
        } catch (err) {
            result.success = false
            result.err = err
        }
        await res.json(result)
    })
app.route('/dbs')
    .get(async (req, res) => {
        connection.query('SELECT * FROM REST_API_01', (err, rows) => {
            if (err) throw err;

            console.log('Result is : ', rows);
            res.send(rows);
        })
    })
    .delete(async (req, res) => {
        const result = {success: true}
        const detail = req.body.detail
        const idx = req.params.idx
    })

app.listen(8226, () => {
    console.log("Server has been started")
})