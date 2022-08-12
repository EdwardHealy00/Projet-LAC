export enum Role {
    Admin = "admin",
    User = "user",
    Comity = "comity",
    Deputy = "deputy",
    Professor = "professor",
    PolyPress = "polypress",
}

export interface RoleProps {
    role: Role[];
    children: React.ReactNode;
}