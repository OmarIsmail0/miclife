'use client';

import BranchesPage from "../../page-components/BranchesPage";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Our Branches Across Egypt | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Find Al Mohandes Life Insurance branches near you. We serve customers across Cairo, Alexandria, and major cities throughout Egypt.');
		}
	}, []);

	return (
		<>
			<BranchesPage />
		</>
	);
}


