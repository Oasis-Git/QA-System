import { Context } from "../../contexts/admin/AuthContext";
import hookContext from "../hookContext";

const useAuth = hookContext(Context, "AdminAuth");

export default useAuth;
