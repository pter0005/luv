
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPagesByUserId } from '@/actions/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchPages = async () => {
        setLoadingPages(true);
        const userPages = await getPagesByUserId(user.uid);
        setPages(userPages);
        setLoadingPages(false);
      };
      fetchPages();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
        <div className="container section-padding">
            <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-40 w-full" />
                        </CardContent>
                    </Card>
                ))}
             </div>
        </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-bold font-display">Meu Dashboard</h1>
            <p className="text-muted-foreground mt-2">Gerencie todas as suas criações em um só lugar.</p>
        </div>
        <Link href="/criar">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Criar Nova Página
          </Button>
        </Link>
      </div>

      {loadingPages ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            ))}
         </div>
      ) : pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map((page) => (
            <Card key={page.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{page.title || 'Página Sem Título'}</CardTitle>
                <CardDescription>
                  Criada em: {new Date(page.createdAt.seconds * 1000).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="relative aspect-video w-full bg-muted rounded-md mb-4 overflow-hidden">
                    <Image src={page.photos?.[0] || page.heroImage || 'https://picsum.photos/400/225'} alt={page.title} layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                 <Link href={`/p/${page.id}`} passHref legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full" disabled={page.status !== 'paid'}>
                            <Eye className="mr-2 h-4 w-4" />
                            {page.status === 'paid' ? 'Ver Página' : 'Pagamento Pendente'}
                        </Button>
                    </a>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">Nenhuma página criada ainda</h2>
          <p className="text-muted-foreground mt-2 mb-6">Que tal começar a sua primeira obra de arte digital agora?</p>
          <Link href="/criar">
            <Button>Criar Minha Primeira Página</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
