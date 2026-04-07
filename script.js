const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function collapseCard(card) {
  const button = card.querySelector(".expand-btn");
  const details = card.querySelector(".product-details");

  if (!button || !details) {
    return;
  }

  card.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  details.setAttribute("aria-hidden", "true");
  button.childNodes[0].textContent = "More Info ";
  details.style.maxHeight = "0px";
}

function setupExpandableGrid(grid) {
  const expandableCards = grid.querySelectorAll(".product-card.expandable");

  expandableCards.forEach((card) => {
    const button = card.querySelector(".expand-btn");
    const details = card.querySelector(".product-details");

    if (!button || !details) {
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = !card.classList.contains("is-open");

      expandableCards.forEach((otherCard) => {
        if (otherCard !== card) {
          collapseCard(otherCard);
        }
      });

      if (isOpen) {
        card.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        details.setAttribute("aria-hidden", "false");
        button.childNodes[0].textContent = "Less Info ";
        details.style.maxHeight = `${details.scrollHeight}px`;
        grid.classList.add("has-active");
      } else {
        collapseCard(card);
        grid.classList.remove("has-active");
      }
    });
  });
}

document.querySelectorAll(".product-grid").forEach((grid) => {
  setupExpandableGrid(grid);
});
