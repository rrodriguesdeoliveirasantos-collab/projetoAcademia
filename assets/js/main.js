document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const planoDiv = document.getElementById('plano');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const exportBtn = document.getElementById('exportBtn');

  // Banco de exercícios por grupo e nível (valores sem acento)
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

  // Função para gerar o plano
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nivelSelecionado = document.getElementById('level').value.toLowerCase();
    const dias = parseInt(document.getElementById('days').value);
    planoDiv.innerHTML = ""; // limpa plano antigo

    for (let d = 1; d <= dias; d++) {
      const diaTitulo = document.createElement('h3');
      diaTitulo.textContent = `Dia ${d}`;
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
    }
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

      y += 8; // espaço entre dias
    });

    doc.save("plano_treino.pdf");
  });

  // Salvar plano no localStorage
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('plano', planoDiv.innerHTML);
    alert('Plano salvo!');
  });

  // Carregar plano do localStorage
  loadBtn.addEventListener('click', () => {
    const planoSalvo = localStorage.getItem('plano');
    if (planoSalvo) {
      planoDiv.innerHTML = planoSalvo;
    } else {
      alert('Nenhum plano salvo.');
    }
  });
});
