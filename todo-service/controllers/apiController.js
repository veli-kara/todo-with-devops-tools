var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
var TodoModel = require('../models/todoModel');

module.exports = function (app) {

    // Diese Zeile stellt die API ein, dass die Requests(Anfragen) und Responses(Antworten) das JSON-Format verwenden
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Diese GET-Methode gibt uns alle ToDos aus dem NodeCache zurück
    app.get('/api/todo/all', async function (req, res) {

        try {
            var todos = await TodoModel.find({});

            res.status(200).send(todos);
        } catch (error ){
            res.status(400).send(error);
        }
    });

    // Erstellung eines Todos und Speichern im NodeCache
    app.post('/api/todo', async function (req, res) {

        try {
            var id = uuidv4();
            var description = req.body.description;
            var completed = req.body.completed;

            var todo = new TodoModel({ 
                id: id, 
                description: description, 
                completed: completed });

            todo.save();

            res.status(201).send(todo);
        } catch (error) {
            res.status(400).send(error);
        }
    });

    // Abholung eines ToDos durch seine Id
    app.get('/api/todo', async function (req, res) {

        try {
            var id = req.query.id;
            var todo = await TodoModel.find({id: id});

            if (!todo)
            {
                res.status(400).send({"error": "Das Todo konnte nicht gefunden werden."});
                return;
            }

            res.status(200).send(todo);
        } catch (error) {
            res.status(400).send(error);
        }
    });

    // Aktualisierung eines ToDos
    app.put('/api/todo/:id', async function (req, res) {

        try {
            var todo = await TodoModel.findOneAndUpdate(
                { id: req.params.id }, // Wonach es gesucht wird
                {
                    description: req.body.description,
                    completed: req.body.completed
                }, // Womit es aktualisiert wird
                { new: true } // Das Parameter sagt uns, dass der aktuellste Wert zurückgegeben wird.
            );

            if (!todo)
            {
                res.status(400).send({"error": "Das Todo konnte nicht gefunden werden."});
                return;
            }

            res.status(200).send(todo);
        } catch (error) {
            console.log(error)
            res.status(400).send(error);
        }
    });

    // Löschung eines ToDos
    app.delete('/api/todo/:id', async function (req, res) {

        try {
            var id = req.params.id;
            
            var result = await TodoModel.deleteOne({ id: id });

            if (result.deletedCount == 0)
            {
                res.status(400).send({ error: "Das Todo konnte nicht gefunden werden."})
                return
            }
            
            res.status(204).send();
        } catch (error) {
            res.status(400).send(error);
        }
    });
};