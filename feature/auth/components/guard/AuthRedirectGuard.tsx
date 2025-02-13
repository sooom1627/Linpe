import { type ReactNode } from "react";

import { useSessionContext } from "../../contexts/SessionContext";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

type Props = {
  children: ReactNode;
};

export function AuthRedirectGuard({ children }: Props) {
  const { session } = useSessionContext();
  useAuthRedirect(session);

  return <>{children}</>;
}
