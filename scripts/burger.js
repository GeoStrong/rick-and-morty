'use strict';

const body = document.querySelector('body');
const list = document.querySelector('.header__list');
const hamburger = document.querySelector('.hamburger');
const hamburgerButtons = document.querySelectorAll('.hamburger__btn');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.overlay');

hamburger.addEventListener('click', function () {
  menu.classList.toggle('active');
  hamburgerButtons.forEach((btn) => btn.classList.toggle('hidden'));
  list.style.display = 'flex';
  list.classList.toggle('hamburger__list');
  body.classList.toggle('no-overflow');
  if (hamburgerButtons[1].classList.contains('hidden'))
    list.style.display = 'none';
  overlay.classList.toggle('overlay-active');
});
