"use strict";

///////////////////////////////////////
// elements

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const timerLabel = document.querySelector(".offer_timer");
const timerContainer = document.querySelector(".top-bar");
const header = document.querySelector(".header");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const nav__links = document.querySelector(".nav__links");
const nav__link = document.querySelectorAll(".nav__link");
const nav = document.querySelector(".nav");
const tabContainer = document.querySelector(".operations__tab-container");
const tabBtns = document.querySelectorAll(".operations__tab");
const tabContent = document.querySelectorAll(".operations__content");
const allSections = document.querySelectorAll(".section");
const lazyImages = document.querySelectorAll("img[data-src]");

const openModal = () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// for (let btnOpen of btnsOpenModal) {
//   btnOpen.addEventListener("click", openModal);
// }

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// create and delete element (cookies functionality) =======================>
// const message = document.createElement("div");
// message.classList.add("cookie-message");
// message.innerHTML =
//   "We use cookies to create bettter experience for you. <button class='btn btn--close-cookies'>Got it!</button>";

// header.append(message);

// document.querySelector(".btn--close-cookies").addEventListener("click", () => {
//   message.remove();
// });

// smooth scrolling on larn more button      ==================================================>
btnScrollTo.addEventListener("click", function (e) {
  //old method  =====
  // const s1cords = section1.getBoundingClientRect();

  // console.log(s1cords);

  // console.log(
  //   "viewport :",
  //   document.documentElement.clientWidth,
  //   document.documentElement.clientHeight
  // );

  // cuurent offset of window (scroll position)
  // console.log("current x/y offset", window.scrollX, window.scrollY);

  //wil pass this option object in window scroll to
  // const option = {
  //   left: s1cords.left + window.scrollX,
  //   top: s1cords.top + window.scrollY,
  //   behavior: "smooth",
  // };
  // window.scrollTo(option);

  //new method (for modern browser)
  section1.scrollIntoView({ behavior: "smooth" });
});

// smooth scrolling on header links    ==================================================>
/// one way using function and event on each click

// nav__link.forEach(function (link) {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = link.getAttribute("href");
//     const sectionElement = document.querySelector(`${id}`);
//     // console.log(sectionElement);
//     sectionElement.scrollIntoView({ behavior: "smooth" });
//   });
// });

//using event delegation

// 1. select the parent element on which target is present
// 2. matching the property so that event listner only work on which it is clicked
nav__links.addEventListener("click", function (e) {
  // e.target;
  // matching the target
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    const sectionElement = document.querySelector(`${id}`);
    sectionElement.scrollIntoView({ behavior: "smooth" });
  }
});

// tab content ============================================================================>
// 1. find parent content of all tabs
// 2. use event deligation to just click on tab button (use closet )
// 3. check for active class on button and remove it if already present add add on clicked one
// 4. select the tab content div using data-tab from button for dynamic class
// 5. add active aclass on present tab content and remove from others
tabContainer.addEventListener("click", function (e) {
  // matching
  const clickedBtn = e.target.closest(".operations__tab");

  if (clickedBtn) {
    //removing the active class from each tab buttons
    tabBtns.forEach((tbBtn) => {
      tbBtn.classList.remove("operations__tab--active");
    });
    //adding the active class to present button
    clickedBtn.classList.add("operations__tab--active");
    //removing the active class from each tab contnent
    tabContent.forEach((tbCnt) => {
      tbCnt.classList.remove("operations__content--active");
    });
    //selecting current tab content
    const currentTabContent = document.querySelector(
      `.operations__content--${clickedBtn.dataset.tab}`
    );
    currentTabContent.classList.add("operations__content--active");
  }
});

// fade menu on hover ============================================================================>
// excepted selected menu all menus will be fade
// 1. select main menu parent
// 2. add event listner to main parent and check for current menu link (event delegation)
// 3. need to take add two event listner mouseover(fade) and mouseup(reset)
// nav.addEventListener("mouseover", function (e) {
//   if (e.target.classList.contains("nav__link")) {
//     const link = e.target;
//     const siblings = link.closest(".nav").querySelectorAll(".nav__link");

//     siblings.forEach((sibling) => {
//       if (sibling != link) {
//         sibling.style.opacity = 0.4;
//       }
//     });
//   }
// });

// nav.addEventListener("mouseout", function (e) {
//   if (e.target.classList.contains("nav__link")) {
//     const link = e.target;
//     const siblings = link.closest(".nav").querySelectorAll(".nav__link");

//     siblings.forEach((sibling) => {
//       if (sibling != link) {
//         sibling.style.opacity = 1;
//       }
//     });
//   }
// });

// with one function and passing arguments in add event listener

const handleFunc = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");

    siblings.forEach((sibling) => {
      if (sibling != link) {
        sibling.style.opacity = this;
      }
    });
  }
};
//by using bind() the value of this will be 0.5 or 1
nav.addEventListener("mouseover", handleFunc.bind(0.5));
nav.addEventListener("mouseout", handleFunc.bind(1));

// sticky navbar on hover ============================================================================>
// const intialcords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   console.log(intialcords.top);
//   if (window.scrollY > intialcords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// sticky navigation in a better way using intersector observer API ==========================>
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
// stickyNav is the function
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// revealing sections using intersector observer API ====================================================>
// allSections

const revealSec = function (entries, observer) {
  const entry = entries[0];
  // console.log(entry);
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

// lazy loading images
// console.log(lazyImages);
const lazyImgLoader = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", () => {
      entry.target.classList.remove("lazy-img");
    });
  }
};

const lazyImgObserver = new IntersectionObserver(lazyImgLoader, {
  root: null,
  threshold: 0.15,
});

lazyImages.forEach((lazyimage) => {
  lazyImgObserver.observe(lazyimage);
});

// slider ==============================================================================================>
// only image slider
///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// heade menu toggle
const menuBtn = document.querySelector(".headmenu_icn");
menuBtn.addEventListener("click", function () {
  nav__links.classList.toggle("active");
});


nav__link.forEach((navlink)=>{
  navlink.addEventListener("click", function () {
    nav__links.classList.remove("active");
  });
});