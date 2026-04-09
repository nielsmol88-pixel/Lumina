import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast-provider";
import { LogOut } from "lucide-react";

export const metadata = { title: "Dashboard — LÚMINA" };

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top nav */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg text-slate-900">LÚMINA</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
              CEO Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-slate-900">
            Panel de pacientes
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Vista en tiempo real · Actualización automática
          </p>
        </div>

        <ToastProvider>
          <KanbanBoard />
          <Toaster />
        </ToastProvider>
      </main>
    </div>
  );
}
