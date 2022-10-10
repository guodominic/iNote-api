const express = require('express')
const cors = require('cors')
const knex = require('knex')
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    } // to connect knex to heroku
    /*     connection: {
            host: '127.0.0.1',
            port: 5432,
            user: '',
            password: '',
            database: 'inotes'
        } */
})  // to connect the local host server to the postgresql database
/* 
db.select('*').from('inotes').then(data => {
    console.log(data);
}) */

const app = express()
app.use(express.json())  //to parse json
app.use(cors())  //to allow access to from front end to the server

app.get('/', (req, res) => { res.send('it is working') })
app.get('/iNote', (req, res) => {
    db('inotes').orderBy('id', 'asc').then(data => {
        res.status(200).json(data)
    })
        .catch(err => res.status(400).json('unable to fetch notes'))

})

app.get('/note/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('inotes').where('id', '=', id).then(data => {
        res.status(200).json(data)
    }).catch(err => res.status(400).json('unable to fetch note'))
})

app.put('/update/:id', (req, res) => {
    const { body, lastupdate, todolist } = req.body;
    db('inotes').where('id', req.params.id)
        .update({
            'body': body,
            'lastupdate': lastupdate,
            'todolist': todolist
        })
        .then(res.status(200).send('recieved'))
        .catch(err => res.status(400).json('unable to update'))

})

app.delete('/delete/:id', (req, res) => {
    db('inotes').where('id', req.params.id)
        .del()
        .then(res.json({ success: true }))
        .catch(err => res.status(400).json('unable to delete'))
}
)

app.post('/note/new', (req, res) => {
    const { body, lastupdate, todolist } = req.body;
    db('inotes')
        .insert({
            'body': body,
            'lastupdate': lastupdate,
            'todolist': todolist
        })
        .then(res.status(200).send('recieved'))
        .catch(err => res.status(400).json('unable to create'))
})

//************************* */
//For todo List below


/* app.get('/todolist/:id', (req, res) => {
    db('todolists').where('id', req.params.id).then(data => {
        res.status(200).json(data)
    })
        .catch(err => res.sendStatus(400).json('unable to fetch todo list'))
}) */

/* app.put('/todolist/update/:id/:todoId', (req, res) => {
    const { todoId, todo, isCheck } = req.body;
    db('todolists').where('id', req.params.id)
        .update({
            'todolist': {
                'todoId': todoId,
                'todo': todo,
                'isCheck': isCheck
            }
        })
        .then(res.status(200).send('recieved'))
        .catch(err => res.status(400).json('unable to update todo list'))

})

app.delete('/todolist/delete/:id/:todoId', (req, res) => {
    db('todolists').where('id', req.params.id).where('todoId', req.params.todolist.todoId)
        .del()
        .then(res.json({ success: true }))
        .catch(err => res.status(400).json('unable to delete'))
}
)

app.post('/todolist/:id/new', (req, res) => {
    const { todoId, todo, isCheck } = req.body;
    db('todolists')
        .insert({
            'todolist': {
                'todoId': todoId,
                'todo': todo,
                'isCheck': isCheck
            }
        })
        .then(res.status(200).send('recieved'))
        .catch(err => res.status(400).json('unable to create'))
})
 */
app.listen(process.env.PORT || 3000, () => {
    console.log(`APP IS RUNNING ON ${process.env.PORT}`)
});