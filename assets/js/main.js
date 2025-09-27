document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const planoDiv = document.getElementById('plano');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const exportBtn = document.getElementById('exportBtn');
  // Exportar pdf
  exportBtn.addEventListener('click', () => {
    if (!planoDiv.innerHTML.trim()) {
      alert('Nenhum plano para exportar.');
      return; // primeira pesquisa
    }
    //criar doc
    const { jsPDF }  = window.jspdf;
    const doc = new jsPDF ();
    let y = 10; //posiçao inicial
    
    //captura o titulo e as tabelas
    doc.setFontSize(16);
    doc.text("Plano de Treino", 10, y);
    y += 10;
    //pega os dias
    const dias  = planoDiv.querySelectorAll("h3");
    dias.forEach((dia, index) => {
      doc.setFontSize(14);
      doc.text(dia.textContent, 10, y);
      y += 8;

      const rows = dia.nextElementSibling.querySelectorAll("tr");
      rows.forEach((row, i) => {
        const cols = row.querySelectorAll("td, th");
        let textLine = "";
        cols.forEach(col => {
          textLine += col.innerText + " | ";
        });

        doc.setFontSize(11);
        doc.text(textLine.trim(), 12, y);
        y += 6;
      });

      y += 8; //espaço entre linhas
    });
    // baixa o arquivo
    doc.save("plano_treino.pdf");
  });

  const exercicios = {
  "Peito": [
    { nome: "Supino Reto", nivel: "Iniciante" },
    { nome: "Crucifixo", nivel: "Intermediário" },
    { nome: "Supino Inclinado", nivel: "Avançado" }
  ],
  "Costas": [
    { nome: "Puxada na Barra Fixa", nivel: "Intermediário" },
    { nome: "Remada Curvada", nivel: "Avançado" }
  ],
  "Pernas": [
    { nome: "Agachamento Livre", nivel: "Avançado" },
    { nome: "Leg Press", nivel: "Iniciante" }
  ],
  "Bíceps": [
    { nome: "Rosca Direta", nivel: "Iniciante" },
    { nome: "Rosca Martelo", nivel: "Intermediário" }
  ],
  "Tríceps": [
    { nome: "Tríceps testa", nivel: "Iniciante" },
    { nome: "Tríceps corda", nivel: "Intermediário" }
  ] 
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const nivel = document.getElementById('level').value;
  planoDiv.innerHTML = ""; // limpa plano antigo

  for (const grupo in exercicios) {
    // Filtra por nível
    const exFiltrados = exercicios[grupo].filter(ex => ex.nivel.toLowerCase() === nivel.toLowerCase());
    if (exFiltrados.length === 0) continue;

    // Cria título do grupo
    const h3 = document.createElement('h3');
    h3.textContent = grupo;
    planoDiv.appendChild(h3);

    // Cria tabela
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