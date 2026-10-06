// Server-side data fetching utilities for SSG
// These functions replace RTK Query hooks for static generation

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

// Fetch options to handle SSL certificate issues in development
const getFetchOptions = (method: string, body?: any): RequestInit => {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    
    next: { revalidate: 0 }  // Enable static caching for SSG
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }

  // For Node.js environments, handle self-signed certificates
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // @ts-ignore - This is needed for self-signed certificates in development
    if (typeof require !== 'undefined') {
      try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      } catch (e) {
        // Ignore if not available
      }
    }
  }

  return options;
};

export async function getAllProducts(body: any = { IsActive: true, PageNumber: 1, PageSize: 100 }) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/product/getall`,
      getFetchOptions('POST', body)
    );
    
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [] }; // Return empty data instead of null
  }
}

export async function getAllLineOfBusiness(body: any = { IsActive: true, PageNumber: 1, PageSize: 100 }) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/lob/getall`,
      getFetchOptions('POST', body)
    );
    
    if (!response.ok) throw new Error('Failed to fetch line of business');
    return await response.json();
  } catch (error) {
    console.error('Error fetching line of business:', error);
    return { data: [] };
  }
}

export async function getAllBoardDirectors(body: any = { IsActive: true, PageNumber: 1, PageSize: 100 }) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/boardmember/getall`,
      getFetchOptions('POST', body)
    );
    
    if (!response.ok) throw new Error('Failed to fetch board directors');
    return await response.json();
  } catch (error) {
    console.error('Error fetching board directors:', error);
    return { data: [] };
  }
}

export async function getBoardDirectorById(id: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/boardmember/${id}`,
      getFetchOptions('GET')
    );
    
    if (!response.ok) throw new Error('Failed to fetch board director');
    return await response.json();
  } catch (error) {
    console.error('Error fetching board director:', error);
    return null;
  }
}

export async function getSectionsBySlug(slug: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/section/slug/${slug}`,
      getFetchOptions('GET')
    );
    
    if (!response.ok) throw new Error(`Failed to fetch sections for ${slug}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching sections for ${slug}:`, error);
    return { blocks: [] };
  }
}

export async function getLineOfBusinessBySlug(slug: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/lob/slug/${slug}`,
      getFetchOptions('GET')
    );
    
    if (!response.ok) throw new Error(`Failed to fetch LOB for ${slug}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching LOB for ${slug}:`, error);
    return null;
  }
}

export async function getAllBranches(body: any = { IsActive: true, PageNumber: 1, PageSize: 100 }) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/branch/getall`,
      getFetchOptions('POST', body)
    );
    
    if (!response.ok) throw new Error('Failed to fetch branches');
    return await response.json();
  } catch (error) {
    console.error('Error fetching branches:', error);
    return { data: [] };
  }
}

export async function getAllFAQs(body: any = { IsActive: true, PageNumber: 1, PageSize: 100 }) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/question/getall`,
      getFetchOptions('POST', body)
    );
    
    if (!response.ok) throw new Error('Failed to fetch FAQs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return { data: [] };
  }
}

export async function getAllContributors(body: any = { IsActive: true, PageNumber: 1, PageSize: 100 }) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/shareholder/getall`,
      getFetchOptions('POST', body)
    );
    
    if (!response.ok) throw new Error('Failed to fetch contributors');
    return await response.json();
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return { data: [] };
  }
}

export async function getAllInvestors(body: any = { IsActive: true, PageNumber: 1, PageSize: 100 }) {
  try {
    const response = await fetch(
      `${BASE_URL}/ContentManage/innvestore/getall`,
      getFetchOptions('POST', body)
    );
    
    if (!response.ok) throw new Error('Failed to fetch investors');
    return await response.json();
  } catch (error) {
    console.error('Error fetching investors:', error);
    return { data: [] };
  }
}

export async function getAllMediaAlbum() {
  try {
    const response = await fetch(
      `${BASE_URL}/album/getall`,
      getFetchOptions('GET')
    );
    
    if (!response.ok) throw new Error('Failed to fetch media albums');
    return await response.json();
  } catch (error) {
    console.error('Error fetching media albums:', error);
    return { data: [] };
  }
}

