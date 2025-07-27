import { Session, User } from "better-auth";

export interface UserSession {
  user: User;
  session: Session;
}
