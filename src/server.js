const app = require('./index');
const conn = require('../db/conn');
const port = 3000

/* 
app.listen(port, (err) => {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err);
    } else {
        console.log(`Servidor rodando na porta ${port}`);
    }
}); 
*/

conn
//.sync({force: true})
.sync()
.then( () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})
.catch((err) => console.log(err))