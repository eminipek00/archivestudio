import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import AssetGrid from "@/components/AssetGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FilterBar />
      <AssetGrid />
      
      <footer className="py-16 border-t border-border-custom bg-card/30 backdrop-blur-sm text-center mt-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <h3 className="text-xl font-black tracking-tighter uppercase mb-4">sytexarchive</h3>
          <p className="text-muted-foreground text-xs font-medium">
            &copy; {new Date().getFullYear()} sytexarchive. Tüm hakları saklıdır. <br />
            Premium Resources for Professional Editors.
          </p>
        </div>
      </footer>
    </main>
  );
}
