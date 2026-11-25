// Ícones de traço (viewBox 24x24) das peças. A chave é o `id` da peça em config.js.
export const ICONES = Object.freeze({
  'paineis-arco': '<path d="M6 21V10a6 6 0 0112 0v11z"/>',
  'paineis-redondos': '<circle cx="12" cy="11" r="7.5"/><path d="M9 21h6M12 18.5V21"/>',
  cilindros: '<ellipse cx="12" cy="7" rx="6" ry="2.6"/><path d="M6 7v10c0 1.5 2.7 2.6 6 2.6s6-1.1 6-2.6V7"/>',
  'arcos-baloes': '<circle cx="6.5" cy="15" r="3"/><circle cx="10.5" cy="8.5" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="19" cy="14" r="2.4"/>',
  neon: '<path d="M4 9l3-2v11M12 7h7M12 7v5h4.5a2.5 2.5 0 010 5H12"/>',
  tapetes: '<rect x="3" y="12" width="18" height="6" rx="3"/><path d="M6 18v2M10 18v2M14 18v2M18 18v2"/>',
  'pista-led': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 12h18M9 5v14M15 5v14"/>',
  'baloes-bolha': '<circle cx="12" cy="12" r="8"/><path d="M8 9a5 5 0 013-2.5"/>',
  estantes: '<path d="M6.5 21L8 3M17.5 21L16 3M7 8h10M6.7 13h10.6M6.3 18h11.4"/>',
  'vasos-flores': '<path d="M9 20h6l1.2-6H7.8z"/><circle cx="12" cy="7" r="2.6"/><path d="M12 9.6V14M9 6.5L7 5M15 6.5L17 5"/>',
  letreiros: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h10"/>',
  'suportes-doces': '<path d="M7 10a5 5 0 0110 0zM12 10v9M8 19h8"/>',
  'pecas-mdf': '<path d="M12 7v10M12 12C9 4 3 6 5 12c.8 2.3 4 2 7 0M12 12c3-8 9-6 7 0-.8 2.3-4 2-7 0"/>',
});

export function iconeSvg(id) {
  const interno = ICONES[id] ?? '<circle cx="12" cy="12" r="6"/>';
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${interno}</svg>`;
}
