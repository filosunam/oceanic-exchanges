import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function success(message = "Done!", options = {}) {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...options
  });
}

export function error(message = "Algo estuvo mal", options = {}) {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...options
  });
}

export function info(message, options = {}) {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...options
  });
}
