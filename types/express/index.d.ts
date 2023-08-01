declare namespace Express {
    interface Request {
        idUser: string;
        roleUser: string;
        authorization: string;
    }
}