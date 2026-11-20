import Link from 'next/link';

import { StatusScreen } from '@/components/site/StatusScreen';
import { buttonClasses } from '@/components/ui/button-styles';

export default function NotFound() {
  return (
    <StatusScreen
      title="Página fora de órbita"
      message="Não encontramos o que você procurava. Talvez o projeto ainda não tenha sido publicado."
    >
      <Link href="/" className={buttonClasses()}>
        Voltar para a vitrine
      </Link>
    </StatusScreen>
  );
}
