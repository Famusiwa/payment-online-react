import { toast } from "react-toastify";
import {toastTimer} from "@/lib/env";
type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (message: any, type: ToastType = 'info') => {
    toast[type](message, {
        position: 'top-right',
        autoClose: toastTimer,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};