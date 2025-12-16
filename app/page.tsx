import Header from "@/components/custom/utils/header/Header";
import Section from "@/components/custom/utils/main/Section";
import Footer from "@/components/custom/utils/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-24 md:pt-14">
        <Section />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
