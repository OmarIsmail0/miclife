// Google Analytics and tracking utilities

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track conversions
export const trackConversion = (conversionId: string, conversionLabel: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
    });
  }
};

// Track quote requests
export const trackQuoteRequest = (insuranceType: string) => {
  event({
    action: 'quote_request',
    category: 'engagement',
    label: insuranceType,
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  event({
    action: 'form_submit',
    category: 'engagement',
    label: formName,
  });
};

// Track phone call clicks
export const trackPhoneClick = () => {
  event({
    action: 'phone_click',
    category: 'contact',
    label: '19318',
  });
};

// Track branch location views
export const trackBranchView = (branchName: string) => {
  event({
    action: 'branch_view',
    category: 'engagement',
    label: branchName,
  });
};

// Add gtag types to window
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

