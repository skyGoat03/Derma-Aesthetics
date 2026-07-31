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

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* Hero product carousel — rotates positions every 3s */
const heroComposition = document.querySelector(".hero-product-composition");
if (heroComposition) {
  const prods = heroComposition.querySelectorAll(".hero-prod");
  const positions = ["hero-prod--center", "hero-prod--left", "hero-prod--right"];
  let current = 0;

  heroComposition.addEventListener("click", (event) => {
    const clickedImage = event.target.closest(".hero-prod");

    if (!clickedImage || !clickedImage.classList.contains("hero-prod--center")) {
      return;
    }

    const productLink = clickedImage.dataset.productLink;

    if (productLink) {
      window.location.href = productLink;
    }
  });

  setInterval(() => {
    current = (current + 1) % prods.length;
    prods.forEach((img, i) => {
      img.classList.remove(positions[0], positions[1], positions[2]);
      img.classList.add(positions[(i - current + prods.length) % prods.length]);
    });
  }, 3000);
}

function clearProductImage(showcase) {
  if (!showcase) {
    return;
  }

  const imageFloat = showcase.querySelector(".product-image-float");
  const imageEl = imageFloat?.querySelector("img:not(.extra-img)");
  const extraImg = imageFloat?.querySelector(".extra-img");

  showcase.classList.remove("has-image");

  if (!imageFloat) {
    return;
  }

  imageFloat.classList.remove("is-visible");
  imageFloat.setAttribute("aria-hidden", "true");

  if (imageEl) {
    imageEl.onload = null;
    imageEl.onerror = null;
    imageEl.removeAttribute("src");
    imageEl.alt = "";
  }

  if (extraImg) {
    extraImg.onload = null;
    extraImg.onerror = null;
    extraImg.removeAttribute("src");
    extraImg.alt = "";
    extraImg.style.display = "none";
  }
}

function hideProductShowcase(showcase) {
  if (!showcase) {
    return;
  }

  showcase.classList.remove("has-active");
  clearProductImage(showcase);
}

function showProductImage(card, showcase) {
  if (!showcase) {
    return;
  }

  const imageFloat = showcase.querySelector(".product-image-float");
  const imageEl = imageFloat?.querySelector("img:not(.extra-img)");
  const extraImg = imageFloat?.querySelector(".extra-img");
  const imageSrc = card.dataset.productImage;
  const extraSrc = card.dataset.productImageExtra;

  clearProductImage(showcase);

  if (!imageSrc || !imageFloat || !imageEl) {
    return;
  }

  const title = card.querySelector("h3")?.textContent.trim() || "Product";

  if (extraSrc && extraImg) {
    extraImg.alt = title + " ingredients";
    extraImg.style.display = "block";
    extraImg.src = extraSrc;
  }

  imageEl.alt = title;
  imageEl.onload = () => {
    showcase.classList.add("has-image");
    imageFloat.classList.add("is-visible");
    imageFloat.setAttribute("aria-hidden", "false");
  };
  imageEl.onerror = () => {
    clearProductImage(showcase);
  };
  imageEl.src = imageSrc;
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

function openCard(card, grid, showcase) {
  const button = card.querySelector(".expand-btn");
  const details = card.querySelector(".product-details");

  if (!button || !details) {
    return;
  }

  card.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");
  details.setAttribute("aria-hidden", "false");
  button.childNodes[0].textContent = "Less Info ";
  details.style.maxHeight = `${details.scrollHeight}px`;
  grid.classList.add("has-active");

  if (showcase) {
    showcase.classList.add("has-active");
    showProductImage(card, showcase);
  }
}

function setupExpandableGrid(grid) {
  const showcase = grid.closest(".product-showcase");
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
        openCard(card, grid, showcase);
      } else {
        collapseCard(card);
        grid.classList.remove("has-active");
        hideProductShowcase(showcase);
      }
    });
  });

  return expandableCards;
}

const productGrids = [];

document.querySelectorAll(".product-grid").forEach((grid) => {
  productGrids.push({
    grid,
    cards: setupExpandableGrid(grid),
  });
});

function openProductFromHash() {
  const hash = window.location.hash.replace("#", "");

  if (!hash) {
    return;
  }

  const targetCard = document.getElementById(hash);

  if (!targetCard || !targetCard.classList.contains("product-card")) {
    return;
  }

  const gridEntry = productGrids.find(({ grid }) => grid.contains(targetCard));

  if (!gridEntry) {
    return;
  }

  const { grid, cards } = gridEntry;
  const showcase = grid.closest(".product-showcase");

  cards.forEach((card) => {
    if (card !== targetCard) {
      collapseCard(card);
    }
  });

  grid.querySelectorAll(".product-card.expandable").forEach((card) => {
    if (card !== targetCard) {
      collapseCard(card);
    }
  });

  openCard(targetCard, grid, showcase);
  targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

window.addEventListener("hashchange", openProductFromHash);
openProductFromHash();
