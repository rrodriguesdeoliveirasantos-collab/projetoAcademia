export function validarTreino(plano) {

  const controleVolume = {};

  plano.treinos.forEach(treino => {
    treino.exercicios.forEach(ex => {

      if (!controleVolume[ex.musculo]) {
        controleVolume[ex.musculo] = 0;
      }

      controleVolume[ex.musculo] += ex.series;
    });
  });

  for (const musculo in controleVolume) {
    if (controleVolume[musculo] > 18) {
      throw new Error(`Volume excessivo para ${musculo}`);
    }
  }

  return true;
}