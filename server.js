const express = require("express")
const app = express()
const PORT = 3000;
const hbs = require('express-handlebars');
const path = require("path")
const Datastore = require('nedb')
app.use(express.urlencoded({
    extended: true
}));

const coll = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.get("/", function (req, res) {
    res.render('index.hbs');   // nie podajemy ścieżki tylko nazwę pliku
})

app.get("/add", function (req, res) {
    let info = ""
    if (req.query != undefined) {
        let obj = {
            ubezpieczony: req.query.ubezpieczony == "on" ? "TAK" : "NIE",
            benzyna: req.query.benzyna == "on" ? "TAK" : "NIE",
            uszkodzony: req.query.uszkodzony == "on" ? "TAK" : "NIE",
            naped4x4: req.query.naped4x4 == "on" ? "TAK" : "NIE",
        }
        coll.insert(obj, function (err, newDoc) {
            info = `Dodano rekord o id: ${newDoc._id}`
            res.render('add.hbs', {info:info});
        });
    }
})

app.get("/list", function (req, res) {
    coll.find({}, function (err, docs) {
        res.render('list.hbs', { context: docs });   // nie podajemy ścieżki tylko nazwę pliku
    });
})

app.get("/delete", function (req, res) {
    coll.find({}, function (err, docs) {
        res.render('delete.hbs', { context: docs });   // nie podajemy ścieżki tylko nazwę pliku
    });
})

app.get("/deleteAll", function (req, res) {
    console.log(req.query)
    coll.remove({}, { multi: true }, function (err, numRemoved) {
        console.log("usunięto wszystkie dokumenty: ", numRemoved)
        coll.find({}, function (err, docs) {
            res.render('delete.hbs', Object({ "tab": docs, "alert": "Usunięto wszystkie rekordy" }))
        });
    });
})
app.get("/deletePojedynczyRekord", function (req, res) {
    console.log(req.query)
    coll.remove({_id:req.query.bungus}, {}, function (err, numRemoved) {
        console.log("usunięto wszystkie dokumenty: ", numRemoved)
        coll.find({}, function (err, docs) {
            res.render('delete.hbs', Object({ "context": docs, "alert": "Usunięto wszystkie rekordy" }))
        });
    });
    
})
app.get("/edit", function (req, res) {
    res.render('edit.hbs');   // nie podajemy ścieżki tylko nazwę pliku
}) 