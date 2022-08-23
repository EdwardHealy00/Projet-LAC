export enum Role {
    Admin = "admin",
    Student = "student",
    Comity = "comity",
    Deputy = "deputy",
    Professor = "professorApproved",
    ProfessorNotApproved = "professorNotApproved",
    PolyPress = "polypress",
}

export interface RoleProps {
    role: Role[];
    children: React.ReactNode;
}