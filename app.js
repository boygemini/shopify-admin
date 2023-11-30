"use strict";

//**- SEARCH BOX
let searchField = document.getElementById("search");
searchField.onfocus = (e) => addClassNameToParentElement(e, "focused");
searchField.onblur = (e) => removeClassNameFromParentElement(e, "focused");

const addClassNameToParentElement = (e, class_name) => {
  let parent = e.target.parentNode;
  parent.classList.add(class_name);
};

const removeClassNameFromParentElement = (e, class_name) => {
  let parent = e.target.parentNode;
  parent.classList.remove(class_name);
};

//**- TAGS & NOTIFICATIONS
const AllTagMenu = [...document.querySelectorAll(".tag-menu")];
const topNavButtons = [...document.querySelectorAll(".up-btn")];
const bellDOM = document.querySelector(".bell");
const tagDom = document.querySelector(".tag");
bellDOM.addEventListener("click", (e) => toggleMenu(e, ".alert"));
tagDom.addEventListener("click", (e) => toggleMenu(e, ".user"));

const toggleMenu = ({ target }, toggle_menu_classname) => {
  let menu = document.querySelector(toggle_menu_classname);
  let isMenuOpen = menu.classList.contains("on");

  var isExpanded = target.getAttribute("aria-expanded") === "true";
  target.setAttribute("aria-expanded", !isExpanded);
  menu.setAttribute("aria-hidden", isExpanded);

  if (isMenuOpen) {
    menu.classList.remove("on");
    target.classList.remove("btn-clicked");
  }

  if (!isMenuOpen) {
    AllTagMenu.forEach((a) => a.classList.remove("on"));
    topNavButtons.forEach((a) => a.classList.remove("btn-clicked"));
    menu.classList.toggle("on");
    target.classList.add("btn-clicked");
  }
};

const removeShoutOut = (shout_container_classname) => {
  let shoutOut = document.querySelector(shout_container_classname);
  shoutOut.classList.add("off");
};

const toggleMainAccordion = (accordion_arrow, main_content_classname) => {
  let mainContent = document.querySelector(main_content_classname);
  let accordionArrow = document.querySelector(accordion_arrow);
  mainContent.classList.toggle("on");
  accordionArrow.classList.toggle("on");
};

const mainAccordionButton = (document.querySelector(".control").onclick = () =>
  toggleMainAccordion(".arrow", ".accordion-main-content"));

//** END TAGS & NOTIFICATIONS

//**- PROGRESS BAR & STEPS

let allCheckboxes = [...document.querySelectorAll(".accordion-t-svg")];
let overAllDOM = document.querySelector(".overall");
let stepDOM = document.querySelector(".step");
let overAll = allCheckboxes.length,
  step = 0;
let progressDOM = document.querySelector(".progress");

const updateProgress = () => {
  let percentage = (step / overAll) * 100;
  overAllDOM.textContent = overAll;
  stepDOM.textContent = step;
  progressDOM.style.width = `${percentage}%`;
};

const removeClassFromAllElementsInArray = (array, class_name) => {
  return array.forEach((a) => a.classList.remove(class_name));
};

const makeAPICall = (env) => {
  return new Promise((resolve, reject) => {
    if (env === "live") {
      fetch("https://pokeapi.co/api/v2/pokemon/ditto")
        .then((r) => r.json())
        .then((res) => resolve(res))
        .catch((err) => err);
    } else if (env === "demo") {
      setTimeout(() => resolve(true), 400);
    }
  });
};

const markProgress = async (button) => {
  let [loadingIcon, doneIcon] = button.children;
  let icons = [...button.children];

  button.classList.add("active");
  loadingIcon.classList.add("clicked");

  if (button.classList.contains("clicked")) {
    step > 0 && step <= overAll ? (step -= 1) : 0;
    removeClassFromAllElementsInArray(icons, "clicked");
    button.classList.remove("active", "clicked");
    updateProgress();
    return;
  }

  const makeCallBasedOnEnvironment = await makeAPICall("demo").catch(
    (err) => err
  );

  if (!button.classList.contains("clicked")) {
    button.classList.add("clicked");
    if (step < overAll) {
      if (makeCallBasedOnEnvironment) {
        step = step + 1;
        removeClassFromAllElementsInArray(icons, "clicked");
        doneIcon.classList.add("clicked");
        checkForTheNextStep();
        updateProgress();
      }
      return;
    }
    step = overAll;
    updateProgress();
  }
};

const checkForTheNextStep = () => {
  let newArray = [];
  allCheckboxes.forEach((box) => {
    if (!box.classList.contains("clicked")) {
      newArray.push(box);
    } else {
      // remove the active class from the current checked box
      box.parentNode.classList.remove("active");
    }
  });

  // first element in the new array (newArray) is the next STEP
  newArray[0]?.parentNode.classList.add("active");
};

allCheckboxes.forEach((box) =>
  box.addEventListener("click", () => markProgress(box))
);

// sets the initial progress
updateProgress();

//** END PROGRESS BAR

//**- ACCORDION

const openAccordion = (currentAccordion) => {
  let allAccordions = [...document.querySelectorAll(".accordion-title")];
  allAccordions.forEach((accordion) => accordion.classList.remove("active"));
  currentAccordion.classList.add("active");
};

const addListenerToChildren = (childrenArray, func) => {
  childrenArray.forEach((child) => {
    child.addEventListener("click", func);
  });
};

const Accordion = [...document.querySelectorAll(".accordion-title")].forEach(
  (accordion) => {
    let children = [...accordion.children];
    addListenerToChildren(children, () => openAccordion(accordion));
    accordion.addEventListener("click", () => openAccordion(accordion));
  }
);

//** END ACCORDION
