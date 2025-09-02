// import { toast } from "react-toastify";
// import { SignUpModel } from "../models/SignUpModel";
// import { globalTostTheme } from "../utils/tost-theme-util";

import { UserModel } from "../models/UserModel";

export function getAllUsers(): UserModel[] {
  return JSON.parse(localStorage.getItem("users") ?? "[]");
}

// export function signUpUser(user: UserModel): boolean {
//   const users = getAllUsers();
//   if (users.some((u) => u.email == user.email)) {
//     toast.error("Sorry! User Alrady Exist With Same Email", globalTostTheme);
//     return false;
//   }
//   users.push(user);
//   localStorage.setItem("users", JSON.stringify(users));
//   toast.success("Sign Up Succsessfully!", globalTostTheme);
//   return true;
// }

export function setUserLogin(userData: UserModel): void {
  localStorage.setItem("login", JSON.stringify(userData));
}

export function loginUser(user: Partial<UserModel>): [boolean, UserModel | null] {
  const users = getAllUsers();
  

  const index = users.findIndex((u) => {
    return u.username == user.username && u.password == user.password;
  });
  
  if (index > -1) {
    setUserLogin(users[index]);
    return [true, users[index]];
  }
  return [false, null];
}

export function isLogin(): boolean {
  if (localStorage.getItem("login")) {
    return true;
  }
  return false;
}

export function getLoginUser(): UserModel {
  return JSON.parse(localStorage.getItem("login") ?? "{}");
}

export function getUserById(userId: string): UserModel {
  const users = getAllUsers();
  const user = users.find((user) => user.uid === userId);
  if (user) {
    return user;
  }
  return new UserModel();
}

export function logout(): void {
  // toast.success("Logout Succsessfully!", globalTostTheme);
  localStorage.removeItem("login");
}
