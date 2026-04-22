import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
  description:
    "Get in touch with Fajar Abdi Nugraha for backend engineering, cloud architecture, and tech lead opportunities.",
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
