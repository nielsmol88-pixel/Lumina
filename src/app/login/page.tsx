"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-600">
            LÚMINA
          </p>
          <h1 className="mt-2 font-serif text-2xl text-white">
            Acceso interno
          </h1>
        </div>

        {sent ? (
          <div className="rounded-sm border border-slate-700 bg-slate-800 p-6 text-center">
            <p className="text-sm text-slate-300">
              Enlace de acceso enviado a{" "}
              <span className="text-amber-500">{email}</span>
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Revise su bandeja de entrada y haga clic en el enlace.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-400">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ceo@lumina.es"
                required
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-600"
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar enlace de acceso"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
