(function () {
  'use strict';

  var WHATSAPP = '5551980123362';
  var MAX_QTY = 20;
  var MAX_NOME = 60, MAX_END = 140, MAX_OBS = 240;
  var MENU = [
    { id: 'p', nome: 'Marmita Pequena', desc: 'Arroz, feijão, 1 carne do dia, salada e 1 acompanhamento.', preco: 18 },
    { id: 'm', nome: 'Marmita Média', desc: 'Arroz, feijão, 2 carnes do dia, salada e 2 acompanhamentos.', preco: 22 },
    { id: 'g', nome: 'Marmita Grande', desc: 'Arroz, feijão, 2 carnes do dia, massa, salada e 2 acompanhamentos.', preco: 26 },
    { id: 'gr', nome: 'Marmita de Grelhado', desc: 'Arroz, feijão, grelhado do dia (carne ou frango), salada e fritas.', preco: 30 },
    { id: 'fit', nome: 'Marmita Fit', desc: 'Arroz integral, frango grelhado, legumes no vapor e salada.', preco: 25 },
    { id: 'refri', nome: 'Refrigerante lata', desc: 'Lata de 350 ml. Consulte os sabores disponíveis.', preco: 6 }
  ];
  var FONT = "font-family: Karla, 'Trebuchet MS', sans-serif";
  var qty = Object.create(null), modo = 'Retirada', lastFocus = null;

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return 'R$ ' + n.toFixed(2).replace('.', ','); }
  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // Remove caracteres de controle e formatação do WhatsApp (*, _, ~, `) digitados pelo cliente.
  function clean(v, max) {
    return String(v).replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
  }
  function findItem(id) {
    return MENU.filter(function (m) { return m.id === id; })[0] || null;
  }
  function setQty(id, d) {
    if (!findItem(id)) return;
    qty[id] = Math.min(MAX_QTY, Math.max(0, (qty[id] || 0) + d));
    if (!MENU.some(function (m) { return qty[m.id] > 0; })) closeCart();
    render();
  }
  function pill(on) {
    return 'min-height: 48px; border-radius: 12px; ' + FONT + '; font-size: 16px; font-weight: 700; cursor: pointer; ' +
      (on ? 'border: 2px solid var(--accent); background: var(--accent); color: #FFFFFF;' : 'border: 2px solid #CBB89E; background: #FFFFFF; color: #2B1D14;');
  }

  function openCart() {
    lastFocus = document.activeElement;
    $('cart-modal').hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    $('close-cart').focus();
  }
  function closeCart() {
    if ($('cart-modal').hidden) return;
    $('cart-modal').hidden = true;
    document.body.style.overflow = '';
    render();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function render() {
    var active = document.activeElement, keep = null;
    if (active && active.getAttribute) keep = active.getAttribute('data-add') ? 'add:' + active.getAttribute('data-add') : active.getAttribute('data-sub') ? 'sub:' + active.getAttribute('data-sub') : null;

    $('menu').innerHTML = MENU.map(function (m) {
      var q = qty[m.id] || 0;
      var ctl = q === 0
        ? '<button type="button" data-add="' + m.id + '" aria-label="Adicionar ' + esc(m.nome) + '" style="min-height: 46px; padding: 0 20px; border-radius: 999px; border: 0; background: var(--accent); color: #FFFFFF; ' + FONT + '; font-size: 16px; font-weight: 700; cursor: pointer">Adicionar</button>'
        : '<div style="display: flex; align-items: center; gap: 6px; border: 2px solid var(--accent); border-radius: 999px; padding: 3px">' +
          '<button type="button" data-sub="' + m.id + '" aria-label="Remover um ' + esc(m.nome) + '" style="width: 44px; height: 44px; border-radius: 999px; border: 0; background: transparent; color: var(--accent); font-size: 22px; font-weight: 700; cursor: pointer">−</button>' +
          '<span aria-live="polite" style="min-width: 22px; text-align: center; font-size: 17px; font-weight: 700">' + q + '</span>' +
          '<button type="button" data-add="' + m.id + '" aria-label="Adicionar um ' + esc(m.nome) + '"' + (q >= MAX_QTY ? ' disabled' : '') + ' style="width: 44px; height: 44px; border-radius: 999px; border: 0; background: var(--accent); color: #FFFFFF; font-size: 20px; font-weight: 700; cursor: pointer">+</button></div>';
      return '<article style="display: flex; flex-direction: column; border-radius: 18px; background: #FFFFFF; border: 1px solid #E3D6C2; overflow: hidden">' +
        '<div style="height: 190px; background: #E8DCC8; border-bottom: 2px dashed #BFA888; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; color: #6B5446; font-size: 14px; text-align: center; padding: 16px; box-sizing: border-box">' +
        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8F7461" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="11" rx="2"></rect><path d="M2 8h20"></path><path d="M9 5h6"></path></svg>' +
        '<span>[Foto: ' + esc(m.nome) + ']</span></div>' +
        '<div style="display: flex; flex-direction: column; gap: 10px; padding: 20px; flex-grow: 1">' +
        '<h3 style="margin: 0; font-family: Fraunces, Georgia, serif; font-size: 23px; font-weight: 700">' + esc(m.nome) + '</h3>' +
        '<span style="font-size: 15px; line-height: 1.5; color: #5A4536; flex-grow: 1">' + esc(m.desc) + '</span>' +
        '<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 6px">' +
        '<span style="font-size: 21px; font-weight: 700; color: var(--accent)">' + fmt(m.preco) + '</span>' + ctl + '</div></div></article>';
    }).join('');

    var cart = MENU.filter(function (m) { return qty[m.id] > 0; });
    var count = cart.reduce(function (a, m) { return a + qty[m.id]; }, 0);
    var total = cart.reduce(function (a, m) { return a + qty[m.id] * m.preco; }, 0);
    var isEntrega = modo === 'Entrega';
    var nome = clean($('dg-nome').value, MAX_NOME), end = clean($('dg-end').value, MAX_END), obs = clean($('dg-obs').value, MAX_OBS);
    var nomeOk = nome.length > 0, endOk = !isEntrega || end.length > 0;
    var canSend = count > 0 && nomeOk && endOk;

    $('cart-bar').hidden = !(count > 0 && $('cart-modal').hidden);
    $('cart-count').textContent = count;
    Array.prototype.forEach.call(document.querySelectorAll('.total-txt'), function (e) { e.textContent = fmt(total); });

    $('cart-items').innerHTML = count === 0 ? '<span style="font-size: 16px; color: #5A4536">Seu carrinho está vazio.</span>' : cart.map(function (m) {
      return '<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #E3D6C2">' +
        '<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">' + esc(m.nome) + '</span><span style="font-size: 14px; color: #6B5446">' + fmt(m.preco) + ' cada</span></div>' +
        '<div style="display: flex; align-items: center; gap: 10px">' +
        '<div style="display: flex; align-items: center; gap: 4px; border: 1px solid #D5C4AC; border-radius: 999px; padding: 2px; background: #FFFFFF">' +
        '<button type="button" data-sub="' + m.id + '" aria-label="Remover um ' + esc(m.nome) + '" style="width: 44px; height: 44px; border-radius: 999px; border: 0; background: transparent; color: #2B1D14; font-size: 20px; cursor: pointer">−</button>' +
        '<span style="min-width: 20px; text-align: center; font-weight: 700">' + qty[m.id] + '</span>' +
        '<button type="button" data-add="' + m.id + '" aria-label="Adicionar um ' + esc(m.nome) + '"' + (qty[m.id] >= MAX_QTY ? ' disabled' : '') + ' style="width: 44px; height: 44px; border-radius: 999px; border: 0; background: transparent; color: #2B1D14; font-size: 20px; cursor: pointer">+</button></div>' +
        '<span style="min-width: 84px; text-align: right; font-weight: 700">' + fmt(m.preco * qty[m.id]) + '</span></div></div>';
    }).join('');

    $('modo-retirada').style.cssText = pill(!isEntrega);
    $('modo-entrega').style.cssText = pill(isEntrega);
    $('modo-retirada').setAttribute('aria-pressed', String(!isEntrega));
    $('modo-entrega').setAttribute('aria-pressed', String(isEntrega));
    $('end-wrap').hidden = !isEntrega;

    var falta = '';
    if (count === 0) falta = 'Adicione itens ao carrinho.';
    else if (!nomeOk) falta = 'Preencha seu nome para enviar.';
    else if (!endOk) falta = 'Preencha o endereço de entrega.';
    $('falta').textContent = falta;
    $('send').hidden = !canSend;
    $('send-off').hidden = canSend;

    var msg = "Olá, D'Guego! Quero fazer um pedido:\n\n" +
      cart.map(function (m) { return '• ' + qty[m.id] + 'x ' + m.nome + ' — ' + fmt(qty[m.id] * m.preco); }).join('\n') +
      '\n\n*Total: ' + fmt(total) + '*\n\nNome: ' + nome + '\nRecebimento: ' + (isEntrega ? 'Entrega' : 'Retirar no local');
    if (isEntrega) msg += '\nEndereço: ' + end;
    if (obs) msg += '\nObservações: ' + obs;
    $('send').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);

    if (keep) {
      var sel = '[data-' + keep.split(':')[0] + '="' + keep.split(':')[1] + '"]';
      var scope = $('cart-modal').hidden ? $('menu') : $('cart-items');
      var el = scope.querySelector(sel) || $('menu').querySelector(sel);
      if (el && !el.disabled) el.focus();
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-add],[data-sub]') : null;
    if (!b || b.disabled) return;
    if (b.hasAttribute('data-add')) setQty(b.getAttribute('data-add'), 1);
    else setQty(b.getAttribute('data-sub'), -1);
  });
  $('open-cart').addEventListener('click', openCart);
  $('close-cart').addEventListener('click', closeCart);
  $('cart-modal').addEventListener('click', function (e) { if (e.target === this) closeCart(); });
  $('modo-retirada').addEventListener('click', function () { modo = 'Retirada'; render(); });
  $('modo-entrega').addEventListener('click', function () { modo = 'Entrega'; render(); });
  ['dg-nome', 'dg-end', 'dg-obs'].forEach(function (id) { $(id).addEventListener('input', render); });

  document.addEventListener('keydown', function (e) {
    if ($('cart-modal').hidden) return;
    if (e.key === 'Escape') { closeCart(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call($('cart-modal').querySelectorAll('button, a[href], input, textarea'), function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  render();
})();
