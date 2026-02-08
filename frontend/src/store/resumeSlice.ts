import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Resume, PersonalDetails } from '../types/resume';
import resumeService from '../services/resumeService';

interface ResumeState extends Resume {
  isLoading: boolean;
  isError: boolean;
  message: string;
  _id?: string; // Database ID
}

const initialState: ResumeState = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const saveResume = createAsyncThunk('resume/save', async (resumeData: Resume, thunkAPI) => {
  try {
    // If we have an ID, update; otherwise create
    // For simplicity in this phase, let's assume create for now or handle update logic in component
    // In a real app, we'd check state._id
    return await resumeService.createResume(resumeData);
  } catch (error: any) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updatePersonalDetails: (state, action: PayloadAction<Partial<PersonalDetails>>) => {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },
    // TODO: Add reducers for Experience, Education, Skills
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state._id = action.payload._id;
        // Update other fields if backend normalizes data
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { updatePersonalDetails } = resumeSlice.actions;
export default resumeSlice.reducer;
