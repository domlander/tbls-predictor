import User from "./User";

type Participant = Pick<User, "id" | "username">;

export default Participant;
