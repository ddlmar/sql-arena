export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  expectedQuery: string;
  placeholderSql: string;
  hints: string[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Visualizar Todos os Produtos',
    description:
      'Selecione todos os campos (todas as colunas) de todos os itens cadastrados na tabela de produtos.',
    difficulty: 'Fácil',
    expectedQuery: 'SELECT * FROM produtos',
    placeholderSql: '-- Escreva seu SQL aqui\nSELECT',
    hints: [
      'Use o caractere curinga * para selecionar todas as colunas.',
      'A tabela de destino é "produtos".',
      'A sintaxe básica é: SELECT * FROM nome_da_tabela;',
    ],
  },
  {
    id: 2,
    title: 'Filtrar Usuários por Cidade',
    description:
      'Selecione apenas o nome e o email de todos os usuários que moram na cidade de "São Paulo".',
    difficulty: 'Fácil',
    expectedQuery: "SELECT nome, email FROM usuarios WHERE cidade = 'São Paulo'",
    placeholderSql: '-- Filtre os usuários paulistas\nSELECT nome, email FROM',
    hints: [
      'Você deve selecionar apenas as colunas "nome" e "email" (separadas por vírgula).',
      'Use a cláusula WHERE para filtrar registros.',
      "Lembre-se de colocar a string 'São Paulo' entre aspas simples.",
    ],
  },
  {
    id: 3,
    title: 'Ordenar Produtos por Preço',
    description:
      'Obtenha o nome e o preco de todos os produtos, ordenando-os do mais barato (menor preço) para o mais caro (maior preço).',
    difficulty: 'Fácil',
    expectedQuery: 'SELECT nome, preco FROM produtos ORDER BY preco ASC',
    placeholderSql: '-- Ordene os produtos por preço\nSELECT nome, preco FROM produtos',
    hints: [
      'Use a cláusula ORDER BY no final da sua consulta.',
      'Para ordenar de forma crescente (do menor para o maior), use a palavra-chave ASC (ou deixe sem, pois é o padrão).',
      'A coluna a ser ordenada é "preco".',
    ],
  },
  {
    id: 4,
    title: 'Contagem de Usuários por Cidade',
    description:
      'Agrupe os usuários pela cidade em que moram e exiba a cidade e a quantidade total de usuários em cada uma. Nomeie a coluna de contagem como "total_usuarios".',
    difficulty: 'Médio',
    expectedQuery: 'SELECT cidade, COUNT(*) AS total_usuarios FROM usuarios GROUP BY cidade',
    placeholderSql: '-- Agrupe e conte os usuários\nSELECT cidade,',
    hints: [
      'Use a função de agregação COUNT(*) para contar os registros.',
      'Renomeie a contagem usando a palavra-chave AS: COUNT(*) AS total_usuarios.',
      'Não se esqueça de usar a cláusula GROUP BY com a coluna "cidade" para que a agregação funcione.',
    ],
  },
  {
    id: 5,
    title: 'Juntar Pedidos com Usuários',
    description:
      'Liste o ID do pedido, a data do pedido, o nome do usuário comprador e o valor total de todos os pedidos que possuem o status "Entregue".',
    difficulty: 'Médio',
    expectedQuery:
      "SELECT p.id, p.data_pedido, u.nome, p.valor_total FROM pedidos p JOIN usuarios u ON p.usuario_id = u.id WHERE p.status = 'Entregue'",
    placeholderSql: '-- Use JOIN para juntar as tabelas\nSELECT',
    hints: [
      'Você precisará fazer um INNER JOIN (ou apenas JOIN) entre a tabela "pedidos" (p) e a tabela "usuarios" (u).',
      'A condição de junção no ON é que pedidos.usuario_id seja igual a usuarios.id.',
      "Filtre pelo status usando WHERE status = 'Entregue'.",
    ],
  },
  {
    id: 6,
    title: 'Produtos com Baixo Estoque',
    description:
      'Liste o nome, a categoria e o estoque de todos os produtos que possuem menos de 20 unidades em estoque, ordenados de forma decrescente (do maior estoque para o menor).',
    difficulty: 'Médio',
    expectedQuery:
      'SELECT nome, categoria, estoque FROM produtos WHERE estoque < 20 ORDER BY estoque DESC',
    placeholderSql: '-- Filtre e ordene de forma decrescente\nSELECT',
    hints: [
      'Filtre registros com estoque menor que 20 usando: WHERE estoque < 20.',
      'Ordene de forma decrescente usando a cláusula ORDER BY com a palavra-chave DESC.',
      'A consulta deve retornar exatamente as colunas "nome", "categoria" e "estoque".',
    ],
  },
  {
    id: 7,
    title: 'Faturamento Total por Categoria',
    description:
      'Calcule o faturamento total obtido (a soma de quantidade multiplicada pelo preco_unitario de cada item comprado) para cada categoria de produto. Exiba a categoria e a soma total formatada com o nome de "faturamento_total".',
    difficulty: 'Difícil',
    expectedQuery:
      'SELECT p.categoria, SUM(i.quantidade * i.preco_unitario) AS faturamento_total FROM itens_pedido i JOIN produtos p ON i.produto_id = p.id GROUP BY p.categoria',
    placeholderSql: '-- Calcule o faturamento agrupando por categoria\nSELECT',
    hints: [
      'Faça uma junção entre "itens_pedido" (i) e "produtos" (p) pelo ID do produto.',
      'Use SUM(quantidade * preco_unitario) para calcular a receita total.',
      'Agrupe o resultado usando GROUP BY p.categoria.',
    ],
  },
  {
    id: 8,
    title: 'Clientes de Alto Valor (Gasto > R$ 3000)',
    description:
      'Identifique os nomes dos clientes e a soma total gasta por eles em todos os seus pedidos combinados. Filtre o resultado para exibir apenas os clientes que gastaram mais de R$ 3000 no total. Nomeie a coluna de soma como "total_gasto".',
    difficulty: 'Difícil',
    expectedQuery:
      'SELECT u.nome, SUM(p.valor_total) AS total_gasto FROM pedidos p JOIN usuarios u ON p.usuario_id = u.id GROUP BY u.nome HAVING SUM(p.valor_total) > 3000',
    placeholderSql: '-- Use HAVING para filtrar o agrupamento\nSELECT',
    hints: [
      'Junte "pedidos" com "usuarios" para obter o nome do cliente.',
      'Use SUM(valor_total) AS total_gasto e agrupe pelo nome do usuário (GROUP BY u.nome).',
      'Para filtrar uma função agregada, você DEVE usar a cláusula HAVING (ex: HAVING SUM(valor_total) > 3000) em vez do WHERE.',
    ],
  },
  {
    id: 9,
    title: 'Produtos Nunca Vendidos',
    description:
      'Selecione o nome de todos os produtos que nunca foram vendidos (ou seja, não possuem nenhum registro correspondente na tabela "itens_pedido").',
    difficulty: 'Difícil',
    expectedQuery:
      'SELECT p.nome FROM produtos p LEFT JOIN itens_pedido i ON p.id = i.produto_id WHERE i.produto_id IS NULL',
    placeholderSql: '-- Descubra produtos sem nenhuma venda\nSELECT',
    hints: [
      'Uma forma clássica é usar LEFT JOIN da tabela "produtos" (esquerda) com "itens_pedido" (direita) pelo ID do produto.',
      'Ao fazer o LEFT JOIN, produtos não vendidos terão valores nulos nos campos da tabela "itens_pedido".',
      'Filtre com WHERE i.produto_id IS NULL (ou use NOT IN com uma subquery: WHERE id NOT IN (SELECT produto_id FROM itens_pedido)).',
    ],
  },
];
