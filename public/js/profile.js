import {
	collection,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { initializeTyped } from "./utils.js";

export async function fetchProfileInfo(db) {
	try {
		const profileDoc = await getDocs(collection(db, "profileInfo"));
		if (profileDoc.docs.length > 0) {
			const profileData = profileDoc.docs[0].data();
			const rolesText = profileData.roles.join(", ");
			document.querySelector("#home .intro-content").innerHTML = `
            <div class="table-cell">
                <div class="container">
                    <p class="display-6 color-d">Hello!</p>
                    <h1 class="intro-title mb-4">I am Osama</h1>
                    <p class="intro-subtitle">
                        <span class="text-slider-items">${rolesText}</span>
                        <strong class="text-slider"></strong>
                    </p>
                    <div class="mt-4">
                        <a href="#" id="cv-button" class="btn btn-primary btn-lg py-3 px-5" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-file-pdf me-2"></i>View Resume
                        </a>
                    </div>
                </div>
            </div>`;
			initializeTyped();
		}
	} catch (error) {
		console.error("Error fetching profile info:", error);
	}
}

export async function fetchAboutMe(db) {
	try {
		const aboutMeContainer = document.querySelector("#about .box-shadow-full");
		const rowAboutMe = document.querySelector("#about .row-about-me");
		const skillsTitle = document.querySelector(".skills-title");
		const aboutTitle = document.querySelector(".about-me .title-box-2");
		const skillsContainer = document.querySelector(".skill-mf");
		const aboutDescription = document.querySelector("#about-me-description");

		// Show loading state
		aboutMeContainer.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <div class="loading-wrapper">
                        <div class="modern-loader">
                            <div></div><div></div><div></div>
                            <div></div><div></div><div></div>
                            <div></div><div></div><div></div>
                        </div>
                        <div class="loading-text">
                            Loading About<span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                </div>
            </div>`;

		// Fetch data
		const aboutDoc = await getDocs(collection(db, "aboutMe"));
		const aboutData = aboutDoc.docs[1].data();
		const skills = aboutDoc.docs[0].data();

		// Update content
		aboutMeContainer.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="row row-about-me">
                        <div class="col-sm-6 col-md-5">
                            <div class="about-img">
                                <img src="${
																	aboutData.imageUrl
																}" class="img-fluid rounded b-shadow-a" alt=""/>
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-7">
                            <div class="about-info">
                                <p><span class="title-s">Name: </span><span>${
																	aboutData.name
																}</span></p>
                                <p><span class="title-s">Phone: </span><span>${
																	aboutData.phone
																}</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="title-box-2 skills-title">
                        <h5 class="title-left">Skills</h5>
                    </div>
                    <div class="skill-mf">
                        ${skills.skills
													.map(
														(skill) => `
                            <span>${skill}</span>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: 100%" 
                                     aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>`
													)
													.join("")}
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="about-me pt-4 pt-md-0">
                        <div class="title-box-2">
                            <h5 class="title-left">About me</h5>
                        </div>
                        <p class="lead">${aboutData.description}</p>
                    </div>
                </div>
            </div>`;
	} catch (error) {
		console.error("Error fetching about me info:", error);
		if (aboutMeContainer) {
			aboutMeContainer.innerHTML = `
                <div class="row">
                    <div class="col-12 text-center text-danger">
                        Error loading about section
                    </div>
                </div>`;
		}
	}
}

export async function fetchStats(db) {
	try {
		const statsDoc = await getDocs(collection(db, "stats"));
		const statsData = statsDoc.docs[0]?.data();

		if (!statsData) {
			console.error("No stats data found");
			return;
		}

		// Update DOM with initial values
		const worksElement = document.getElementById("works-completed");
		const yearsElement = document.getElementById("years-of-experience");

		if (worksElement) worksElement.textContent = "0";
		if (yearsElement) yearsElement.textContent = "0";

		// Function to animate counter more reliably
		function animateValue(element, end, duration = 2000) {
			if (!element) return;

			const start = 0;
			const startTimestamp = performance.now();
			const step = (timestamp) => {
				const progress = Math.min((timestamp - startTimestamp) / duration, 1);
				const current = Math.floor(progress * (end - start) + start);
				element.textContent = current;

				if (progress < 1) {
					window.requestAnimationFrame(step);
				} else {
					element.textContent = end; // Ensure final value is exact
				}
			};

			window.requestAnimationFrame(step);
		}

		// Function to start counter animation when element is in viewport
		function startCounterWhenVisible(element, value) {
			if (!element) return;

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							animateValue(element, value);
							observer.disconnect(); // Only animate once
						}
					});
				},
				{
					threshold: 0.1,
				}
			);

			observer.observe(element);
		}

		// Initialize counters
		if (statsData.worksCompleted) {
			startCounterWhenVisible(worksElement, parseInt(statsData.worksCompleted));
		}
		if (statsData.yearsOfExperience) {
			startCounterWhenVisible(
				yearsElement,
				parseInt(statsData.yearsOfExperience)
			);
		}
	} catch (error) {
		console.error("Error fetching stats:", error);
		// Set fallback values
		const elements = ["#works-completed", "#years-of-experience"];
		elements.forEach((id) => {
			const element = document.querySelector(id);
			if (element) element.textContent = "0";
		});
	}
}

export async function fetchContactInfo(db) {
	try {
		const contactDoc = await getDocs(collection(db, "contactInfo"));
		const contactData = contactDoc.docs[0].data();

		// Update social links
		document.querySelector(".socials ul").innerHTML = `
			<li><a href="${contactData.linkedin}" target="_blank"><span class="ico-circle"><i class="fab fa-linkedin"></i></span></a></li>
			<li><a href="${contactData.upwork}" target="_blank"><span class="ico-circle"><i class="fab fa-square-upwork"></i></span></a></li>
			<li><a href="${contactData.github}" target="_blank"><span class="ico-circle"><i class="fab fa-github"></i></span></a></li>
			<li><a href="${contactData.facebook}" target="_blank"><span class="ico-circle"><i class="fab fa-facebook-f"></i></span></a></li>`;

		// Update CV button
		const cvButton = document.getElementById("cv-button");
		if (cvButton && contactData.cvUrl) {
			cvButton.href = contactData.cvUrl;
		} else if (cvButton) {
			cvButton.style.display = "none"; // Hide button if no CV URL
		}
	} catch (error) {
		console.error("Error fetching contact info:", error);
		// Hide CV button on error
		const cvButton = document.getElementById("cv-button");
		if (cvButton) cvButton.style.display = "none";
	}
}
