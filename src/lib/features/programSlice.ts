import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Program {
  id: number
  title: string
  university: string
  location: string
  duration: string
  entryRequirements: string
  fees: string
  rating: number
  students: number
  description: string
}

interface ProgramsState {
  programs: Program[]
  filteredPrograms: Program[]
  searchQuery: string
  selectedSubject: string
  selectedLocation: string
}

const initialState: ProgramsState = {
  programs: [],
  filteredPrograms: [],
  searchQuery: "",
  selectedSubject: "",
  selectedLocation: "",
}

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredPrograms = state.programs.filter(
        (program) =>
          program.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          program.university.toLowerCase().includes(action.payload.toLowerCase()),
      )
    },
    setSelectedSubject: (state, action: PayloadAction<string>) => {
      state.selectedSubject = action.payload
    },
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload
    },
  },
})

export const { setSearchQuery, setSelectedSubject, setSelectedLocation } = programSlice.actions
export default programSlice.reducer
