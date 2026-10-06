"use client";

import { useGetAllFAQsQuery } from "@/src/lib/store/api/mainApi";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sanitizeHtml } from "@/src/lib/sanitize";

// const faqs1 = [
//   {
//     questionEnglish: "What is property insurance and what does it cover?",
//     questionArabic: "ما هو التأمين على الممتلكات وماذا يغطي؟",
//     answerEnglish: (
//       <>
//         Property insurance is a contract between you and the insurance company to protect you from financial losses
//         resulting from damage or loss of your property (such as home, office, warehouse, equipment). Coverage typically
//         includes:
//         <ul className="list-disc list-inside mt-2 space-y-1">
//           <li>Fire and explosions</li>
//           <li>Burglary and theft</li>
//           <li>Natural disasters (depending on the policy)</li>
//           <li>Water damage or pipe bursts</li>
//           <li>Riots or civil disturbances (in some policies)</li>
//         </ul>
//       </>
//     ),
//     answerArabic: (
//       <>
//         التأمين على الممتلكات هو عقد بينك وبين شركة التأمين لحمايتك من الخسائر المالية الناتجة عن تلف أو فقدان ممتلكاتك
//         (زي المنزل، المكتب، المخزن، المعدات). التغطية بتشمل غالبًا:
//         <ul className="list-disc list-inside mt-2 space-y-1" dir="rtl">
//           <li>الحريق والانفجارات</li>
//           <li>السطو والسرقة</li>
//           <li>الكوارث الطبيعية (حسب البوليصة)</li>
//           <li>الأضرار الناتجة عن المياه أو انفجار أنابيب</li>
//           <li>الشغب أو الاضطرابات المدنية (في بعض الوثائق)</li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     questionEnglish: "Does insurance cover all types of risks?",
//     questionArabic: "هل التأمين يغطي كل أنواع المخاطر؟",
//     answerEnglish: (
//       <>
//         No, every insurance policy has exclusions. For example:
//         <ul className="list-disc list-inside mt-2 space-y-1">
//           <li>Wars and terrorist operations are usually not covered except with a special policy</li>
//           <li>Intentional negligence or damage due to misuse</li>
//           <li>Natural wear and tear or mechanical failures</li>
//         </ul>
//         That&apos;s why you need to read the policy carefully.
//       </>
//     ),
//     answerArabic: (
//       <>
//         لا، كل بوليصة تأمين لها استثناءات. مثلاً:
//         <ul className="list-disc list-inside mt-2 space-y-1" dir="rtl">
//           <li>الحروب والعمليات الإرهابية غالبًا لا تكون مشمولة إلا ببوليصة خاصة.</li>
//           <li>الإهمال المتعمد أو التلف بسبب سوء الاستخدام</li>
//           <li>التآكل الطبيعي أو الأعطال الميكانيكية</li>
//         </ul>
//         عشان كده لازم تقرأ البوليصة بعناية.
//       </>
//     ),
//   },
//   {
//     questionEnglish: "How is the compensation value determined when a loss occurs?",
//     questionArabic: "كيف يتم تحديد قيمة التعويض عند حدوث خسارة؟",
//     answerEnglish: (
//       <>
//         There are two common methods:
//         <ul className="list-disc list-inside mt-2 space-y-1">
//           <li>Replacement Cost: Compensates you for the cost of purchasing the same or equivalent property new.</li>
//           <li>Actual Cash Value: Compensates you after deducting depreciation from the property&apos;s value.</li>
//         </ul>
//         The company determines this based on the type of policy you have subscribed to.
//       </>
//     ),
//     answerArabic: (
//       <>
//         فيه طريقتين شائعتين:
//         <ul className="list-disc list-inside mt-2 space-y-1" dir="rtl">
//           <li>قيمة الاستبدال (Replacement Cost): تعويضك بتكلفة شراء نفس الممتلكات أو ما يعادلها جديدة.</li>
//           <li>القيمة السوقية (Actual Cash Value): تعويضك بعد خصم نسبة الإهلاك (التقادم) من سعر الممتلك.</li>
//         </ul>
//         الشركة بتحدد ده بناءً على نوع البوليصة اللي اشتركت فيها.
//       </>
//     ),
//   },
//   {
//     questionEnglish: "Do I need to insure all properties or can I insure parts only?",
//     questionArabic: "هل لازم أأمن على الممتلكات كلها ولا ممكن أجزاء بس؟",
//     answerEnglish:
//       "You can insure all properties or choose to insure specific elements such as electronic devices, furniture, or inventory only. However, partial property insurance may reduce the compensation value in case of a major loss.",
//     answerArabic:
//       "تقدر تأمن على الممتلكات بالكامل أو تختار تأمن على عناصر معينة زي الأجهزة الإلكترونية أو الأثاث أو المخزون فقط. بس تأمين الممتلكات بشكل جزئي ممكن يقلل من قيمة التعويض لو حصلت خسارة كبيرة.",
//   },
//   {
//     questionEnglish: "What documents are required to purchase a property insurance policy?",
//     questionArabic: "ما هي المستندات المطلوبة لشراء بوليصة تأمين على الممتلكات؟",
//     answerEnglish: (
//       <ul className="list-disc list-inside space-y-1">
//         <li>ID card or commercial register copy (for companies)</li>
//         <li>Ownership or rental contract</li>
//         <li>Inventory list</li>
//         <li>Approximate value estimate of properties</li>
//         <li>Photos of the location (for archiving)</li>
//         <li>Completion of the insurance application form from the company</li>
//       </ul>
//     ),
//     answerArabic: (
//       <ul className="list-disc list-inside space-y-1" dir="rtl">
//         <li>صورة البطاقة أو السجل التجاري (لو شركة)</li>
//         <li>عقد الملكية أو الإيجار</li>
//         <li>كشف بالممتلكات (Inventory List)</li>
//         <li>تقدير تقريبي لقيمة الممتلكات</li>
//         <li>صور للمكان أحيانًا (للأرشفة)</li>
//         <li>استيفاء نموذج طلب التأمين من شركة</li>
//       </ul>
//     ),
//   },
// ];

export default function FAQSection() {
  const { data: faqs } = useGetAllFAQsQuery({});
  const { language } = useSelector((state: any) => state.language);
  const { t } = useTranslation();
  
  // Generate FAQ structured data for SEO
  const faqStructuredData = faqs?.data?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.data.map((faq: any) => ({
      "@type": "Question",
      "name": faq.questionText,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() // Strip HTML tags for structured data
      }
    }))
  } : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Structured Data for SEO */}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{t("faq")}</h2>

      {/* FAQ List */}
      <div className="space-y-2">
        {faqs && faqs?.data?.map((faq: any, index: number) => (
          <Disclosure key={index}>
            {({ open }) => (
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                <DisclosureButton className="flex justify-between w-full text-left text-lg font-medium text-gray-900">
                  {language == "en" ? faq.questionText : faq.questionText}
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </DisclosureButton>
                <DisclosurePanel className="text-justify mt-4 text-gray-600">
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer, { allowLinks: true }) }} />
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}
