// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
	getFirestore,
	collection,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyChc5kg1R4Ek9dGSbg03dim0Riet4sspak",
	authDomain: "my-portfolio-9f6fb.firebaseapp.com",
	projectId: "my-portfolio-9f6fb",
	storageBucket: "my-portfolio-9f6fb.appspot.com",
	messagingSenderId: "548863688123",
	appId: "1:548863688123:web:d4c790731452b6b5e3d89e",
	measurementId: "G-HMDE7QJCDQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Fetch and display profile info
async function fetchProfileInfo() {
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
    </div>
`;
			initializeTyped();
		} else {
			console.error("No profile info found");
		}
	} catch (error) {
		console.error("Error fetching profile info:", error);
	}
}

// Initialize Typed.js after inserting the content
function initializeTyped() {
	if ($(".text-slider").length == 1) {
		var typed_strings = $(".text-slider-items").text();

		var typed = new Typed(".text-slider", {
			strings: typed_strings.split(","),
			typeSpeed: 80,
			loop: true,
			backDelay: 1100,
			backSpeed: 30,
		});
	}
}

// Fetch and display about me info
async function fetchAboutMe() {
	try {
		const aboutDoc = await getDocs(collection(db, "aboutMe"));
		const aboutData = aboutDoc.docs[1].data();
		document.querySelector("#about .row .col-sm-12 .row-about-me").innerHTML = `
        <div class="col-sm-6 col-md-5">
                                <div class="about-img">
                                    <img
                                        src=${aboutData.imageUrl}
                                        class="img-fluid rounded b-shadow-a"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="col-sm-6 col-md-7">
                                <div class="about-info">
                                    <p>
                                        <span class="title-s">Name: </span>
                                        <span>${aboutData.name}</span>
                                    </p>
                                    <p  style = "word-wrap:break-word">
                                        <span class="title-s">Email: </span>
                                        <span>${aboutData.email}</span>
                                    </p>
                                    <p>
                                        <span class="title-s">Phone: </span>
                                        <span>${aboutData.phone}</span>
                                    </p>
                                </div>
                            </div>
        `;
		document.querySelector("#about-me-description").innerText =
			aboutData.description;

		// Skills
		const skills = aboutDoc.docs[0].data();
		skills.skills.forEach((skill) => {
			document.querySelector(".skill-mf").innerHTML += `
                <span>${skill}</span>
                            <div class="progress">
                                <div
                                    class="progress-bar"
                                    role="progressbar"
                                    style="width: 100%"
                                    aria-valuenow="85"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                `;
		});

		// skills.skills.forEach((skill) => {
		// 	document.querySelector(".skill-mf").innerHTML += `
		// 		<span>${skill.name}</span>
		// 					<div class="progress">
		// 						<div
		// 							class="progress-bar"
		// 							role="progressbar"
		// 							style="width: ${skill.level}%"
		// 							aria-valuenow="85"
		// 							aria-valuemin="0"
		// 							aria-valuemax="100"
		// 						></div>
		// 					</div>
		// 		`;
		// });
	} catch (error) {
		console.error("Error fetching about me info:", error);
	}
}

// Function to fetch and display stats
async function fetchStats() {
	try {
		const statsDoc = await getDocs(collection(db, "stats"));
		if (statsDoc.docs.length > 0) {
			const statsData = statsDoc.docs[0].data();
			// Update the HTML with the fetched data
			document.querySelector("#works-completed").innerText =
				statsData.worksCompleted;
			document.querySelector("#years-of-experience").innerText =
				statsData.yearsOfExperience;
		} else {
			console.error("No stats info found");
		}
	} catch (error) {
		console.error("Error fetching stats info:", error);
	}
}

// Fetch and display portfolio info
async function fetchPortfolio() {
	try {
		const portfolioCollection = await getDocs(collection(db, "portfolio"));
		let portfolioHtml = "";
		portfolioCollection.forEach((doc) => {
			const project = doc.data();
			portfolioHtml += `
<div class="col-md-4">
  <div class="work-box">
    <a href="${project.imageUrl}" data-lightbox="gallery-${project.title}" title="${project.title}">
      <div class="work-img">
        <img src="${project.imageUrl}" alt="${project.title}" class="img-fluid" />
      </div>
    </a>
    <div class="work-content">
      <div class="row">
        <div class="col-sm-8">
          <h2 class="w-title">${project.title}</h2>
          <div class="w-more">
            <a class="btn btn-outline-info fw-bold" href="${project.liveUrl}" target="_blank" role="button" style="font-weight: bold">Live</a>
            <a class="btn btn-outline-info fw-bold" href="${project.sourceUrl}" target="_blank" role="button" style="font-weight: bold">Source code</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
		});
		document.querySelector("#work .row-work-content").innerHTML = portfolioHtml;
	} catch (error) {
		console.error("Error fetching portfolio info:", error);
	}
}

// Fetch and display contact info
async function fetchContactInfo() {
	try {
		const contactDoc = await getDocs(collection(db, "contactInfo"));
		const contactData = contactDoc.docs[0].data();
		document.querySelector(".socials ul").innerHTML = `
<li><a href="${contactData.facebook}" target="_blank"><span class="ico-circle"><i class="ion-social-facebook"></i></span></a></li>
<li><a href="${contactData.linkedin}" target="_blank"><span class="ico-circle"><i class="ion-social-linkedin"></i></span></a></li>
<li><a href="mailto:${contactData.email}"><span class="ico-circle"><i class="ion-social-googleplus"></i></span></a></li>
<li><a href="${contactData.github}" target="_blank"><span class="ico-circle"><i class="ion-social-github"></i></span></a></li>`;
	} catch (error) {
		console.error("Error fetching contact info:", error);
	}
}

// Call fetch functions on page load
fetchProfileInfo();
fetchAboutMe();
fetchStats();
fetchPortfolio();
fetchContactInfo();
