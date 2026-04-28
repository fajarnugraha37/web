import { ContactsContent } from "@/components/organisms/ContactsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
  description: "Establish a secure connection vector. Reach out to Fajar Abdi Nugraha via terminal or direct links.",
  openGraph: {
    title: "Contacts | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
    description: "Establish a secure connection vector. Reach out to Fajar Abdi Nugraha via terminal or direct links.",
    type: "website",
    url: "/contacts",
  },
};

/**
 * Contacts Page
 * Features an interactive terminal and direct neural links for communication.
 */
export default function ContactsPage() {
  return <ContactsContent />;
}
