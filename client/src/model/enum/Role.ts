export enum Role {
    Admin = "admin",
    Student = "student",
    Comity = "comity",
    ComityDirector = "comityDirector",
    Deputy = "deputy",
    Professor = "professorApproved",
    ProfessorNotApproved = "professorNotApproved",
    PolyPress = "polypress",
    ComityNotApproved = "comityNotApproved"
}

export interface RoleProps {
    role: Role[];
    children: React.ReactNode;
}