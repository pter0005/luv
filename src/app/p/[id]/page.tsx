
"use client";

import { useEffect, useState } from 'react';
import { getPageData } from '@/actions/page';
import { PublicPage } from '@/components/app/PublicPage';
import { Skeleton } from '@/components/ui/skeleton';
import { NetflixDeAmorPage } from '@/components/app/NetflixDeAmorPage';

export default function Page({ params }: { params: { id: string } }) {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPageData(params.id);
        if (data) {
           if (data.status !== 'paid') {
            setError("Esta página ainda não foi ativada. Por favor, finalize o pagamento.");
          } else {
            setPageData(data);
          }
        } else {
          setError("Página não encontrada. O link pode estar quebrado ou a página pode ter sido removida.");
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        setError("Ocorreu um erro ao carregar a página. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#141414] flex flex-col p-8 space-y-8">
          <div className="w-full h-1/2">
            <Skeleton className="h-full w-full bg-zinc-800" />
          </div>
          <div className="w-full h-1/2 space-y-4">
            <Skeleton className="h-8 w-1/4 bg-zinc-800" />
            <div className="flex gap-4">
                <Skeleton className="h-48 w-32 bg-zinc-800" />
                <Skeleton className="h-48 w-32 bg-zinc-800" />
                <Skeleton className="h-48 w-32 bg-zinc-800" />
            </div>
          </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold text-white mb-4">Acesso Negado</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  if (pageData?.template === 'netflix-de-amor') {
    return <NetflixDeAmorPage data={pageData} />;
  }

  return <PublicPage data={pageData} />;
}
