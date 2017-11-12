// function TooglePersonalAccount(state) {
//     var pointElem = document.getElementsByClassName('personal-account__toogle')[0];
//     var elemBtn = state.elemButton;
//     var listElem = document.querySelector('.personal-account__list');
//     var items = listElem.querySelectorAll('LI');
//     elemBtn.addEventListener('click', function (event) {
//         if (event.target.className === 'personal-account__toogle' || 'personal-account__toogle-text') {
//             toggle();
//             event.target.onmousedown = function () {
//                 return false;
//             };
//         }
        
//     });
//     let isOpen = false;

//     let onDocumentClick = function (event) {
//         if (!elemBtn.contains(event.target)) {
//             close();
//         }
//     };

//     let toggle = function () {
//         if (isOpen) {
//             close()
//         } else {
//             open();
//         }
//     };

//     let open = function () {
//         elemBtn.classList.add('open');
//         document.addEventListener('click', onDocumentClick);

//         isOpen = true;
//     };

//     let close = function () {
//         elemBtn.classList.remove('open');
//         document.removeEventListener('click', onDocumentClick);
//         isOpen = false;
//     }
// }

// var tooglePersonalAccount = new TooglePersonalAccount({
//     elemButton: document.querySelector('.personal-account')
// });