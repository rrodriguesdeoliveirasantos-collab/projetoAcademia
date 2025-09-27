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
    const { jsPDF }  = windows.jsPDF;
    const doc = new jsPDF ();
    //captura o titulo e as tabelas
    doc.setFrontSize(16);
    doc.text("Plano de Treino", 10, y);
    y += 10;
    //pega os dias
    const dias  = planoDiv.querySelectorAll("h3");
    dias.forEach((dia, index) => {
      doc.setFrontSize(14);
      doc.text(dia.textContent, 10 y);
      y+= 8;

      const rows = dia.nextElementSibling.querySelectorAll("tr");
      rows.forEach((row, i) => {
        const cols = row.querySelectorAll("td, th");
        let textLine = "";
        cols.forEach(col => {
          textLine += col.innerText + " | ";
        });

        doc.setFrontSize(11);
        doc.text(textLine.trim(), 12, y);
        y += 6;
      });

      y += 8; //espaço entre linhas
    });
    // baixa o arquivo
    doc.save("plano_treino.pdf");
  });
