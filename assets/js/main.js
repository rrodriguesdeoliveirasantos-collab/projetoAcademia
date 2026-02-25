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

  // gerador de exercícios
  async function gerarPlanoIA(objetivo, nivel, dias) {

  const response = await fetch("http://localhost:3000/gerar-treino", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ objetivo, nivel, dias })
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar treino");
  }

  return await response.json();
}

  // Gerar plano
 form.addEventListener('submit', async e => {
  e.preventDefault();

  const objetivo = document.getElementById('objectivo').value;
  const nivel = document.getElementById('level').value;

  if (diasSelecionados.size === 0) {
    alert('Selecione ao menos um dia!');
    return;
  }

  try {
    const plano = await gerarPlanoIA(
      objetivo,
      nivel,
      [...diasSelecionados]
    );

    planoDiv.innerHTML = "";

    plano.treinos.forEach(treino => {

      const diaTitulo = document.createElement('h3');
      diaTitulo.textContent = treino.dia;
      planoDiv.appendChild(diaTitulo);

      treino.exercicios.forEach(ex => {

        const linha = document.createElement('p');
        linha.textContent =
          `${ex.nome} - ${ex.series} séries - ${ex.reps} - Desc: ${ex.descanso}`;

        planoDiv.appendChild(linha);
      });
    });

  } catch (err) {
    alert("Erro ao gerar treino com IA.");
    console.error(err);
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
