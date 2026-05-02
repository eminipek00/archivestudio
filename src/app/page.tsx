import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import AssetGrid from "@/components/AssetGrid";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary/30">
      <Navbar />
      <div className="flex flex-col gap-10">
        <Hero />
        <div className="relative z-20 -mt-20">
          <FilterBar />
          <AssetGrid />
        </div>
      </div>
      
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
