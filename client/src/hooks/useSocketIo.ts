import { Context } from "../contexts/SocketIoContext";
import hookContext from "./hookContext";

const useSocketIo = hookContext(Context, "SocketIoContext");
export default useSocketIo;
