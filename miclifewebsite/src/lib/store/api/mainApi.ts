import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mainApi = createApi({
  reducerPath: "mainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    headers: { "Content-Type": "application/json" },
  }),
  endpoints: (builder) => ({
    // ✅ 1st endpoint
    
    getAllProducts: builder.query({
      query: (body) => ({
        url: "ContentManage/product/getall",
        method: "POST",
        body,
      }),
    }),
    getAllContributors: builder.query({
      query: (body) => ({
        url: "ContentManage/shareholder/getall",
        method: "POST",
        body,
      }),
    }),
    getAllInvestors: builder.query({
      query: (body) => ({
        url: "ContentManage/innvestore/getall",
        method: "POST",
        body,
      }),
    }),
    getAllLineOfBusiness: builder.query({
      query: (body) => ({
        url: "ContentManage/lob/getall",
        method: "POST",
        body,
      }),
    }),
    
    getAllBoardDirectors: builder.query({
      query: (body) => ({
        url: "ContentManage/boardmember/getall",
        method: "POST",
        body,
      }),
    }),
    getSectionsBySlug: builder.query({
      query: (slug: string) => ({
        url: `ContentManage/section/slug/${slug}`,
        method: "GET",
      }),
    }),
    getLineOfBusinessBySlug: builder.query({
      query: (slug: string) => ({
        url: `ContentManage/lob/slug/${slug}`,
        method: "GET",
      }),
    }),
    getBoardDirectorById: builder.query({
      query: (id: string) => ({
        url: `ContentManage/boardmember/${id}`,
        method: "GET",
      }),
    }),
    getAllMediaAlbum: builder.query({
      query: () => ({
        url: `album/getall`,
        method: "GET",
      }),
    }),
    getAllFAQs: builder.query({
      query: (body) => ({
        url: `ContentManage/question/getall`,
        method: "POST",
        body
      }),
    }),
    createTicket: builder.query({
      query: (body) => ({
        url: `ticketmanagement/ticket/create`,
        method: "POST",
        body
      }),
    }),
    getAllBranches: builder.query({
      query: (body) => ({
        url: "ContentManage/branch/getall",
        method: "POST",
        body,
      }),
    }),
    // // ✅ 2nd endpoint (example)
    // getAllCategories: builder.query({
    //   query: () => "category/getall",
    // }),

    // // ✅ 3rd endpoint (example)
    // createProduct: builder.mutation({
    //   query: (body) => ({
    //     url: "product/create",
    //     method: "POST",
    //     body,
    //   }),
    // }),
  }),
});

// ✅ Export auto-generated hooks
export const {
  useGetAllProductsQuery,
  useGetAllLineOfBusinessQuery,
  useGetAllBoardDirectorsQuery,
  useGetSectionsBySlugQuery,
  useGetLineOfBusinessBySlugQuery,
  useGetBoardDirectorByIdQuery,
  useGetAllFAQsQuery,
  useCreateTicketQuery,
  useGetAllContributorsQuery,
  useGetAllInvestorsQuery,
  useGetAllBranchesQuery,
  useGetAllMediaAlbumQuery,
} = mainApi;
