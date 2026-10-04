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
  const products = [...heroComposition.querySelectorAll(".hero-prod")];
  const positionClasses = [
    "hero-prod--center",
    "hero-prod--left",
    "hero-prod--right",
    "hero-prod--back",
  ];

  if (products.length > 0) {
    const initialCenter = products.findIndex((product) =>
      product.classList.contains("hero-prod--center")
    );
    let current = initialCenter >= 0 ? initialCenter : 0;

    function renderCarousel() {
      products.forEach((product, index) => {
        const relativePosition = (index - current + products.length) % products.length;
        let position;

        if (relativePosition === 0) {
          position = "hero-prod--center";
        } else if (relativePosition === 1) {
          position = "hero-prod--left";
        } else if (relativePosition === products.length - 1) {
          position = "hero-prod--right";
        } else {
          position = "hero-prod--back";
        }

        product.classList.remove(...positionClasses);
        product.classList.add(position);
      });
    }

    heroComposition.addEventListener("click", (event) => {
      const clickedImage = event.target.closest(".hero-prod");

      if (!clickedImage?.classList.contains("hero-prod--center")) {
        return;
      }

      const productLink = clickedImage.dataset.productLink;

      if (productLink) {
        window.location.href = productLink;
      }
    });

    renderCarousel();

    if (products.length > 1) {
      setInterval(() => {
        current = (current + 1) % products.length;
        renderCarousel();
      }, 3000);
    }
  }
}

function clearProductImage(card) {
  const media = card.querySelector(".product-detail-media");

  if (!media) {
    return;
  }

  const image = media.querySelector("img");
  image.onload = null;
  image.onerror = null;
  media.remove();
}

function showProductImage(card) {
  const details = card.querySelector(".product-details");
  const title = card.querySelector("h3")?.textContent.trim() || "Product";
  const imageSrc = card.dataset.productImage;

  if (!imageSrc) {
    return;
  }

  const image = new Image();
  image.alt = `${title} product photo`;
  image.onload = () => {
    if (!card.classList.contains("is-open")) {
      return;
    }

    const media = document.createElement("figure");
    media.className = "product-detail-media";
    media.append(image);
    details.prepend(media);
    details.style.maxHeight = `${details.scrollHeight}px`;
  };
  image.src = imageSrc;
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
  clearProductImage(card);
  details.style.maxHeight = "0px";
}

function openCard(card, grid) {
  const button = card.querySelector(".expand-btn");
  const details = card.querySelector(".product-details");

  if (!button || !details) {
    return;
  }

  card.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");
  details.setAttribute("aria-hidden", "false");
  button.childNodes[0].textContent = "Less Info ";
  grid.classList.add("has-active");
  showProductImage(card);
  details.style.maxHeight = `${details.scrollHeight}px`;
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
        openCard(card, grid);
      } else {
        collapseCard(card);
        grid.classList.remove("has-active");
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

  openCard(targetCard, grid);
  targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

window.addEventListener("hashchange", openProductFromHash);
openProductFromHash();
