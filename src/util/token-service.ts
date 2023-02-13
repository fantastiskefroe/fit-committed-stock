export function saveToken(token: string): void {
    window.localStorage.setItem('fit-token', token);
}

export function loadToken(): string {
    const token = window.localStorage.getItem('fit-token');
    if (token == null) {
        return "";
    }

    return token;
}
