// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// const isAdmin = (req, res, next) => {
//     if (req.session.isAdmin) {
//         return next();
//     }
//     res.redirect('/');
// };

// router.get('/', isAdmin, (req, res, next) => {
//     let obj = {
//         title: 'Admin page'
//     };

//     Object.assign(obj, req.app.locals.settings);
//     res.render('admin', obj);
// });

// router.post('/admin', isAdmin, (req, res, next) => {
//     //требуем наличия заголовка, даты и текста
//     if (!req.body.title || !req.body.date || !req.body.text) {
//         //если что-либо не указано - сообщаем об этом
//         return res.json({
//             status: 'Укажите данные!'
//         });
//     }
//     //создаем новую запись блога и передаем в нее поля из формы
//     const Model = mongoose.model('blog');
//     let item = new Model({
//         title: req.body.title,
//         date: new Date(req.body.date),
//         body: req.body.text
//     });
//     item.save().then(
//         //обрабатываем и отправляем ответ в браузер
//         (i) => {
//             return res.json({
//                 status: 'Запись успешно добавлена'
//             });
//         }, e => {
//             //если есть ошибки, то получаем их список и так же передаем в шаблон
//             const error = Object
//                 .keys(e.errors)
//                 .map(key => e.errors[key].message)
//                 .join(', ');

//             //обрабатываем шаблон и отправляем его в браузер
//             res.json({
//                 status: 'При добавление записи произошла ошибка: ' + error
//             });
//         });
// });

// module.exports = router;