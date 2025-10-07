export const LOGIN = "@@RD2/LOGIN";
export const LOGOUT = "@@SRD2/LOGOUT";
export const PUBLIC_KEY = "@@SRD2/PUBLIC_KEY";

export const login = (user) => ({
    type : LOGIN,
    payload : user
});

export const logout = () => ({
   type : LOGOUT
});

export const setPublicKey = (key) => ({
    type : PUBLIC_KEY,
    payload: key
});
