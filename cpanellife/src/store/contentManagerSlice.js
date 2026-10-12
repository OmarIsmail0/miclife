import { createSlice } from "@reduxjs/toolkit";

const contentManagerSlice = createSlice({
  name: "contentManager",
  initialState: {
    activeTab: "sections",
    // Track data state for each tab to prevent unnecessary re-fetches
    tabData: {
      lob: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      products: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      sections: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      questions: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      investor: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      blocks: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      boardMembers: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      shareholders: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
      branches: {
        data: [],
        lastFetchTime: null,
        needsRefresh: false,
      },
    },
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setLobData: (state, action) => {
      state.tabData.lob.data = action.payload;
      state.tabData.lob.lastFetchTime = Date.now();
      state.tabData.lob.needsRefresh = false;
    },
    setProductData: (state, action) => {
      state.tabData.products.data = action.payload;
      state.tabData.products.lastFetchTime = Date.now();
      state.tabData.products.needsRefresh = false;
    },
    setSectionData: (state, action) => {
      state.tabData.sections.data = action.payload;
      state.tabData.sections.lastFetchTime = Date.now();
      state.tabData.sections.needsRefresh = false;
    },
    setQuestionData: (state, action) => {
      state.tabData.questions.data = action.payload;
      state.tabData.questions.lastFetchTime = Date.now();
      state.tabData.questions.needsRefresh = false;
    },
    setInvestorData: (state, action) => {
      state.tabData.investor.data = action.payload;
      state.tabData.investor.lastFetchTime = Date.now();
      state.tabData.investor.needsRefresh = false;
    },
    setBlockData: (state, action) => {
      state.tabData.blocks.data = action.payload;
      state.tabData.blocks.lastFetchTime = Date.now();
      state.tabData.blocks.needsRefresh = false;
    },
    setBoardMembersData: (state, action) => {
      state.tabData.boardMembers.data = action.payload;
      state.tabData.boardMembers.lastFetchTime = Date.now();
      state.tabData.boardMembers.needsRefresh = false;
    },
    setShareholdersData: (state, action) => {
      state.tabData.shareholders.data = action.payload;
      state.tabData.shareholders.lastFetchTime = Date.now();
      state.tabData.shareholders.needsRefresh = false;
    },
    setBranchesData: (state, action) => {
      state.tabData.branches.data = action.payload;
      state.tabData.branches.lastFetchTime = Date.now();
      state.tabData.branches.needsRefresh = false;
    },
    markTabForRefresh: (state, action) => {
      const tabKey = action.payload;
      if (state.tabData[tabKey]) {
        state.tabData[tabKey].needsRefresh = true;
      }
    },
    clearTabData: (state, action) => {
      const tabKey = action.payload;
      if (state.tabData[tabKey]) {
        // Reset to default structure (no pagination for any tab)
        const defaultStructure = {
          data: [],
          lastFetchTime: null,
          needsRefresh: false,
        };
        state.tabData[tabKey] = defaultStructure;
      }
    },
  },
});

export const {
  setActiveTab,
  setLobData,
  setProductData,
  setSectionData,
  setQuestionData,
  setInvestorData,
  setBlockData,
  setBoardMembersData,
  setShareholdersData,
  setBranchesData,
  markTabForRefresh,
  clearTabData,
} = contentManagerSlice.actions;

export default contentManagerSlice.reducer;
