import { Link } from "expo-router";

type DefaultLinkProps = Pick<
  React.ComponentProps<typeof Link>,
  "children" | "href"
>;

export const DefaultLink = ({ children, href }: DefaultLinkProps) => {
  return (
    <Link href={href} className="text-blue-500 underline">
      {children}
    </Link>
  );
};
