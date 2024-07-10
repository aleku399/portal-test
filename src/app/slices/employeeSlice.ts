import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmployees } from '@/api';
import { EmployeeData } from 'types/vite-env';

interface Res {
  payload: EmployeeData[];
  status: boolean;
}

interface EmployeesState {
  data: Res;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  data: {
    payload: [],
    status: false,
  },
  loading: false,
  error: null,
};

export const fetchEmployeesThunk = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await fetchEmployees();
  return response;
});

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployeesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      });
  },
});

export default employeesSlice.reducer;
