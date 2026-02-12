import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/app/types"

export const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [] as User[],
        loading: false,
        error: null as string | null,
    },
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            const user = action.payload;
            state.users.push(user);
        },

        removeUser: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            state.users = state.users.filter((user) => user.id !== userId);
        },

        updateUser: (state, action: PayloadAction<{ id: string; changes: Partial<User> }>) => {
            const { id, changes } = action.payload;
            const user = state.users.find(u => u.id === id);
            if (user) {
                Object.assign(user, changes);
            }
        },
    },
});

export const { addUser, removeUser, updateUser } = usersSlice.actions;
export default usersSlice;