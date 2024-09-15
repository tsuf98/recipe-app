import { create } from "zustand";
import { User } from "./types";

export interface RootState {
  loggedUser?: User;
  errorAlertMessage?: string;
  setErrorAlertMessage: (msg: string) => void;
  dismissErrorAlert: () => void;
  initUser: (user: User) => void;
}

export const useStore = create<RootState>()((set) => ({
  setErrorAlertMessage: (msg: string) =>
    set(() => ({ errorAlertMessage: msg })),
  dismissErrorAlert: () => set(() => ({ errorAlertMessage: undefined })),
  initUser: (user) => set(() => ({ loggedUser: user })),
}));
