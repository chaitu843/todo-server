# todo-server
Creating a server for todo-client using express and firebase

### Points to be Noted:

## Packages Used:

1. express  --> creating a server
2. cors     --> allowing server to server cross-origin requests
3. uuid     --> generating a unique id while adding a todo
4. firebase --> (cloud firestore) for data storage

## firestore ops:

1. Used auth operations for login, register and logout
2. For todos, update() is being used.
3. todos are being stored in an array, and hence FieldValue provided by firestore is being used for ops associated with arrays
4. Storing todos as a Map might help, since it reduces querying and manipulating time.

## For Heroku:

1. heroku create and git push heroku master
2. Taking port from process.env.PORT
3. Mentioning 'start' script in package.json