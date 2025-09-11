
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "react-feather";
import Link from "next/link";

export default function TermosPage() {
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
              Termos de Uso
            </h1>
            <div className="prose prose-invert lg:prose-xl">
              <p>Última atualização: [Data]</p>
              
              <h2>1. Aceitação dos Termos</h2>
              <p>Ao acessar e usar o Luv, você aceita e concorda em estar vinculado pelos termos e disposições deste acordo. Além disso, ao usar estes serviços particulares, você estará sujeito a quaisquer diretrizes ou regras aplicáveis postadas para tais serviços.</p>

              <h2>2. Descrição do Serviço</h2>
              <p>O Luv fornece aos usuários a capacidade de criar páginas da web personalizadas para expressar sentimentos e compartilhar momentos. Você entende e concorda que o Serviço é fornecido "COMO ESTÁ" e que o Luv não assume responsabilidade pela pontualidade, exclusão, falha na entrega ou falha no armazenamento de quaisquer comunicações do usuário ou configurações de personalização.</p>
              
              <h2>3. Conduta do Usuário</h2>
              <p>Você é responsável por todo o conteúdo que postar, enviar por e-mail, transmitir ou de outra forma disponibilizar através do Serviço. O Luv não controla o conteúdo postado através do Serviço e, como tal, não garante a precisão, integridade ou qualidade de tal conteúdo.</p>

              <h2>4. Conteúdo do Usuário</h2>
              <p>Você retém todos os seus direitos de propriedade sobre seu conteúdo. No entanto, ao enviar conteúdo para o Luv, você concede ao Luv uma licença mundial, não exclusiva, isenta de royalties, sublicenciável e transferível para usar, reproduzir, distribuir, preparar trabalhos derivados, exibir e executar o conteúdo em conexão com o Serviço e os negócios do Luv.</p>
              
              <h2>5. Modificações no Serviço</h2>
              <p>O Luv reserva-se o direito de, a qualquer momento, modificar ou descontinuar, temporária ou permanentemente, o Serviço (ou qualquer parte dele) com ou sem aviso prévio. Você concorda que o Luv não será responsável perante você ou qualquer terceiro por qualquer modificação, suspensão ou descontinuação do Serviço.</p>

              <h2>6. Rescisão</h2>
              <p>Você concorda que o Luv pode, sob certas circunstâncias e sem aviso prévio, encerrar imediatamente sua conta Luv e o acesso ao Serviço. A causa para tal rescisão incluirá, mas não se limitará a, (a) violações ou violações destes Termos de Uso, (b) solicitações por autoridades policiais ou outras agências governamentais.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
