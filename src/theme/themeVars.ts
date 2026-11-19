// Восстановление темы ДО первой отрисовки.
//
// Проблема: CSS-переменные выбранной темы применяются в useEffect после
// гидратации (initTheme), поэтому на один кадр видна дефолтная тема — «мигание».
// Решение: при каждом применении темы сохраняем снимок всех инлайновых
// CSS-переменных корня в localStorage, а inline-скрипт в <head> возвращает
// их до парсинга body (см. THEME_BOOTSTRAP_SCRIPT и layout.tsx).

export const THEME_VARS_KEY = 'themeVars';

// Сжат намеренно: исполняется на каждой загрузке страницы, в <head>
//
// 1) есть снимок переменных (обычный случай) — ставим его;
// 2) снимка нет (первый заход после обновления) — хотя бы фон и акцент
//    выбранной темы, чтобы заставка была в её цветах.
const SPLASH_FALLBACK: Record<string, { bg: string; accent: string }> = {
  yaru: { bg: '#1B1922', accent: '#E95420' },
  aurora: { bg: '#300A24', accent: '#F5894B' },
  midnight: { bg: '#0C1134', accent: '#BCC1CC' },
  forest: { bg: '#0A1B12', accent: '#4ED88C' },
  day: { bg: '#F3F2F6', accent: '#E95420' },
  sage: { bg: '#EAF1E8', accent: '#1F8A50' },
};

export const THEME_BOOTSTRAP_SCRIPT = [
  'try{',
  'var s=document.documentElement.style;',
  'var v=JSON.parse(localStorage.getItem("themeVars")||"null");',
  'if(v){for(var k in v){if(k.slice(0,2)==="--")s.setProperty(k,v[k]);}}',
  'else{var f=', JSON.stringify(SPLASH_FALLBACK), ';',
  'var t=f[localStorage.getItem("theme")];',
  'if(t){s.setProperty("--bg-color",t.bg);s.setProperty("--current-color",t.accent);}',
  '}',
  '}catch(e){}',
].join('');

// сохранить снимок текущих инлайновых переменных темы на корне документа
export const persistThemeVars = (): void => {
  try {
    const style = document.documentElement.style;
    const vars: Record<string, string> = {};
    for (let i = 0; i < style.length; i += 1) {
      const name = style.item(i);
      if (name.startsWith('--')) {
        vars[name] = style.getPropertyValue(name);
      }
    }
    window.localStorage.setItem(THEME_VARS_KEY, JSON.stringify(vars));
  } catch {
    // нет localStorage / приватный режим: тема применится после гидратации
  }
};
