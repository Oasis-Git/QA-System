import { Context } from "../../contexts/user/AuthContext";
import hookContext from "../hookContext";

const useAuth = hookContext(Context, "UserAuth");

export default useAuth;
