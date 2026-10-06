'use client';

import ChairmanMessage from "../../page-components/ChairmanMessage";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Chairman's Message | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Read the message from our Chairman about Al Mohandes Life Insurance\'s commitment to excellence and customer satisfaction in Egypt\'s insurance sector.');
		}
	}, []);

	return (
		<>
			<ChairmanMessage />
		</>
	);
}


