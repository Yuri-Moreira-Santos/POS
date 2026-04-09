export type StatusAbastecimento = "pendente" | "pago" | "faturado";

export interface ClienteFaturado {
  placa: string;
  cnpj: string;
  empresa: string;
}

export const clientesFaturados: ClienteFaturado[] = [
  { placa: "ABC-1234", cnpj: "12.345.678/0001-99", empresa: "Transportes Silva Ltda" },
  { placa: "DEF-5678", cnpj: "98.765.432/0001-11", empresa: "Logística Verde S.A." },
  { placa: "GHI-9012", cnpj: "45.678.901/0001-55", empresa: "Frota Rápida ME" },
];

export function buscarClientePorPlaca(placa: string): ClienteFaturado | null {
  const normalized = placa.replace(/\s/g, "").toUpperCase();
  return clientesFaturados.find(
    (c) => c.placa.replace("-", "").toUpperCase() === normalized.replace("-", "")
  ) ?? null;
}

export type FormaPagamento = "pix" | "credito" | "debito" | "dinheiro";

export interface Abastecimento {
  id: string;
  bomba: string;
  bico: string;
  combustivel: string;
  litros: number;
  preco: number;
  hora: string;
  status: StatusAbastecimento;
}

export interface ItemAdicional {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  tipo?: string;
}

export interface Venda {
  abastecimento: Abastecimento;
  itensAdicionais: ItemAdicional[];
  cpf?: string;
  cnpj?: string;
  formaPagamento?: FormaPagamento;
  total: number;
}

export const abastecimentosPendentes: Abastecimento[] = [
  {
    id: "1",
    bomba: "Bomba 2",
    bico: "Bico 2",
    combustivel: "Gasolina Comum",
    litros: 12.5,
    preco: 50.0,
    hora: "10:45",
    status: "pendente",
  },
  {
    id: "2",
    bomba: "Bomba 1",
    bico: "Bico 3",
    combustivel: "Gasolina Comum",
    litros: 12.5,
    preco: 20.0,
    hora: "10:46",
    status: "pendente",
  },
  {
    id: "3",
    bomba: "Bomba 3",
    bico: "Bico 4",
    combustivel: "Gasolina Comum",
    litros: 12.5,
    preco: 59.0,
    hora: "10:45",
    status: "pendente",
  },
  {
    id: "4",
    bomba: "Bomba 1",
    bico: "Bico 2",
    combustivel: "Etanol",
    litros: 17,
    preco: 70.0,
    hora: "10:45",
    status: "pendente",
  },
  {
    id: "5",
    bomba: "Bomba 2",
    bico: "Bico 2",
    combustivel: "Gasolina Aditivada",
    litros: 120.5,
    preco: 500.0,
    hora: "10:45",
    status: "pendente",
  },
];

export const abastecimentosProcessados: Abastecimento[] = [
  {
    id: "6",
    bomba: "Bomba 2",
    bico: "Bico 3",
    combustivel: "Gasolina Comum",
    litros: 32.2,
    preco: 120.0,
    hora: "10:30",
    status: "pago",
  },
  {
    id: "7",
    bomba: "Bomba 2",
    bico: "Bico 3",
    combustivel: "Gasolina Comum",
    litros: 32.2,
    preco: 120.0,
    hora: "10:30",
    status: "faturado",
  },
  {
    id: "8",
    bomba: "Bomba 2",
    bico: "Bico 3",
    combustivel: "Gasolina Comum",
    litros: 32.2,
    preco: 120.0,
    hora: "10:30",
    status: "pago",
  },
  {
    id: "9",
    bomba: "Bomba 2",
    bico: "Bico 3",
    combustivel: "Gasolina Comum",
    litros: 32.2,
    preco: 120.0,
    hora: "10:30",
    status: "faturado",
  },
];

export const itensAdicionaisDisponiveis: Omit<ItemAdicional, "quantidade">[] = [
  { id: "a1", nome: "Aditivo", preco: 20.0 },
  { id: "a2", nome: "Lavagem", preco: 35.0, tipo: "Completa" },
  { id: "a3", nome: "Óleo Motor", preco: 45.0 },
  { id: "a4", nome: "Pano de Limpeza", preco: 8.0 },
  { id: "a5", nome: "Aromatizante", preco: 15.0 },
];

export const turnoAtual = {
  responsavel: "João Silva",
  versao: "v2.1.4",
};
