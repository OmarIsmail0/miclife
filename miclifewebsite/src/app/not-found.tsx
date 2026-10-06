'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
	useEffect(() => {
		// Update meta tags for 404 page
		document.title = "404 - Page Not Found | Al Mohandes Life Insurance";
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', 'The page you are looking for could not be found. Return to Al Mohandes Life Insurance homepage.');
		}

		// Set robots meta to noindex for 404 pages
		let robotsMeta = document.querySelector('meta[name="robots"]');
		if (!robotsMeta) {
			robotsMeta = document.createElement('meta');
			robotsMeta.setAttribute('name', 'robots');
			document.head.appendChild(robotsMeta);
		}
		robotsMeta.setAttribute('content', 'noindex, follow');
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
			<div className="text-center px-4 max-w-2xl mx-auto">
				{/* 404 Number */}
				<div className="mb-8">
					<h1 className="text-9xl md:text-[200px] font-bold text-blue-600 mb-4 animate-pulse">
						404
					</h1>
				</div>

				{/* Error Message */}
				<div className="mb-8">
					<h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
						الصفحة غير موجودة
					</h2>
					<p className="text-lg md:text-xl text-gray-600 mb-2">
						عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
					</p>
					<p className="text-base md:text-lg text-gray-500">
						Page Not Found - The page you're looking for doesn't exist or has been moved
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl"
					>
						<Home className="w-5 h-5" />
						العودة للرئيسية
					</Link>
					<Link
						href="/contact-us"
						className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold"
					>
						اتصل بنا
						<ArrowRight className="w-5 h-5 rotate-180" />
					</Link>
				</div>

				{/* Helpful Links */}
				<div className="mt-12 pt-8 border-t border-gray-200">
					<p className="text-gray-700 font-semibold mb-4">روابط مفيدة:</p>
					<div className="flex flex-wrap gap-4 justify-center">
						<Link href="/individual-insurance" className="text-blue-600 hover:text-blue-800 hover:underline">
							التأمين الفردي
						</Link>
						<Link href="/branches" className="text-blue-600 hover:text-blue-800 hover:underline">
							الفروع
						</Link>
						<Link href="/customer-service" className="text-blue-600 hover:text-blue-800 hover:underline">
							خدمة العملاء
						</Link>
						<Link href="/aboutus" className="text-blue-600 hover:text-blue-800 hover:underline">
							من نحن
						</Link>
					</div>
				</div>

				{/* Contact Info */}
				<div className="mt-8 p-6 bg-blue-50 rounded-lg">
					<p className="text-gray-700 mb-2">
						هل تحتاج إلى مساعدة؟ اتصل بخدمة العملاء
					</p>
					<a 
						href="tel:19318" 
						className="text-2xl font-bold text-blue-600 hover:text-blue-800"
					>
						19318
					</a>
				</div>
			</div>
		</div>
	);
}


