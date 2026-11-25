// Индикатор dev-режима Next (#devtools-indicator) живёт в shadow DOM портала
// и позиционируется инлайново по углу вьюпорта (devIndicators.position в
// next.config.ts) — в поток шапки он не встаёт. В dev сдвигаем его к нашей
// dev-зоне (слева от «⋮»), измеряя её позицию. В проде не вызывается.
// Возвращает функцию очистки.
const PORTAL_SELECTOR = 'nextjs-portal';
const BADGE_ID = 'devtools-indicator';
const FALLBACK_SIZE = 36;
// отступ от левого края dev-слота до правого края индикатора (там начинается
// уменьшенная кнопка TanStack — см. .devTools в Header.module.scss)
const BADGE_GAP = 32;
const SYNC_MS = 1000;

const getBadge = (): HTMLElement | null => {
  const portal = document.querySelector<HTMLElement>(PORTAL_SELECTOR);
  return portal?.shadowRoot?.querySelector<HTMLElement>(`#${BADGE_ID}`) ?? null;
};

const alignNextDevBadge = (slot: HTMLElement): (() => void) => {
  const paint = () => {
    const badge = getBadge();
    const rect = slot.getBoundingClientRect();
    if (!badge || !rect.width) return;

    const size = badge.offsetHeight || FALLBACK_SIZE;
    // бейдж — «таблетка» переменной ширины (36px в норме, шире с текстом
    // статуса) и растёт влево, поэтому привязываем его правый край к слоту
    const right = `${Math.max(0, Math.round(window.innerWidth - rect.left - BADGE_GAP))}px`;
    const top = `${Math.max(0, Math.round(rect.top + (rect.height - size) / 2))}px`;

    // сравниваем со своим же значением: запись в style иначе дёргала бы
    // перерисовку на каждом тике
    if (badge.style.right !== right) badge.style.setProperty('right', right, 'important');
    if (badge.style.top !== top) badge.style.setProperty('top', top, 'important');
    if (badge.style.bottom !== 'auto') badge.style.setProperty('bottom', 'auto', 'important');
    if (badge.style.left !== 'auto') badge.style.setProperty('left', 'auto', 'important');
  };

  // портал появляется после гидрации, а при смене статуса сборки Next
  // возвращает бейдж в угол — поэтому сверяемся раз в секунду (только dev);
  // ResizeObserver сразу догоняет момент, когда слот получил финальные размеры
  const tick = window.setInterval(paint, SYNC_MS);
  const resizeObserver = new ResizeObserver(paint);
  resizeObserver.observe(slot);
  window.addEventListener('resize', paint);
  paint();

  return () => {
    window.clearInterval(tick);
    resizeObserver.disconnect();
    window.removeEventListener('resize', paint);
  };
};

export default alignNextDevBadge;
