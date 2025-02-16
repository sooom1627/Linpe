import {
  BaseToast,
  ErrorToast,
  type ToastConfigParams,
} from "react-native-toast-message";

const styles = {
  base: {
    zIndex: 9999,
    elevation: 9999,
  },
  success: {
    borderLeftColor: "#22c55e",
    backgroundColor: "#f0fdf4",
  },
  error: {
    borderLeftColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  successText: {
    color: "#166534",
  },
  errorText: {
    color: "#991b1b",
  },
};

type ToastData = {
  text1?: string;
  text2?: string;
};

export const toastConfig = {
  success: (props: ToastConfigParams<ToastData>) => (
    <BaseToast
      {...props}
      style={[styles.base, styles.success]}
      text1Style={styles.successText}
      text2Style={styles.successText}
    />
  ),
  error: (props: ToastConfigParams<ToastData>) => (
    <ErrorToast
      {...props}
      style={[styles.base, styles.error]}
      text1Style={styles.errorText}
      text2Style={styles.errorText}
    />
  ),
};
