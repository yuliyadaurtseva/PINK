var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
var wrapperHeader = document.querySelector('.wrapper--header');

navMain.classList.remove('main-nav--nojs');
wrapperHeader.classList.remove('wrapper--header-nojs');


navToggle.addEventListener('click', function() {
    if (navMain.classList.contains('main-nav--closed')) {
        navMain.classList.remove('main-nav--closed');
        navMain.classList.add('main-nav--opened');
        
        (wrapperHeader.classList.contains('wrapper--header-closed'))
        wrapperHeader.classList.remove('wrapper--header-closed');
        wrapperHeader.classList.add('wrapper--header-opened');
    } else {
        navMain.classList.add('main-nav--closed');
        navMain.classList.remove('main-nav--opened');
        
        wrapperHeader.classList.add('wrapper--header-closed');
        wrapperHeader.classList.remove('wrapper--header-opened');
    }
});