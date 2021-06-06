'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollBtn = document.querySelector('.btn--scroll-to');
const sec1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal(`sdfsdfsdf`);
  }
});


scrollBtn.addEventListener('click', function (e) {
  const s1cord = sec1.getBoundingClientRect();
  // window.scrollTo(s1cord.left + window.pageXOffset, s1cord.top + window.pageYOffset);

  /*
  //NOTE: old way of smooth scroll
  window.scrollTo({
    left: s1cord.left + window.pageXOffset,
    top: s1cord.top + window.pageYOffset,
    behavior: "smooth"
  });
*/
  // NOTE: Modern way of smooth scroll
  sec1.scrollIntoView({ behavior: "smooth" })
});

//OLD:
/*
document.querySelectorAll('.nav__link').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    let id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// smooth-scrolling using event delegation
document.querySelector(".nav__links").addEventListener("click", e => {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    let id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//tabbed component
tabContainer.addEventListener('click', e => {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  //removeing active classed from all tabs and tab content
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach(tc => tc.classList.remove("operations__content--active"));

  //adding active class on the clicked tab and tab content
  clicked.classList.add("operations__tab--active");
  const tabNumber = clicked.dataset.tab;
  document.querySelector(`.operations__content--${tabNumber}`).classList.add("operations__content--active");
});


//NOTE: fade on hover effect for nav
const handleHover = function(e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(s => {
      if (s !== link) {
        s.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//NOTE: sticky nav old school

// const intlCord = sec1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY > intlCord.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

//NOTE: Sticky nav using intersection observer API
const stickyNav = (entries, observer) => {
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}

const stickyOpt = {
  root: null,
  threshold: 0,
  rootMargin: '-90px'
}

const stickyObs = new IntersectionObserver(stickyNav, stickyOpt);
stickyObs.observe(header);


//NOTE: reveal section
const sections = document.querySelectorAll(".section");

const revealSec = (entries, observer) => {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}

const secObs = {
  root: null,
  threshold: .15
}

const sectionObserver = new IntersectionObserver(revealSec, secObs);
sections.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add("section--hidden");
});

//NOTE: lazy loading

const targetImgs = document.querySelectorAll("img[data-src]");

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () => entry.target.classList.remove("lazy-img"));
  observer.unobserve(entry.target);
}

const opt = {
  root: null,
  rootMargin: "200px",
  threshold: 0
}
const lazyImg = new IntersectionObserver(loadImg, opt);
targetImgs.forEach(img => lazyImg.observe(img));