'use client';

import SocialResponsibilityPage from "../../page-components/SocialResponsibilityPage";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Social Responsibility & Community Programs | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Learn about Al Mohandes Life Insurance\'s commitment to social responsibility, community programs, and sustainable initiatives across Egypt.');
		}
	}, []);

	return (
		<>
			<SocialResponsibilityPage />
		</>
	);
}


