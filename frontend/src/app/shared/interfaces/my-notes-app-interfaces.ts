export interface API_NoteObject {
    id?: number
    title: string;
    description: string;
    categoryId: number;
    isActive: boolean;
    category?: API_CategoryObject
}

export interface API_CategoryObject {
    id: number;
    name: string;
    colorCode?: string;
}
export interface UI_IconButtonObject {
    action: string;
    show: boolean;
    icon: string;
}
export interface API_ResponseObject<T> {
    data: T;
    message: string;
}
export interface API_LoginRequest {
    email: string;
    password: string;
}

export interface API_LoginResponse {
    token: string;
}