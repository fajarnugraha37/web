import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Translation Playground | Fajar Abdi Nugraha",
  description: "Offline-capable, client-side translation playground using transformers.js and ONNX Runtime Web.",
};

export default function TranslateLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
