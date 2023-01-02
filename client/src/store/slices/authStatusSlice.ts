import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface authStatusState {
    status: string,
}

const initialState: authStatusState = {
    status: 'login'
}

export const authStatusSlice = createSlice({
    name: 'authStatus',
    initialState,
    reducers: {
        changeStatusOnLogin: (state, action) => {
            state.status = 'login'
        },
        
        changeStatusOnRegister: (state, action) => {
            state.status = 'registration'
        },
    }
})

export const { changeStatusOnLogin, changeStatusOnRegister } = authStatusSlice.actions;

export default authStatusSlice.reducer;