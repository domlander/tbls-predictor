import { User } from "@prisma/client";

export type Participant = {
  id: User["id"];
  username: string;
};
