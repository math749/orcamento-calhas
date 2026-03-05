import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Profile() {
  const [, navigate] = useLocation();
  const { loading: authLoading, user } = useAuth({ redirectOnUnauthenticated: true });
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Desconectado com sucesso");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao desconectar");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">Meu Perfil</h1>
        <p className="text-slate-600 mb-8">Informações da sua conta</p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Nome</p>
                <p className="text-lg font-semibold text-slate-900">
                  {user?.name || "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Email</p>
                <p className="text-lg font-semibold text-slate-900">
                  {user?.email || "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Tipo de Conta</p>
                <p className="text-lg font-semibold text-slate-900">
                  {user?.role === "admin" ? "Administrador" : "Usuário"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Membro desde</p>
                <p className="text-lg font-semibold text-slate-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                    : "Não informado"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Ações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="destructive"
                className="w-full gap-2"
              >
                <LogOut className="w-5 h-5" />
                {logoutMutation.isPending ? "Desconectando..." : "Desconectar"}
              </Button>
              <p className="text-sm text-slate-600 text-center">
                Você será desconectado da sua conta
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
