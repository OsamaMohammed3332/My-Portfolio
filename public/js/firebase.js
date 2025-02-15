// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
	getFirestore,
	collection,
	getDocs,
	orderBy,
	query,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import {
	fetchProfileInfo,
	fetchAboutMe,
	fetchStats,
	fetchContactInfo,
} from "./profile.js";
import {
	createProjectElement,
	initializeLazyLoading,
	initializeDescriptionToggles,
	highlightProject,
} from "./portfolio.js";
import { initializeContactForm } from "./contact.js";

const firebaseConfig = {
	apiKey: "AIzaSyChc5kg1R4Ek9dGSbg03dim0Riet4sspak",
	authDomain: "my-portfolio-9f6fb.firebaseapp.com",
	projectId: "my-portfolio-9f6fb",
	storageBucket: "my-portfolio-9f6fb",
	messagingSenderId: "548863688123",
	appId: "1:548863688123:web:d4c790731452b6b5e3d89e",
	measurementId: "G-HMDE7QJCDQ",
};

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", async () => {
	try {
		// Initialize Firebase app first
		const app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);
		const db = getFirestore(app);

		// Load data sequentially
		await fetchProfileInfo(db);
		await fetchAboutMe(db);
		await fetchPortfolio(db);

		// Add delay for stats if there's a project parameter
		const urlParams = new URLSearchParams(window.location.search);
		const hasProjectParam = urlParams.has("project");

		if (hasProjectParam) {
			// Wait for project highlighting to complete
			setTimeout(() => fetchStats(db), 1000);
		} else {
			await fetchStats(db);
		}

		await fetchContactInfo(db);

		// Initialize contact form
		initializeContactForm();
	} catch (error) {
		console.error("Error initializing app:", error);
	}
});

async function fetchPortfolio(db) {
	try {
		const portfolioContainer = document.querySelector(
			"#work .row-work-content"
		);
		portfolioContainer.innerHTML = `
            <div class="col-12 loading-wrapper">
                <div class="modern-loader">
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                </div>
                <div class="loading-text">
                    Loading Projects<span>.</span><span>.</span><span>.</span>
                </div>
            </div>`;

		// Fetch all documents first
		const portfolioCollection = await getDocs(collection(db, "portfolio"));
		if (portfolioCollection.empty) {
			portfolioContainer.innerHTML =
				'<div class="col-12 text-center">No projects found</div>';
			return;
		}

		portfolioContainer.innerHTML = "";
		const projects = portfolioCollection.docs
			.map((doc) => {
				const data = doc.data();
				// Validate required fields
				if (!data.id || !data.title || !data.images || !data.images.length) {
					console.error("Invalid project data structure:", data);
					return null;
				}
				// Convert id to number to ensure proper sorting
				return {
					...data,
					numericId: parseInt(data.id, 10),
				};
			})
			.filter((project) => project !== null) // Remove invalid projects
			// Sort by numericId in descending order
			.sort((a, b) => b.numericId - a.numericId);

		if (!projects.length) {
			portfolioContainer.innerHTML =
				'<div class="col-12 text-center">No valid projects available</div>';
			return;
		}

		// Create all project elements at once
		const fragment = document.createDocumentFragment();
		projects.forEach((project, index) => {
			try {
				if (!project.images || !project.images.length) {
					throw new Error("Project missing required image data");
				}
				const projectElement = createProjectElement(project, index);
				fragment.appendChild(projectElement);
			} catch (error) {
				console.error("Error creating project element:", {
					error: error.message,
					projectId: project.id,
					projectTitle: project.title,
				});
			}
		});

		portfolioContainer.appendChild(fragment);

		// Initialize observers for lazy loading
		initializeLazyLoading();
		initializeDescriptionToggles();
		setTimeout(highlightProject, 100);
	} catch (error) {
		console.error("Error fetching portfolio info:", error);
		document.querySelector("#work .row-work-content").innerHTML =
			'<div class="col-12 text-center text-danger">Error loading projects</div>';
	}
}
