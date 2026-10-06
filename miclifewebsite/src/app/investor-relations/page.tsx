'use client';

import InvestorRelationsPage from "../../page-components/InvestorRelationsPage";
import { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		// Update meta tags dynamically
		document.title = "Investor Relations | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'Access financial reports, annual statements, and investor information for Al Mohandes Life Insurance. Stay informed about our company performance.');
		}
	}, []);

	return (
		<>
			<InvestorRelationsPage />
		</>
	);
}


