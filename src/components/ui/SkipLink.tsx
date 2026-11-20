import { buttonClasses } from './button-styles';
import { MAIN_CONTENT_ID } from './main-content-id';

export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className={buttonClasses({
        className: 'fixed top-3 left-3 z-60 -translate-y-24 focus:translate-y-0',
      })}
    >
      Pular para o conteúdo
    </a>
  );
}
