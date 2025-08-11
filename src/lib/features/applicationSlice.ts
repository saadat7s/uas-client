import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Program {
    id: number
    title: string
    code: string
    duration: string
    entryRequirements: string
    fees: string
    description: string
    department: string
    universityId: number
    universityName: string
  }

  interface Document {
    id: string
    name: string
    type: string
    size: string
    uploadDate: string
    status: "uploaded" | "pending" | "verified"
    url?: string
  }
  
  interface Application {
    id: string
    selectedPrograms: Program[]
    documents: Document[]
    status: "draft" | "submitted" | "under-review" | "accepted" | "rejected"
    submittedAt?: string
    applicationFee: number
  }
  
  interface ApplicationState {
    currentApplication: Application | null
    personalDetails: {
      firstName: string
      lastName: string
      email: string
      phone: string
      dateOfBirth: string
      nationality: string
      cnic: string
      address: {
        line1: string
        line2: string
        city: string
        province: string
        postcode: string
      }
    } | null
    applicationStatus: Array<{
      id: string
      university: string
      program: string
      status: string
      statusType: "success" | "pending" | "info"
      lastUpdate: string
      deadline: string
      conditions: string[]
    }>
  }
  

  const initialState: ApplicationState = {
    currentApplication: null,
    personalDetails: null,
    applicationStatus: [],
  }

  const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
      startNewApplication: (state) => {
        const applicationId = `APP-${Date.now()}`
  
        const newApplication: Application = {
          id: applicationId,
          selectedPrograms: [],
          documents: [],
          status: "draft",
          applicationFee: 0,
        }
  
        state.currentApplication = newApplication
      },
  
      addCourseToApplication: (state, action: PayloadAction<Program>) => {
        if (!state.currentApplication) {
          const applicationId = `APP-${Date.now()}`
          state.currentApplication = {
            id: applicationId,
            selectedPrograms: [],
            documents: [],
            status: "draft",
            applicationFee: 0,
          }
        }
  
        const program = action.payload
        const programExists = state.currentApplication.selectedPrograms.some((c) => c.id === program.id)
  
        if (!programExists && state.currentApplication.selectedPrograms.length < 15) {
          state.currentApplication.selectedPrograms.push(program)
  
          // Recalculate application fee based on unique universities
          const uniqueUniversities = new Set(state.currentApplication.selectedPrograms.map((c) => c.universityId))
          state.currentApplication.applicationFee = uniqueUniversities.size * 5000
        }
      },
  
      removeCourseFromApplication: (state, action: PayloadAction<number>) => {
        if (state.currentApplication) {
            const programId = action.payload
          state.currentApplication.selectedPrograms = state.currentApplication.selectedPrograms.filter(
            (program) => program.id !== programId,
          )
  
          // Recalculate application fee
          const uniqueUniversities = new Set(state.currentApplication.selectedPrograms.map((c) => c.universityId))
          state.currentApplication.applicationFee = uniqueUniversities.size * 5000
        }
      },
  
      updatePersonalDetails: (state, action: PayloadAction<Partial<ApplicationState["personalDetails"]>>) => {
        if (state.personalDetails) {
          state.personalDetails = { ...state.personalDetails, ...action.payload }
        } else {
          state.personalDetails = action.payload as ApplicationState["personalDetails"]
        }
      },
  
      addDocument: (state, action: PayloadAction<Document>) => {
        if (state.currentApplication) {
          state.currentApplication.documents.push(action.payload)
        }
      },
  
      removeDocument: (state, action: PayloadAction<string>) => {
        if (state.currentApplication) {
          const documentId = action.payload
          state.currentApplication.documents = state.currentApplication.documents.filter((doc) => doc.id !== documentId)
        }
      },
  
      submitApplication: (state) => {
        if (state.currentApplication) {
          state.currentApplication.status = "submitted"
          state.currentApplication.submittedAt = new Date().toISOString()
        }
      },
  
      clearCurrentApplication: (state) => {
        state.currentApplication = null
      },
    },
  })
  
  export const {
    startNewApplication,
    addCourseToApplication,
    removeCourseFromApplication,
    updatePersonalDetails,
    addDocument,
    removeDocument,
    submitApplication,
    clearCurrentApplication,
  } = applicationSlice.actions
  
  export default applicationSlice.reducer
  