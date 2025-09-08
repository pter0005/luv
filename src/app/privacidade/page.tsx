
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="relative">
      <div className="relative z-10">
        <header className="absolute top-0 left-0 w-full p-4">
            <div className="container">
                <Link href="/">
                    <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o início
                    </Button>
                </Link>
            </div>
        </header>
        <section className="section-padding pt-32">
          <div className="container max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 font-display">
              Política de Privacidade
            </h1>
            <div className="prose prose-invert lg:prose-xl">
              <p>Última atualização: [Data]</p>
              
              <p>A sua privacidade é importante para nós. É política do Luv respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Luv, e outros sites que possuímos e operamos.</p>

              <h2>1. Informações que coletamos</h2>
              <p>Coletamos informações que você nos fornece diretamente. Por exemplo, coletamos informações quando você cria uma página, se cadastra para receber nossas newsletters, responde a uma pesquisa ou se comunica conosco.</p>
              <p>As informações que podemos coletar incluem seu nome, endereço de e-mail, número de telefone e qualquer outra informação que você decida fornecer.</p>

              <h2>2. Uso das informações</h2>
              <p>Usamos as informações que coletamos para:</p>
              <ul>
                <li>Fornecer, manter e melhorar nossos serviços;</li>
                <li>Enviar a você notificações técnicas, atualizações, alertas de segurança e mensagens de suporte e administrativas;</li>
                <li>Responder aos seus comentários, perguntas e solicitações e fornecer atendimento ao cliente;</li>
                <li>Monitorar e analisar tendências, uso e atividades em conexão com nossos serviços;</li>
              </ul>

              <h2>3. Compartilhamento de informações</h2>
              <p>Não compartilhamos suas informações pessoais com terceiros, exceto nas seguintes circunstâncias ou conforme descrito nesta Política de Privacidade:</p>
              <ul>
                <li>Com o seu consentimento ou sob sua direção;</li>
                <li>Para cumprir a lei ou responder a processos legais ou solicitações legais, incluindo de autoridades públicas e governamentais.</li>
              </ul>

              <h2>4. Segurança</h2>
              <p>Tomamos medidas razoáveis para ajudar a proteger as informações sobre você contra perda, roubo, uso indevido e acesso não autorizado, divulgação, alteração e destruição.</p>
            
              <h2>5. Contato</h2>
              <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em: [Seu E-mail de Contato].</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
