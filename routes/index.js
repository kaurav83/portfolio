let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
//crypto - added 26.10
const crypto = require('crypto');

//02.11.2017

const Account = require('../models/account');
const passport = require('passport');

// router.get('/', (req, res) => {
//     res.render('index', {user: req.user});
// });

const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin');
};

const isPassword = (req, res, next) => {
    if (req.session.isPassword) {
        return next();
    }
    res.redirect('/about');
}

router.get('/', (req, res) => {
    let obj = {
        title: 'Главная'
    }
    Object.assign(obj, req.app.locals.settings);
    res.render('auth', obj);
});

router.get('/about', (req, res) => {
    console.log(req.user);
    // Object.assign(obj, req.app.locals.settings);
    res.render('about', {
        user: req.user
    });
});

router.get('/works', (req, res) => {
    console.log(req.user);
    // Object.assign(obj, req.app.locals.settings);
    res.render('works', {
        user: req.user
    });
});


router.get('/to-admin', (req, res) => {
    console.log(req.user);
    let obj = {
        title: 'Авторизация'
    };
    Object.assign(obj, req.app.locals.settings);
    //     res.render('login', obj);
    res.render('toAdmin', obj);
});

router.post('/to-admin', (req, res) => {
    console.log(req.user);
    if (!req.body.login || !req.body.password) {
        return res.json({
            status: 'Укажите логин и пароль!'
        });
    }
    const Model = mongoose.model('user'),
        password = crypto
        .createHash('md5')
        .update(req.body.password)
        .digest('hex');

    Model
        .findOne({
            login: req.body.login,
            password: password
        })
        .then(item => {
            console.log(item)
            if (!item) {
                res.json({
                    status: 'Логин или пароль введены неверно'
                });
            } else {
                req.session.isAdmin = true;
                res.json({
                    status: 'Авторизация прошла успешно!'
                })
            }
        })
});


router.get('/register', (req, res) => {
    res.render('register', {});
});

router.post('/register', (req, res) => {
    if (!req.body.password || !req.body.username) {
        return res.json({
            status: 'Укажите логин и пароль!'
        })
    }
    Account.register(new Account({
        username: req.body.username
    }), req.body.password, (err, account) => {
        if (err) {
             res.json({
                status: 'Такой пользователь уже существует'
             });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.isPassword = true;
            console.log(req.user);
            res.json({
                status: 'Регистрация прошла успешно'
            });
            // res.redirect('/about');
        });
    });
});

//--------------------------------------07.11.17
router.get('/login', (req, res) => {
    res.render('login', {
        user: req.user
    });
});

// router.post('/login', passport.authenticate('local'), (req, res) => {
//     res.redirect('/about');
// });
router.post('/login', 
    passport.authenticate('local', {
    successRedirect: '/about',
    failureRedirect: '/login'
}));
//--------------------------------------------------

router.get('/logout', (req, res) => {
    console.log(req.user);
    req.logout();
    res.redirect('/about');
});

router.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

router.get('/about', (req, res, next) => {
    res.render('about', {
        title: 'About'
    })
});

router.get('/works', (req, res, next) => {
    res.render('works', {
        title: 'Works'
    });
});

router.get('/admin', isAdmin, (req, res, next) => {
    let obj = {
        title: 'Admin page'
    };

    Object.assign(obj, req.app.locals.settings);
    res.render('admin', obj);
});


router.get('/blog', (req, res, next) => {
    const Model = mongoose.model('blog');
    //получаем список записей в блоге из базы
    Model.find().then(items => {
        // обрабатываем шаблон и отправляем его в браузер передаем в шаблон список
        // записей в блоге
        // Object.assign(obj, { items: items });
        res.render('blog', {
            items,
            user: req.user
        });
    });
});

// router.get('/:id', (req, res, next) => {
//     const Model = mongoose.model('blog');
//     //получаем список записей в блоге из базы
//     Model.findById(req.params.id).then(item => {
//         // обрабатываем шаблон и отправляем его в браузер передаем в шаблон список
//         // записей в блоге
//         res.render('posts.pug', {
//             item
//         });
//     });
// });

router.post('/admin', isAdmin, (req, res, next) => {
    //требуем наличия заголовка, даты и текста
    if (!req.body.title || !req.body.date || !req.body.text) {
        //если что-либо не указано - сообщаем об этом
        return res.json({
            status: 'Укажите данные!'
        });
    }
    //создаем новую запись блога и передаем в нее поля из формы
    const Model = mongoose.model('blog');
    let item = new Model({
        title: req.body.title,
        date: new Date(req.body.date),
        body: req.body.text
    });
    item.save().then(
        //обрабатываем и отправляем ответ в браузер
        (i) => {
            return res.json({
                status: 'Запись успешно добавлена'
            });
        }, e => {
            //если есть ошибки, то получаем их список и так же передаем в шаблон
            const error = Object
                .keys(e.errors)
                .map(key => e.errors[key].message)
                .join(', ');

            //обрабатываем шаблон и отправляем его в браузер
            res.json({
                status: 'При добавление записи произошла ошибка: ' + error
            });
        });
});

module.exports = router;