'use strict';

var parallax = function () {
    var bg = document.querySelector('.hero__bg');
    var user = document.querySelector('.hero__user-block');
    var sectionText = document.querySelector('.hero__title-pic');

    return {
        move: function move(block, windowScroll, strafeAmount) {
            var strafe = windowScroll / -strafeAmount + '%';
            var transformString = 'translate3d(0,' + strafe + ', 0)';
            var style = block.style;

            style.transform = transformString;
            style.webkitTransform = transformString;
            //my modify
            var offSetWidth = bg.offsetWidth;
            if (offSetWidth <= 768) {
                style.transform = null;
            }
        },

        init: function init(wScroll) {
            this.move(bg, wScroll, 15);
            this.move(sectionText, wScroll, 20);
        }
    };
}();

window.addEventListener('scroll', function () {
    var wScroll = window.pageYOffset;
    parallax.init(wScroll);
    // console.log(wScroll);
});

function mobileCustomMenu() {
    "use strict";

    var sidebarBox = document.querySelector('.mobile-menu__custom');
    var sidebarBtn = document.querySelector('#hamburger');
    var isMouseDown = false;
    if (sidebarBtn) {
        sidebarBtn.addEventListener('click', function () {
            this.focus();
            console.log(this);
            sidebarBtn.classList.toggle('active');
            sidebarBox.classList.toggle('mobile-menu__custom--active');
            sidebarBox.focus();
        });
    }

    if (sidebarBtn) {
        sidebarBtn.addEventListener('mousedown', function () {
            isMouseDown = true;
        });
    }

    if (sidebarBox) {
        sidebarBox.addEventListener('mousedown', function () {
            isMouseDown = true;
        });
    }

    if (sidebarBox) {
        sidebarBox.addEventListener('mouseup', function () {
            isMouseDown = false;
        });
    }

    if (sidebarBtn) {
        sidebarBtn.addEventListener('mouseup', function () {
            isMouseDown = false;
        });
    }

    if (sidebarBox) {
        sidebarBox.addEventListener('mouseleave', function () {
            isMouseDown = false;
        });
    }

    if (sidebarBtn) {
        sidebarBtn.addEventListener('mouseleave', function () {
            isMouseDown = false;
        });
    }

    if (sidebarBox) {
        sidebarBox.addEventListener('blur', function () {
            if (!isMouseDown) {
                sidebarBox.classList.remove('mobile-menu__custom--active');
                sidebarBtn.classList.remove('active');
            }
        }, true);
    }

    if (sidebarBox, sidebarBtn) {
        window.addEventListener('keydown', function (event) {
            if (sidebarBox.classList.contains('mobile-menu__custom--active') && event.keyCode === 27) {
                sidebarBtn.classList.remove('active');
                sidebarBox.classList.remove('mobile-menu__custom--active');
            }
        });
    }

    if (sidebarBox, sidebarBtn) {
        window.addEventListener('scroll', function () {
            var docScroll = window.pageYOffset;
            if (docScroll > 300) {
                sidebarBtn.classList.remove('active');
                sidebarBox.classList.remove('mobile-menu__custom--active');
            }
        });
    }
}

mobileCustomMenu();

(function preload() {
    var images = document.images;
    var imagesTotalCount = images.length;
    var imagesLoadedCount = 0;
    var percDisplay = document.getElementById('persent');

    for (var i = 0; i < imagesTotalCount; i++) {
        var imageClone = new Image();
        imageClone.src = images[i].src;
        imageClone.addEventListener('load', imageLoaded);
        imageClone.addEventListener('error', imageLoaded);
    }

    function imageLoaded() {
        imagesLoadedCount++;

        if (imagesLoadedCount >= imagesTotalCount) {
            setTimeout(function () {
                percDisplay.textContent = Math.ceil(imagesTotalCount / imagesLoadedCount * 100) + '%';
                var preloader = document.getElementById('page-preloader');
                if (!preloader.classList.contains('done')) {
                    preloader.classList.add('done');
                }
            }, 1000);
        }
    }
})();

function sliderEngine(sliderImage, sliderDescription, nextItem, previousItem) {
    var slides = document.querySelectorAll(sliderImage);
    var nextBtn = document.querySelector(nextItem);
    var prevBtn = document.querySelector(previousItem);
    var description = document.querySelectorAll(sliderDescription);
    var currentItem = 0;
    var currentItem1 = 0;

    function next(e) {
        if (currentItem === slides.length - 1) {
            slides[currentItem].classList.remove('sliding');
            currentItem = 0;
            slides[currentItem].classList.add('sliding');
            console.log(slides[currentItem]);
        } else {
            showItem(this.id);
        }
        //todey
        if (currentItem1 === description.length - 1) {
            description[currentItem1].classList.remove('slider__slide');
            currentItem1 = 0;
            description[currentItem1].classList.add('slider__slide');
        } else {
            showItem1(this.id);
        }
        console.log(e.target);
        console.log(currentItem);
    }

    function prev(e) {
        if (currentItem < slides.length) {
            if (currentItem <= 0) {
                slides[currentItem].classList.remove('sliding');
                currentItem = slides.length - 1;
                slides[currentItem].classList.add('sliding');
            } else {
                showItem(this.id);
            }
        }
        //today
        if (currentItem1 < description.length) {
            if (currentItem1 <= 0) {
                description[currentItem1].classList.remove('slider__slide');
                currentItem1 = description.length - 1;
                description[currentItem1].classList.add('slider__slide');
            } else {
                showItem1(this.id);
            }
        }
        console.log(e.target);
    }

    function showItem(elemID) {
        if (elemID === 'prev') {
            slides[currentItem].classList.remove('sliding');
            currentItem--;
            slides[currentItem].classList.add('sliding');
        } else if (elemID === 'next') {
            slides[currentItem].classList.remove('sliding');
            currentItem++;
            slides[currentItem].classList.add('sliding');
        }
    }
    //today
    function showItem1(elemID1) {
        if (elemID1 === 'prev') {
            description[currentItem1].classList.remove('slider__slide');
            currentItem1--;
            description[currentItem1].classList.add('slider__slide');
        } else if (elemID1 === 'next') {
            description[currentItem1].classList.remove('slider__slide');
            currentItem1++;
            description[currentItem1].classList.add('slider__slide');
        }
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', next);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', prev);
    }
}

window.addEventListener('DOMContentLoaded', function () {
    sliderEngine('.slider__carousel-item', '.slider__item-data', '.slider__next-btn', '.slider__previous-btn');
});

//SIDEBAR
function sidebarBlog(btnOpen, sidebarContent) {
    var button = document.querySelector(btnOpen);
    var content = document.querySelector(sidebarContent);
    // var modef = 

    if (content) {
        document.addEventListener('click', function (e) {
            if (e.target === button) {
                content.classList.toggle('blog-container__sidebar-mobile--openSidebar');
            }
            if (e.target !== content && e.target !== button && content.classList.contains('blog-container__sidebar-mobile--openSidebar')) {
                content.classList.remove('blog-container__sidebar-mobile--openSidebar');
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', function () {
    sidebarBlog('.blog-container__btn', '.blog-container__sidebar-mobile');
});

(function submitMailandAuthUser() {
    var formMail = document.querySelector('#email');
    var formLogin = document.querySelector('#toAdmin');
    var formRegisterUser = document.querySelector('#register');

    function prepareSent(url, form, data, callback) {
        var resultContainer = form.querySelector('.status');
        resultContainer.innerHTML = 'Отправка...';
        sendAjaxJson(url, data, function (data) {
            form.reset();
            resultContainer.innerHTML = data;
            if (callback) {
                callback(data);
            }
        });
    }


    function sendAjaxJson(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function (ev) {
            var result;
            try {
                result = JSON.parse(xhr.responseText);
            } catch (e) {
                console.log(e);
                callback('Неверные данные');
            }
            callback(result.status);
        };
        xhr.send(JSON.stringify(data));
    }

    if (formMail) {
        formMail.addEventListener('submit', parseSentMail);

        function parseSentMail(event) {
            event.preventDefault();
            var data = {
                name: formMail.name.value,
                email: formMail.email.value,
                text: formMail.text.value
            };
            prepareSent('/contact', formMail, data);
        }
    }

    if (formLogin) {
        formLogin.addEventListener('submit', prepareSendLogin);

        function prepareSendLogin(e) {
            e.preventDefault();
            var data = {
                login: formLogin.login.value,
                password: formLogin.password.value
            };

            prepareSent('/to-admin', formLogin, data, function (data) {
                if (data === 'Авторизация прошла успешно!') {
                    location.href = '/admin';
                }
            });
        }
    }

    if (formRegisterUser) {
        formRegisterUser.addEventListener('submit', registerUserHandler);

        function registerUserHandler(e) {
            e.preventDefault();
            var data = {
                username: formRegisterUser.username.value,
                password: formRegisterUser.password.value
            };

            prepareSent('/register', formRegisterUser, data, function (data) {
                if (data === 'Регистрация прошла успешно!') {
                    location.href = '/about';
                }
            });
        }
    }
})();
