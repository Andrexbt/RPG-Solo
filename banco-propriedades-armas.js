// =====================================================
// Banco de propriedades de armas
// -----------------------------------------------------
// Guarda propriedades especiais das armas. Essas propriedades
// são usadas para explicar a arma na ficha e também para
// regras automáticas, como Acuidade, Leve e Duas mãos.
// =====================================================

window.bancoPropriedadesArmas = {
  alcance: {
    id: "alcance",
    nome: "Alcance",
    descricaoCurta: "Aumenta o alcance corpo a corpo em 5 pés (1,5 m).",
    descricaoLonga:
      "Esta propriedade acrescenta 5 pés ao alcance usado para atacar com a arma e para determinar seu alcance nos ataques de oportunidade.",
  },

  recarga: {
    id: "recarga",
    nome: "Recarga",
    descricaoCurta:
      "Limita o disparo a uma munição por ação, ação bônus ou reação usada para disparar.",
    descricaoLonga:
      "Ao usar uma ação, ação bônus ou reação para disparar esta arma, você só pode disparar uma munição, independentemente de quantos ataques normalmente poderia realizar.",
  },

  // =====================================================
  // Propriedades disponíveis
  // =====================================================
  acuidade: {
    id: "acuidade",
    nome: "Acuidade",
    descricaoCurta: "Permite usar Destreza em vez de Força para ataques e dano com esta arma.",
    descricaoLonga:
      "Uma arma com Acuidade permite escolher entre Força ou Destreza para calcular ataque e dano. O sistema usa automaticamente o melhor modificador disponível para o personagem.",
  },

  arremesso: {
    id: "arremesso",
    nome: "Arremesso",
    descricaoCurta: "A arma pode ser arremessada para atacar à distância.",
    descricaoLonga:
      "Uma arma com Arremesso pode ser usada para atacar à distância, além de ataques corpo a corpo. O sistema calcula automaticamente o alcance da arma e aplica penalidades de distância quando necessário.",
  },

  pesada: {
    id: "pesada",

    nome: "Pesada",

    descricaoCurta: "Exige Força 13 em armas corpo a corpo ou Destreza 13 em armas à distância.",

    descricaoLonga:
      "Uma arma Pesada impõe Desvantagem nas jogadas de ataque se o personagem tiver Força menor que 13 para uma arma corpo a corpo ou Destreza menor que 13 para uma arma à distância.",
  },

  duasMaos: {
    id: "duasMaos",
    nome: "Duas mãos",
    descricaoCurta: "A arma exige duas mãos para ser usada.",
    descricaoLonga:
      "Uma arma com a propriedade Duas mãos requer que o personagem use ambas as mãos para empunhá-la. O sistema garante que ataques com essa arma só sejam possíveis quando o personagem estiver usando as duas mãos.",
  },

  leve: {
    id: "leve",
    nome: "Leve",
    descricaoCurta: "A arma é adequada para combate com duas armas.",
    descricaoLonga:
      "Uma arma com a propriedade Leve é fácil de manejar, tornando-a ideal para combate com duas armas. O sistema permite que o personagem use uma arma leve em cada mão sem penalidades adicionais.",
  },

  municao: {
    id: "municao",
    nome: "Munição",
    descricaoCurta: "A arma usa munição para realizar ataques.",
    descricaoLonga:
      "Cada ataque consome uma munição do tipo indicado pela arma. Carregar uma arma de uma mão exige uma mão livre. Após o combate, gastar 1 minuto permite recuperar metade das munições usadas, arredondando para baixo.",
  },

  versatil: {
    id: "versatil",
    nome: "Versátil",
    descricaoCurta: "A arma pode ser usada com uma ou duas mãos.",
    descricaoLonga:
      "Uma arma com a propriedade Versátil pode ser empunhada com uma ou duas mãos, oferecendo diferentes valores de dano dependendo de como é usada. O sistema calcula automaticamente o dano correto com base na forma de empunhadura escolhida pelo personagem.",
  },
};
