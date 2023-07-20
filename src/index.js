const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('../db/conn');


const User = require('../models/User');

const Address = require('../models/Address');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))
app.use(express.urlencoded ({ 
        extended: true
    })
)

app.use(express.json());


app.get('/create', ( req, res ) => {
    res.render('addUser')
})

app.post('/users/create', async (req, res) => {
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    if (newsletter === 'on') {
        newsletter = true
    }else {
        newsletter = false
    }

    await User.create({name, occupation, newsletter})

    console.log(req.body)

    res.redirect('/')
})

app.get('/user/:id', async (req, res) =>{
    const id = req.params.id

    const user = await User.findOne({ raw: true, where: { id: id}})

    res.render('viewUser', { user: user })
})

app.get('/edit/:id', async (req, res) => {
    const id = req.params.id

    //const users = await User.findOne({ raw: true, where: { id: id}})
    
    try {
        const user = await User.findOne({ include: Address, where: { id: id}})
    
        res.render('editUser', {user: user.get({plain: true})});

        console.log(req.params)
    }
    catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
});

app.post("/user/remove/:id", (req, res) => {
    const id = req.params.id

    User.destroy({where: {id: id}})

    res.redirect('/')
})

app.post('/edit/update', async (req, res) => {
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter
    const id = req.body.id

    if (newsletter === "on"){
        newsletter = true
    }else {
        newsletter = false
    }

    const userData = {
        name,
        occupation,
        id,
        newsletter
    }

    await User.update(userData, {where: {id: id}})
    
    console.log(req.body)

    res.redirect('/')
});

app.post('/address/create', async (req, res) => {
    const id = req.body.id
    const street = req.body.street
    const number = req.body.number
    const city= req.body.city
    const zip = req.body.zip

    const address = {
        id,
        street,
        number,
        city,
        zip,
    }

    console.log(req.body)

    await Address.create(address)

    res.redirect(`/user/${id}`)
});

app.get('/', async (req, res) => {
    
    const users = await User.findAll({raw: true});

    console.log(users);

    res.render('home', { users : users });
})

/*const renderEdit = () => {
    window.location.href = "/edit/{{users.id}}";
};*/

module.exports = app