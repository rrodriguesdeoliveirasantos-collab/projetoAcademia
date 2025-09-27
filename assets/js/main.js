document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const planoDiv = document.getElementById('plano');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const exportBtn = document.getElementById('exportBtn');

  const botoesDias = document.querySelectorAll('.dia-btn');
  const diasSelecionados = new Set();

  // Botões de dias: selecionar/desmarcar
  botoesDias.forEach(btn => {
    btn.addEventListener('click', () => {
      const dia = btn.dataset.dia;
      if (diasSelecionados.has(dia)) {
        diasSelecionados.delete(dia);
        btn.classList.remove('selecionado');
      } else {
        diasSelecionados.add(dia);
        btn.classList.add('selecionado');
      }
    });
  });

  // Banco de exercícios
  const exercicios = {
    "Peito": [
      { nome: "Supino Reto", nivel: "iniciante" },
      { nome: "Crucifixo", nivel: "intermediario" },
      { nome: "Supino Inclinado", nivel: "avancado" }
    ],
    "Costas": [
      { nome: "Puxada na Barra Fixa", nivel: "intermediario" },
      { nome: "Remada Curvada", nivel: "avancado" }
    ],
    "Pernas": [
      { nome: "Agachamento Livre", nivel: "avancado" },
      { nome: "Leg Press", nivel: "iniciante" }
    ],
    "Biceps": [
      { nome: "Rosca Direta", nivel: "iniciante" },
      { nome: "Rosca Martelo", nivel: "intermediario" }
    ],
    "Triceps": [
      { nome: "Triceps Testa", nivel: "iniciante" },
      { nome: "Triceps Corda", nivel: "intermediario" }
    ]
  };

  // Gerar plano
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nivelSelecionado = document.getElementById('level').value.toLowerCase();
    planoDiv.innerHTML = ""; // limpa plano antigo

    if (diasSelecionados.size === 0) {
      alert('Selecione ao menos um dia!');
      return;
    }

    diasSelecionados.forEach(diaNome => {
      const diaTitulo = document.createElement('h3');
      diaTitulo.textContent = diaNome;
      planoDiv.appendChild(diaTitulo);

      for (const grupo in exercicios) {
        const exFiltrados = exercicios[grupo].filter(
          ex => ex.nivel.toLowerCase() === nivelSelecionado
        );
        if (exFiltrados.length === 0) continue;

        const grupoTitulo = document.createElement('h4');
        grupoTitulo.textContent = grupo;
        planoDiv.appendChild(grupoTitulo);

        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        exFiltrados.forEach(ex => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${ex.nome}</td><td>${ex.nivel}</td>`;
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        planoDiv.appendChild(table);
      }
    });
  });

  // Exportar PDF
  exportBtn.addEventListener('click', () => {
    if (!planoDiv.innerHTML.trim()) {
      alert('Nenhum plano para exportar.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Plano de Treino", 10, y);
    y += 10;

    const dias = planoDiv.querySelectorAll('h3');
    dias.forEach(dia => {
      doc.setFontSize(14);
      doc.text(dia.textContent, 10, y);
      y += 8;

      let next = dia.nextElementSibling;
      while (next && next.tagName !== 'H3') {
        if (next.tagName === 'H4') {
          doc.setFontSize(12);
          doc.text(next.textContent, 12, y);
          y += 6;
        }
        if (next.tagName === 'TABLE') {
          const rows = next.querySelectorAll('tr');
          rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            let line = "";
            cols.forEach(col => line += col.innerText + " | ");
            doc.setFontSize(11);
            doc.text(line.trim(), 14, y);
            y += 6;
          });
          y += 4;
        }
        next = next.nextElementSibling;
      }
      y += 8;
    });

    doc.save("plano_treino.pdf");
  });

  // Salvar plano
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('plano', planoDiv.innerHTML);
    alert('Plano salvo!');
  });

  // Carregar plano
  loadBtn.addEventListener('click', () => {
    const planoSalvo = localStorage.getItem('plano');
    if (planoSalvo) {
      planoDiv.innerHTML = planoSalvo;
    } else {
      alert('Nenhum plano salvo.');
    }
  });
});
