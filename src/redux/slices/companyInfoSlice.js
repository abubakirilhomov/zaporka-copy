// redux/slices/companyInfoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCompanyInfo = createAsyncThunk(
  "companyInfo/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/company-info`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Ошибка при получении информации");
    }
  }
);

const companyInfoSlice = createSlice({
  name: "companyInfo",
  initialState: {
    info: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companyInfoSlice.reducer;
