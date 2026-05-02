import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import AssetGrid from "@/components/AssetGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FilterBar />
      <AssetGrid />
      
      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Archive Studio. Tüm hakları saklıdır.
        </p>
      </footer>
    </main>
  );
}
