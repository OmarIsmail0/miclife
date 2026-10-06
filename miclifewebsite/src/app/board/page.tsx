'use client';

import BoardDirectorsPage from "../../page-components/BoardDirectorsPage";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Board of Directors | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Meet the experienced board of directors leading Al Mohandes Life Insurance towards excellence in providing life insurance services across Egypt.');
		}
	}, []);

	return (
		<>
			<BoardDirectorsPage />
		</>
	);
}


