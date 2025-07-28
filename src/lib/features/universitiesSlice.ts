import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface University {
  id: number
  name: string
  location: string
  description: string
  ranking: number
  establishedYear: number
  studentCount: number
  image: string
  programs: Program[]
}

interface Program {
  id: number
  title: string
  code: string
  duration: string
  entryRequirements: string
  fees: string
  description: string
  department: string
}

interface UniversitiesState {
  universities: University[]
  selectedUniversity: University | null
  searchQuery: string
  filteredUniversities: University[]
}


const initialState: UniversitiesState = {
  universities: [],
  selectedUniversity: null,
  searchQuery: "",
  filteredUniversities: [],
}

const universitiesSlice = createSlice({
    name: "universities",
    initialState,
    reducers: {
      setSelectedUniversity: (state, action: PayloadAction<University>) => {
        state.selectedUniversity = action.payload
      },
      clearSelectedUniversity: (state) => {
        state.selectedUniversity = null
      },
      setSearchQuery: (state, action: PayloadAction<string>) => {
        state.searchQuery = action.payload
        state.filteredUniversities = state.universities.filter(
          (university) =>
            university.name.toLowerCase().includes(action.payload.toLowerCase()) ||
            university.location.toLowerCase().includes(action.payload.toLowerCase()),
        )
      },
    },
  })
  
  export const { setSelectedUniversity, clearSelectedUniversity, setSearchQuery } = universitiesSlice.actions
  export default universitiesSlice.reducer