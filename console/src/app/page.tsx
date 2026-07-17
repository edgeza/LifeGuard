import { loadData } from "@/lib/data";
import { TopNav } from "@/components/TopNav";
import { ConsoleView } from "@/components/ConsoleView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await loadData();
  return (
    <div className="flex h-screen flex-col bg-[#0a0b0d] text-[#e6e9ef]">
      <TopNav stats={data.stats} />
      <main className="flex-1 min-h-0">
        <ConsoleView data={data} />
      </main>
    </div>
  );
}
