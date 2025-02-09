import {
  BaseToast,
  ErrorToast,
  type ToastConfigParams,
} from "react-native-toast-message";

const styles = {
  base: {
    zIndex: 9999,
  },
};

type ToastData = {
  text1?: string;
  text2?: string;
};

export const toastConfig = {
  success: (props: ToastConfigParams<ToastData>) => (
    <BaseToast {...props} style={styles.base} />
  ),
  error: (props: ToastConfigParams<ToastData>) => (
    <ErrorToast {...props} style={styles.base} />
  ),
};
