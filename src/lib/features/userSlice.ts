import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  isAuthenticated: boolean
  currentStep: number
  profile: {
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
    nationality: string
    phone: string
    address: {
      line1: string
      line2: string
      city: string
      province: string
      postcode: string
    }
  } | null
}

const initialState: UserState = {
  isAuthenticated: false,
  currentStep: 0,
  profile: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.profile = null
      state.currentStep = 0
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState["profile"]>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      } else {
        state.profile = action.payload as UserState["profile"]
      }
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    nextStep: (state) => {
      state.currentStep += 1
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1
      }
    },
  },
})

export const { login, logout, updateProfile, setCurrentStep, nextStep, previousStep } = userSlice.actions
export default userSlice.reducer
