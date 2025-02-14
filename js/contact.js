export function initializeContactForm() {
	const form = document.querySelector(".contactForm");
	const submitButton = form.querySelector('button[type="submit"]');
	const originalButtonText = submitButton.innerHTML;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Reset any previous error states
		clearErrors();

		// Validate form
		const isValid = validateForm();
		if (!isValid) return;

		// Show loading state
		setLoadingState(true);

		try {
			// Simulate API call (replace with your actual API call)
			await sendMessage(getFormData());

			// Show success message
			showMessage("success", "Message sent successfully!");
			form.reset();
		} catch (error) {
			showMessage("error", "Failed to send message. Please try again.");
		} finally {
			setLoadingState(false);
		}
	});

	// Real-time validation
	form.querySelectorAll(".form-control").forEach((input) => {
		input.addEventListener("input", () => {
			validateField(input);
		});

		input.addEventListener("blur", () => {
			validateField(input);
		});
	});

	function validateForm() {
		const fields = {
			name: { min: 3, message: "Name must be at least 3 characters" },
			email: {
				pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				message: "Please enter a valid email",
			},
			subject: { min: 4, message: "Subject must be at least 4 characters" },
			message: { min: 5, message: "Message must be at least 5 characters" },
		};

		let isValid = true;

		Object.entries(fields).forEach(([fieldName, rules]) => {
			const input = form.querySelector(`[name="${fieldName}"]`);
			if (!validateField(input, rules)) {
				isValid = false;
			}
		});

		return isValid;
	}

	function validateField(input, rules) {
		const value = input.value.trim();
		const fieldName = input.name;
		let isValid = true;
		let errorMessage = "";

		if (!value) {
			isValid = false;
			errorMessage = `${
				fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
			} is required`;
		} else if (rules) {
			if (rules.min && value.length < rules.min) {
				isValid = false;
				errorMessage = rules.message;
			}
			if (rules.pattern && !rules.pattern.test(value)) {
				isValid = false;
				errorMessage = rules.message;
			}
		}

		toggleFieldError(input, errorMessage, isValid);
		return isValid;
	}

	function toggleFieldError(input, message, isValid) {
		const formGroup = input.closest(".form-group");
		const errorElement =
			formGroup.querySelector(".validation-message") ||
			createErrorElement(formGroup);

		if (!isValid) {
			input.classList.add("is-invalid");
			errorElement.textContent = message;
			errorElement.style.display = "block";
		} else {
			input.classList.remove("is-invalid");
			input.classList.add("is-valid");
			errorElement.style.display = "none";
		}
	}

	function createErrorElement(formGroup) {
		const errorDiv = document.createElement("div");
		errorDiv.className = "validation-message";
		formGroup.appendChild(errorDiv);
		return errorDiv;
	}

	function clearErrors() {
		form.querySelectorAll(".validation-message").forEach((el) => {
			el.style.display = "none";
		});
		form.querySelectorAll(".form-control").forEach((input) => {
			input.classList.remove("is-invalid", "is-valid");
		});
	}

	function setLoadingState(isLoading) {
		if (isLoading) {
			submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
            `;
			submitButton.disabled = true;
		} else {
			submitButton.innerHTML = originalButtonText;
			submitButton.disabled = false;
		}
	}

	function showMessage(type, message) {
		// Clear any existing messages first
		const successMsg = document.getElementById("sendmessage");
		const errorMsg = document.getElementById("errormessage");

		if (successMsg) successMsg.classList.remove("show");
		if (errorMsg) errorMsg.classList.remove("show");

		// Show new message
		const messageElement = document.getElementById(
			type === "success" ? "sendmessage" : "errormessage"
		);
		if (messageElement) {
			messageElement.textContent = message;
			messageElement.classList.add("show");
			// Auto-hide after 5 seconds
			setTimeout(() => messageElement.classList.remove("show"), 5000);
		} else {
			console.warn(`Message element of type ${type} not found`);
		}
	}

	function getFormData() {
		return {
			name: form.querySelector('[name="name"]').value,
			email: form.querySelector('[name="email"]').value,
			subject: form.querySelector('[name="subject"]').value,
			message: form.querySelector('[name="message"]').value,
		};
	}

	async function sendMessage(data) {
		// Replace this with your actual API call
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ success: true });
			}, 2000);
		});
	}
}
