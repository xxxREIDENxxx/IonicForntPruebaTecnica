import { User } from "./User";

export class Pedido {
    id     : number = 0;
    lugar  :  String  = "";
    fecha  : Date = new Date;
    estado : Boolean = false;
    user   : User = new User;
}