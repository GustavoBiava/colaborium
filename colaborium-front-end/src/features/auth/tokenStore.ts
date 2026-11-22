const STORAGE_KEY = "colaborium_access_token";

let accessToken: string | null =
    typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;

export const tokenStore = {
    get: () => accessToken,
    set: (token: string | null) => {
        accessToken = token;

        if (token) localStorage.setItem(STORAGE_KEY, token);
        else localStorage.removeItem(STORAGE_KEY);
    },
};
