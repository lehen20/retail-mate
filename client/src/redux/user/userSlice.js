import { createSlice } from '@reduxjs/toolkit';

const initialState ={
    currentUser: null,
    loading: false,
    error: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState, 
    reducers: {
        signInStart: (state)=> {
            state.loading= true;
            state.error= false;
        }, 
        signInSuccess: (state, action) => {
            state.currentUser= action.payload;
            state.loading = false;
            state.error = false;
            // console.log(action.payload);

        }, 
        signInFailure: (state, action) => {
            state.loading= false;
            state.error= action.payload;
            // console.log(action);
            // console.log(action.payload.topicId);

        },
        updateUserStart: (state) => {
            state.loading= true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser= action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserFailure: (state, action) => {
            state.loading= false;
            state.error= action.payload;
        },
        deleteUserStart: (state) => {
            state.loading= true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser= null;
            state.loading = false;
            state.error = false;
        },
        deleteUserFailure: (state, action) => {
            state.loading= false;
            state.error= action.payload;
        },
        signOut: (state) => {
            state.currentUser= null;
            state.loading = false;
            state.error = false;
        },

    },
});

export const {signInStart, signInSuccess, signInFailure, 
updateUserStart, updateUserSuccess, updateUserFailure,
deleteUserStart, deleteUserSuccess, deleteUserFailure,
signOut} = userSlice.actions;
export default userSlice.reducer;