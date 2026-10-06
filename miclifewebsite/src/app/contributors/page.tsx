'use client';

import ContributorsPage from "../../page-components/ContributorsPage";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Our Contributors & Partners | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Learn about our valued contributors and partners who help Al Mohandes Life Insurance serve customers across Egypt with excellence.');
		}
	}, []);

	return (
		<>
			<ContributorsPage />
		</>
	);
}


