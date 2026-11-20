import { StatusScreen } from '@/components/site/StatusScreen';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default function NotFound() {
  return (
    <StatusScreen
      title="Página fora de órbita"
      message="Não encontramos o que você procurava. Talvez o projeto ainda não tenha sido publicado."
    >
      <ButtonLink href="/">Voltar para a vitrine</ButtonLink>
    </StatusScreen>
  );
}
