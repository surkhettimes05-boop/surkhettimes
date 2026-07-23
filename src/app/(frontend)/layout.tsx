import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { NewsletterFooter } from "@/components/Newsletter";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <NewsletterFooter />
      <Footer />
    </>
  );
}
