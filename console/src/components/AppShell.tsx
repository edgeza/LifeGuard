import { loadData } from "@/lib/data";
import { TopNav } from "@/components/TopNav";

export const dynamic = "force-dynamic";

export async function AppShell({ children, title, subtitle, right }: { children: React.ReactNode; title: string; subtitle?: string; right?: React.ReactNode }) {
  const data = await loadData();
  return (
    <div className="flex h-screen flex-col bg-[#0a0b0d] text-[#e6e9ef]">
      <TopNav stats={data.stats} />
      <div className="flex h-10 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[14px] font-medium tracking-tight text-[#e6e9ef]">{title}</h1>
          {subtitle && <span className="text-[12px] text-[#6b7280]">{subtitle}</span>}
        </div>
        {right}
      </div>
      <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
    </div>
  );
}
