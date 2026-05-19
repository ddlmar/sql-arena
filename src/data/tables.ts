export interface TableSchema {
  name: string;
  columns: { name: string; type: string; description: string }[];
}

export type QueryResultRow = Record<string, string | number | boolean | null>;

export const DB_SCHEMA: TableSchema[] = [
  {
    name: 'usuarios',
    columns: [
      { name: 'id', type: 'INT', description: 'ID único do usuário' },
      { name: 'nome', type: 'VARCHAR', description: 'Nome completo do usuário' },
      { name: 'email', type: 'VARCHAR', description: 'Endereço de e-mail do usuário' },
      {
        name: 'data_cadastro',
        type: 'DATE',
        description: 'Data de cadastro do usuário (AAAA-MM-DD)',
      },
      { name: 'cidade', type: 'VARCHAR', description: 'Cidade de residência' },
    ],
  },
  {
    name: 'produtos',
    columns: [
      { name: 'id', type: 'INT', description: 'ID único do produto' },
      { name: 'nome', type: 'VARCHAR', description: 'Nome do produto' },
      { name: 'categoria', type: 'VARCHAR', description: 'Categoria do produto' },
      { name: 'preco', type: 'DECIMAL(10,2)', description: 'Preço unitário do produto' },
      { name: 'estoque', type: 'INT', description: 'Quantidade disponível no estoque' },
    ],
  },
  {
    name: 'pedidos',
    columns: [
      { name: 'id', type: 'INT', description: 'ID único do pedido' },
      {
        name: 'usuario_id',
        type: 'INT',
        description: 'ID do usuário que fez o pedido (Chave Estrangeira)',
      },
      {
        name: 'data_pedido',
        type: 'DATE',
        description: 'Data em que o pedido foi realizado (AAAA-MM-DD)',
      },
      {
        name: 'valor_total',
        type: 'DECIMAL(10,2)',
        description: 'Valor total cobrado pelo pedido',
      },
      {
        name: 'status',
        type: 'VARCHAR',
        description: 'Status do pedido (Entregue, Pendente, Cancelado)',
      },
    ],
  },
  {
    name: 'itens_pedido',
    columns: [
      { name: 'id', type: 'INT', description: 'ID único do item do pedido' },
      { name: 'pedido_id', type: 'INT', description: 'ID do pedido associado (Chave Estrangeira)' },
      {
        name: 'produto_id',
        type: 'INT',
        description: 'ID do produto associado (Chave Estrangeira)',
      },
      { name: 'quantidade', type: 'INT', description: 'Quantidade comprada do produto' },
      {
        name: 'preco_unitario',
        type: 'DECIMAL(10,2)',
        description: 'Preço cobrado pela unidade do produto no momento da compra',
      },
    ],
  },
];

export const DB_MOCK_DATA: Record<string, QueryResultRow[]> = {
  usuarios: [
    {
      id: 1,
      nome: 'Ana Souza',
      email: 'ana@email.com',
      data_cadastro: '2026-01-10',
      cidade: 'São Paulo',
    },
    {
      id: 2,
      nome: 'Lucas Lima',
      email: 'lucas@email.com',
      data_cadastro: '2026-02-14',
      cidade: 'Rio de Janeiro',
    },
    {
      id: 3,
      nome: 'Carla Diaz',
      email: 'carla@email.com',
      data_cadastro: '2026-03-01',
      cidade: 'Belo Horizonte',
    },
    {
      id: 4,
      nome: 'Bruno Alves',
      email: 'bruno@email.com',
      data_cadastro: '2026-03-15',
      cidade: 'São Paulo',
    },
    {
      id: 5,
      nome: 'Mariana Costa',
      email: 'mariana@email.com',
      data_cadastro: '2026-04-20',
      cidade: 'Porto Alegre',
    },
  ],
  produtos: [
    { id: 1, nome: 'Notebook Pro', categoria: 'Eletrônicos', preco: 4500.0, estoque: 15 },
    { id: 2, nome: 'Smartphone X', categoria: 'Eletrônicos', preco: 2999.9, estoque: 30 },
    { id: 3, nome: 'Teclado Mecânico', categoria: 'Acessórios', preco: 350.0, estoque: 50 },
    { id: 4, nome: 'Monitor UltraWide', categoria: 'Eletrônicos', preco: 1800.0, estoque: 8 },
    { id: 5, nome: 'Mouse Gamer', categoria: 'Acessórios', preco: 199.9, estoque: 100 },
    { id: 6, nome: 'Cadeira Ergonômica', categoria: 'Móveis', preco: 1200.0, estoque: 12 },
  ],
  pedidos: [
    { id: 101, usuario_id: 1, data_pedido: '2026-04-05', valor_total: 4850.0, status: 'Entregue' },
    { id: 102, usuario_id: 2, data_pedido: '2026-04-12', valor_total: 2999.9, status: 'Entregue' },
    { id: 103, usuario_id: 1, data_pedido: '2026-04-18', valor_total: 199.9, status: 'Pendente' },
    { id: 104, usuario_id: 3, data_pedido: '2026-04-22', valor_total: 1200.0, status: 'Cancelado' },
    { id: 105, usuario_id: 4, data_pedido: '2026-05-02', valor_total: 3349.9, status: 'Entregue' },
    { id: 106, usuario_id: 5, data_pedido: '2026-05-10', valor_total: 1800.0, status: 'Pendente' },
  ],
  itens_pedido: [
    { id: 1, pedido_id: 101, produto_id: 1, quantidade: 1, preco_unitario: 4500.0 },
    { id: 2, pedido_id: 101, produto_id: 3, quantidade: 1, preco_unitario: 350.0 },
    { id: 3, pedido_id: 102, produto_id: 2, quantidade: 1, preco_unitario: 2999.9 },
    { id: 4, pedido_id: 103, produto_id: 5, quantidade: 1, preco_unitario: 199.9 },
    { id: 5, pedido_id: 104, produto_id: 6, quantidade: 1, preco_unitario: 1200.0 },
    { id: 6, pedido_id: 105, produto_id: 2, quantidade: 1, preco_unitario: 2999.9 },
    { id: 7, pedido_id: 105, produto_id: 3, quantidade: 1, preco_unitario: 350.0 },
    { id: 8, pedido_id: 106, produto_id: 4, quantidade: 1, preco_unitario: 1800.0 },
  ],
};
