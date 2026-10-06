'use client';

import ContactUs from "../../page-components/ContactUs";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Contact Us - Get in Touch | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Contact Al Mohandes Life Insurance for inquiries, quotes, or support. Call us at 19318 or visit our offices in Egypt. We\'re here to help!');
		}
	}, []);

	return (
		<>
			<ContactUs />
		</>
	);
}


