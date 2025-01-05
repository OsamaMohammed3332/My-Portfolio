export function truncateText(text, wordLimit) {
	const words = text.split(" ");
	if (words.length <= wordLimit) {
		return text;
	}
	const truncated = words.slice(0, wordLimit).join(" ");
	return `<span class="truncated-text">${truncated}...</span>
            <span class="full-text" style="display:none;">${text}</span>
            <a href="#" class="see-more-toggle" style="color: #17a2b8;" data-collapsed="true">See more</a>`;
}

export function initializeTyped() {
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
