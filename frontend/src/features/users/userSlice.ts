import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
  role: Role; // Changed from number to Role object
  token: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  userData: User | null;
  isAuthenticated: boolean;
}

const storedUser = localStorage.getItem('user');

const initialState: UserState = storedUser
  ? {
      userData: JSON.parse(storedUser),
      isAuthenticated: true,
    }
  : { userData: null, isAuthenticated: false };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      const { password, ...userWithoutPassword } = action.payload;
      state.userData = userWithoutPassword;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      // Assuming the token is also stored separately as per your dashboard code
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
      }
    },
    logoutUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.userData) {
        const { password, ...updatedData } = action.payload;
        state.userData = { ...state.userData, ...updatedData };
        localStorage.setItem('user', JSON.stringify(state.userData));
      }
    },
  },
});

export const { loginUser, logoutUser, updateUser } = userSlice.actions;
export default userSlice.reducer;