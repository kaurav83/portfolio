const mongoose = require('mongoose');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});
const config = require('./config');
mongoose.Promise = global.Promise;
mongoose
    .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
        user: config.db.user,
        pass: config.db.password
    })
    .catch(e => {
        console.error(e);
        throw e;
    });

require('./models/db-close');
let login = '';
let password = '';

rl.question('Логин: ', (answer) => {
    login = answer;

    rl.question('Пароль: ', (answer) => {
        password = answer;
        rl.close();
    });
});

rl.on('close', () => {
    require('./models/user');

    const User = mongoose.model('user');
    const adminUser = new User({
        login: login,
        password: password
    });
    User
        .findOne({login: login})
        .then((u) => {
            if (u) {
                throw new Error('Такой пользователь уже существует');
            }

            return adminUser.save();
        })
        .then((u) => console.log('ok!'), (e) => console.error(e.message))
        .then( () => process.exit(0));
});