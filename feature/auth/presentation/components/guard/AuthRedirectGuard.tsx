import { type ReactNode } from "react";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { useAuthRedirect } from "@/feature/auth/application/hooks/useAuthRedirect";

type Props = {
  children: ReactNode;
};

export function AuthRedirectGuard({ children }: Props) {
  const { session } = useSessionContext();
  useAuthRedirect(session);

  return <>{children}</>;
}
