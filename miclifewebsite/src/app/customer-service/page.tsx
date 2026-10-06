'use client';

import CustomerServicePage from "@/src/page-components/CustomerServicePage";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Customer Service & Support | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Get excellent customer service from Al Mohandes Life Insurance. Call 19318 for insurance inquiries, claims, policy updates, and support services.');
		}
	}, []);

	return (
		<>
			<CustomerServicePage />
		</>
	);
}


