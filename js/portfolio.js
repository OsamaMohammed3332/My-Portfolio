import { truncateText } from "./utils.js";

export function createProjectElement(project, index) {
	if (!project || !project.images || !project.images.length) {
		console.error("Invalid project data:", {
			hasProject: !!project,
			hasImages: project?.images?.length > 0,
		});
		return document.createElement("div");
	}

	const projectElement = document.createElement("div");
	projectElement.className = "col-md-4";
	projectElement.style.opacity = "0";
	projectElement.style.transform = "translateY(20px)";
	projectElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";

	try {
		// Validate required fields before generating HTML
		if (!project.id || !project.title) {
			throw new Error(
				`Missing required fields for project: ${JSON.stringify(project)}`
			);
		}
		projectElement.innerHTML = generateProjectHTML(project);
	} catch (error) {
		console.error("Error generating project HTML:", {
			error: error.message,
			project: project,
		});
		projectElement.innerHTML = `
            <div class="work-box">
                <p class="text-danger">Error loading project: ${
									project.title || "Untitled"
								}</p>
            </div>`;
	}

	setTimeout(() => {
		projectElement.style.opacity = "1";
		projectElement.style.transform = "translateY(0)";
	}, 50 * index);

	return projectElement;
}

export function generateProjectHTML(project) {
	if (!project || !project.images || !project.images.length) {
		console.error("Invalid project data:", project);
		throw new Error("Invalid project data");
	}

	const carouselIndicators = project.images
		.map(
			(_, index) => `
            <li data-target="#carousel-${project.id}" data-slide-to="${index}" 
                ${index === 0 ? 'class="active"' : ""}></li>`
		)
		.join("");

	const carouselItems = project.images
		.map(
			(imageUrl, index) => `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <a href="${imageUrl}" data-lightbox="gallery-${project.id}">
                    <img class="d-block w-100 img-fluid lazy-load" 
                         data-src="${imageUrl}" 
                         src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                         alt="${project.title} image ${index + 1}">
                </a>
            </div>`
		)
		.join("");

	const buttonsWork = `
        ${
					project.liveUrl
						? `<a class="btn btn-outline-info fw-bold mr-2 mb-2 work-btn" href="${project.liveUrl}" target="_blank" role="button">Live</a>`
						: ""
				}
        ${
					project.googlePlayUrl
						? `<a class="btn btn-outline-info fw-bold mr-2 mb-2 work-btn" href="${project.googlePlayUrl}" target="_blank" role="button">Google Play</a>`
						: ""
				}
        ${
					project.appleStoreUrl
						? `<a class="btn btn-outline-info fw-bold mr-2 mb-2 work-btn" href="${project.appleStoreUrl}" target="_blank" role="button">Apple Store</a>`
						: ""
				}
        ${
					project.sourceUrl
						? `<a class="btn btn-outline-info fw-bold mr-2 mb-2 work-btn" href="${project.sourceUrl}" target="_blank" role="button">Source code</a>`
						: ""
				}
    `;

	const myRole = project.role
		? `<span class="w-role">${project.role}</span>`
		: "";
	const truncatedDescription = truncateText(project.description || "", 32);

	return `
        <div class="work-box" id="project-${project.id}">
            <div id="carousel-${
							project.id
						}" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    ${carouselIndicators}
                </ol>
                <div class="carousel-inner">
                    ${carouselItems}
                </div>
                ${
									project.images.length > 1
										? `
                    <a class="carousel-control-prev" href="#carousel-${project.id}" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carousel-${project.id}" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                `
										: ""
								}
            </div>
            <div class="work-content">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="d-flex flex-wrap align-items-center justify-content-between">
                            <h2 class="w-title">${
															project.title || "Untitled Project"
														}</h2>
                            <div class="w-more">${myRole}</div>
                        </div>
                        <hr>
                        <div class="w-description-container">
                            <p class="w-description">
                                ${truncatedDescription}
                            </p>
                        </div>
                        <div class="w-more" id="buttons-work">
                            ${buttonsWork}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initializeLazyLoading() {
	const observerOptions = {
		root: null,
		rootMargin: "50px",
		threshold: 0.1,
	};

	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target;
				if (img.dataset.src) {
					img.src = img.dataset.src;
					img.onload = () => {
						img.classList.add("loaded");
					};
					observer.unobserve(img);
				}
			}
		});
	}, observerOptions);

	// Observe all lazy images
	document.querySelectorAll(".lazy-load").forEach((img) => {
		imageObserver.observe(img);
	});

	// Initialize carousels with auto-sliding
	$(".carousel").carousel({
		interval: 3000, // Change slides every 3 seconds
		pause: "hover", // Pause on mouse hover
	});
}

export function initializeDescriptionToggles() {
	document.querySelectorAll(".see-more-toggle").forEach((toggle) => {
		toggle.addEventListener("click", (e) => {
			e.preventDefault();
			const container = toggle.closest(".w-description-container");
			const truncatedText = container.querySelector(".truncated-text");
			const fullText = container.querySelector(".full-text");

			if (toggle.getAttribute("data-collapsed") === "true") {
				truncatedText.style.display = "none";
				fullText.style.display = "inline";
				toggle.textContent = "See less";
				toggle.setAttribute("data-collapsed", "false");
			} else {
				truncatedText.style.display = "inline";
				fullText.style.display = "none";
				toggle.textContent = "See more";
				toggle.setAttribute("data-collapsed", "true");
			}
		});
	});
}

export function highlightProject() {
	const urlParams = new URLSearchParams(window.location.search);
	const projectId = urlParams.get("project");
	if (projectId) {
		const projectElement = document.getElementById(`project-${projectId}`);
		if (projectElement) {
			setTimeout(() => {
				const navbarHeight = document.querySelector("nav").offsetHeight;
				const elementPosition = projectElement.getBoundingClientRect().top;
				const offsetPosition =
					elementPosition + window.pageYOffset - navbarHeight - 20;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});

				projectElement.style.boxShadow = "0 0 15px rgba(0,123,255,0.5)";
				setTimeout(() => {
					projectElement.style.boxShadow = "";
				}, 3000);
			}, 500);
		}
	}
}
