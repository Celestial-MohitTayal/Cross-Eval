import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// auth state structure
interface User {
  id: string;
  name: string;
  email: string;
  type: "Admin" | "Teacher" | "Student";
  isLoggedIn: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: {...JSON.parse(localStorage.getItem("user") || "null"), isLoggedIn: false},
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = {...action.payload.user, isLoggedIn: true};
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
