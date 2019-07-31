const express = require('express');
const cors = require('cors');
const uuid = require('uuid');

const firebase = require('./firebase.config');
const fireAuth = firebase.auth();
const firestore = firebase.firestore();

let app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.cors());

/*
 * Endpoint
 * For logging a user
 * Authenticates the user and responds with success/failure message
*/
app.post('/login', (req, res) => {
    let userDetails = req.body;
    fireAuth.signInWithEmailAndPassword(userDetails.username, userDetails.password)
        .then(() => res.send('successfully logged in'))       /// Send userDetails with JWT token
        .catch(error => {
            let errorCode = error.code;
            if (errorCode == "auth/user-not-found") {
                res.status(400).json({
                    errorMsg: 'User doesn\'t exist'
                })
            } else if (errorCode == "auth/wrong-password") {
                res.status(400).json({
                    errorMsg: 'Email and password doesn\'t match'
                })
            } else {
                res.status(400).json({
                    errorMsg: 'unknown error'
                })
            }
        });
});

/*
 * Endpoint
 * For registering a user
 * Creates Authentication for user and responds with success/failure message
*/
app.post('/register', (req, res) => {
    let userDetails = req.body;

    fireAuth.createUserWithEmailAndPassword(userDetails.username, userDetails.password)
        .then(() => res.send('Registeration Successful'))
        .catch(error => {
            let errorCode = error.code;
            if (errorCode == "auth/email-already-in-use") {
                res.status(400).json({
                    errorMsg: 'User already exists'
                })
            } else {
                res.status(400).json({
                    errorMsg: 'unknown error'
                })
            }
        });
})

/*
 * Endpoint
 * For logging out a user
 * No Functionality to be done on server/database
 * Can expire the JWT token, if set at the time of logging in
*/
app.get('/logout', (req, res) => {
    fireAuth.signOut();
    // And also clear JWT Token
    res.end();
});

/*
 * Endpoint
 * For getting todos of a user
*/
app.get('/getTodos/:id', (req, res) => {
    firestore.collection(`todos`).doc(req.params.id).get()
    .then(snapshot => 
        res.json(snapshot.data().todos)
    )
})

/*
 * Endpoint
 * for adding a todo for a user
*/
app.post('/:userId/addTodo', (req, res) => {
    let task = req.body.task;
    firestore.collection(`todos`).doc(req.params.userId).update({
        todos: firebase.firestore.FieldValue.arrayUnion({
            id: uuid.v4(),
            task: task,
            completed: false
        })
    })
    .then(() => res.end());
})

/*
 * Endpoint
 * for toggling a todo for a user
*/
app.patch('/:userId/toggleTodo/:id', async (req, res) => {
    let documentRef = firestore.collection(`todos`).doc(req.params.userId);
    let todos = await documentRef.get();
    todos = todos.data().todos.map(todo => {
        if(todo.id === req.params.id) {
            return {
                ...todo,
                completed: !todo.completed
            }
        } else return todo;
    });
    documentRef.update({
        todos: todos
    })
    .then(() => res.end());
})

/*
 * Endpoint
 * for deleting a todo for a user
*/
app.delete('/:userId/deleteTodo/:id', async (req, res) => {
    let documentRef = firestore.collection(`todos`).doc(req.params.userId);
    let todo = await documentRef.get();
    todo = todo.data().todos.find(todo => todo.id === req.params.id)
    firestore.collection(`todos`).doc(req.params.userId).update({
        todos: firebase.firestore.FieldValue.arrayRemove(todo)
    })
    .then(() => res.end());
})

/*
 * Endpoint
 * fall safe
*/
app.get('/', (req, res) => {
    res.end('hello word');
})

app.listen(PORT, () => console.log(`listening to ${PORT}`));

/*
 * Didn't know how exactly logging in and logging out works -->
      If it can't deal with multiple users, We will remove firestore authentication and proceed with manual authentication
*/