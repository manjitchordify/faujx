import { toast } from 'react-toastify';

export const showToast = (
  text: string,
  type: 'error' | 'success' | 'warning' = 'success'
) => {
  if (type == 'error') {
    return toast.error(text);
  }
  if (type == 'warning') {
    return toast.warning(text);
  }
  if (type == 'success') {
    return toast.success(text);
  }
};
