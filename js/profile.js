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
		const aboutDoc = await getDocs(collection(db, "aboutMe"));
		const aboutData = aboutDoc.docs[1].data();

		// Update About Me section
		document.querySelector("#about .row-about-me").innerHTML = `
            <div class="col-sm-6 col-md-5">
                <div class="about-img">
                    <img src="${aboutData.imageUrl}" class="img-fluid rounded b-shadow-a" alt=""/>
                </div>
            </div>
            <div class="col-sm-6 col-md-7">
                <div class="about-info">
                    <p><span class="title-s">Name: </span><span>${aboutData.name}</span></p>
                    <p style="word-wrap: break-word;"><span class="title-s">Email: </span><span>${aboutData.email}</span></p>
                    <p><span class="title-s">Phone: </span><span>${aboutData.phone}</span></p>
                </div>
            </div>`;

		document.querySelector("#about-me-description").innerText =
			aboutData.description;

		// Skills
		const skills = aboutDoc.docs[0].data();
		const skillsContainer = document.querySelector(".skill-mf");
		skillsContainer.innerHTML = ""; // Clear existing content

		skills.skills.forEach((skill) => {
			skillsContainer.innerHTML += `
                <span>${skill}</span>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 100%" 
                         aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                    </div>
                </div>`;
		});
	} catch (error) {
		console.error("Error fetching about me info:", error);
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

		// Function to animate counter with better handling
		function animateCounter(element, target) {
			if (!element) return;

			// Clear any existing animation
			if (element._countAnimation) {
				clearInterval(element._countAnimation);
			}

			let current = 0;
			const duration = 2000; // 2 seconds total
			const steps = 50;
			const increment = Math.ceil(target / steps);
			const interval = duration / steps;

			element._countAnimation = setInterval(() => {
				current = Math.min(current + increment, target);
				element.textContent = current;

				if (current >= target) {
					clearInterval(element._countAnimation);
					element._countAnimation = null;
				}
			}, interval);
		}

		// Ensure elements exist before animating
		const worksElement = document.querySelector("#works-completed");
		const yearsElement = document.querySelector("#years-of-experience");

		if (statsData.worksCompleted && worksElement) {
			animateCounter(worksElement, parseInt(statsData.worksCompleted));
		}
		if (statsData.yearsOfExperience && yearsElement) {
			animateCounter(yearsElement, parseInt(statsData.yearsOfExperience));
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
		document.querySelector(".socials ul").innerHTML = `
            <li><a href="${contactData.linkedin}" target="_blank"><span class="ico-circle"><i class="fab fa-linkedin"></i></span></a></li>
            <li><a href="${contactData.upwork}" target="_blank"><span class="ico-circle"><i class="fab fa-square-upwork"></i></span></a></li>
            <li><a href="mailto:${contactData.email}"><span class="ico-circle"><i class="fab fa-google-plus-g"></i></span></a></li>
            <li><a href="${contactData.github}" target="_blank"><span class="ico-circle"><i class="fab fa-github"></i></span></a></li>
            <li><a href="${contactData.facebook}" target="_blank"><span class="ico-circle"><i class="fab fa-facebook-f"></i></span></a></li>`;
	} catch (error) {
		console.error("Error fetching contact info:", error);
	}
}
