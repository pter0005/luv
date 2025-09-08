
"use client";

import { useEffect, useState } from 'react';
import { withAuth, useAuth } from '@/contexts/AuthContext';
import { getPagesByUserId } from '@/actions/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Eye, Share2, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getPagesByUserId(user.uid)
        .then((userPages) => {
          setPages(userPages);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleShare = (pageId: string) => {
    const pageUrl = `${window.location.origin}/p/${pageId}`;
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link copiado!" });
  };
  
  if (loading) {
    return (
        <div className="container section-padding">
             <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-12 w-36" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-bold font-display">Minhas Páginas</h1>
            <p className="text-muted-foreground">Aqui estão todas as suas criações.</p>
        </div>
        <Link href="/criar">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Criar Nova Página
          </Button>
        </Link>
      </div>

      {pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map((page) => (
            <Card key={page.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{page.title}</CardTitle>
                 <CardDescription>
                  Criada em {page.createdAt ? format(page.createdAt.toDate(), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end space-y-4">
                 <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${page.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {page.status === 'paid' ? 'Ativa' : 'Pendente'}
                    </span>
                     <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                        {page.plan === 'essencial' ? 'Essencial' : 'Personalizado'}
                    </span>
                 </div>
                 <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Link href={`/p/${page.id}`} passHref legacyBehavior>
                        <a target="_blank">
                            <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                            </Button>
                        </a>
                    </Link>
                    <Button size="sm" onClick={() => handleShare(page.id)} disabled={page.status !== 'paid'}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Link
                    </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">Nenhuma página criada ainda</h2>
          <p className="text-muted-foreground mt-2 mb-6">Parece que você ainda não criou nenhuma página. Que tal começar agora?</p>
          <Link href="/criar">
            <Button>Criar minha primeira página</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default withAuth(DashboardPage);
