document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

function setMenu(open) {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mainNav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        setMenu(false);
        navLinks.forEach((item) => item.classList.toggle("active", item === link));
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 820) setMenu(false);
});

function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = [...document.querySelectorAll("main section[id]")];
let activeNavFrame = null;

function updateActiveNav() {
    activeNavFrame = null;
    if (!sections.length) return;
    const marker = window.scrollY + window.innerHeight * 0.34;
    let currentSection = sections[0].id;

    sections.forEach((section) => {
        if (marker >= section.offsetTop) currentSection = section.id;
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
    });
}

updateActiveNav();
window.addEventListener(
    "scroll",
    () => {
        if (activeNavFrame) return;
        activeNavFrame = window.requestAnimationFrame(updateActiveNav);
    },
    { passive: true }
);

document.querySelectorAll(".faq-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
        if (!detail.open) return;
        document.querySelectorAll(".faq-list details").forEach((other) => {
            if (other !== detail) other.open = false;
        });
    });
});

const quoteForm = document.querySelector("#quote-form");
const formError = quoteForm?.querySelector(".form-error");

quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...quoteForm.querySelectorAll("[required]")];
    let firstInvalid = null;

    fields.forEach((field) => {
        const invalid = !field.value.trim();
        field.setAttribute("aria-invalid", String(invalid));
        if (invalid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
        formError.textContent = "Preencha seu nome, sua localização e o tipo de serviço.";
        formError.classList.add("visible");
        firstInvalid.focus();
        return;
    }

    formError.textContent = "";
    formError.classList.remove("visible");

    const data = new FormData(quoteForm);
    const name = data.get("nome").trim();
    const place = data.get("local").trim();
    const service = data.get("servico").trim();
    const details = data.get("detalhes").trim();
    const message = [
        "Olá, Monica! Vim pelo site da Serralheria RRM e gostaria de solicitar um orçamento.",
        "",
        `Nome: ${name}`,
        `Bairro/cidade: ${place}`,
        `Serviço: ${service}`,
        details ? `Detalhes: ${details}` : "Detalhes: enviarei mais informações pelo WhatsApp.",
    ].join("\n");

    const url = `https://wa.me/5521964573117?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
});

quoteForm?.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
        if (field.value.trim()) field.removeAttribute("aria-invalid");
    });
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector("figure img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxTriggers = [...document.querySelectorAll("[data-lightbox]")];
let currentImage = 0;

function renderLightbox(index) {
    if (!lightboxImage || !lightboxCaption || !lightboxTriggers.length) return;
    currentImage = (index + lightboxTriggers.length) % lightboxTriggers.length;
    const trigger = lightboxTriggers[currentImage];
    lightboxImage.src = trigger.dataset.src;
    lightboxImage.alt = trigger.dataset.alt || "Projeto da Serralheria RRM";
    lightboxCaption.textContent = trigger.dataset.title || "Projeto Serralheria RRM";
}

function openLightbox(index) {
    if (!lightbox) return;
    renderLightbox(index);
    if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
    } else {
        lightbox.setAttribute("open", "");
    }
}

function closeLightbox() {
    if (!lightbox) return;
    if (typeof lightbox.close === "function") lightbox.close();
    else lightbox.removeAttribute("open");
}

lightboxTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openLightbox(index));
});

lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => renderLightbox(currentImage - 1));
lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => renderLightbox(currentImage + 1));

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
    if (!lightbox?.open) return;
    if (event.key === "ArrowLeft") renderLightbox(currentImage - 1);
    if (event.key === "ArrowRight") renderLightbox(currentImage + 1);
});
