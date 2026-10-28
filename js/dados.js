// Lista base da casa, carregada no primeiro uso. Tudo pode ser editado ou apagado depois.

const SUGESTAO = [
  { nome: 'Alimentos básicos', icone: 'arroz', itens: ['Arroz', 'Feijão', 'Flocão de milho', 'Tabajara', 'Macarrão', 'Tapioca', 'Açúcar', 'Sal', 'Café solúvel', 'Óleo de soja', 'Azeite de oliva', 'Vinagre', 'Leite', 'Leite em pó'] },
  { nome: 'Temperos e condimentos', icone: 'tempero', itens: ['Alho', 'Cebola', 'Pimenta-do-reino', 'Páprica defumada', 'Cominho', 'Açafrão', 'Chimichurri', 'Louro', 'Molho de tomate', 'Ketchup', 'Mostarda', 'Maionese', 'Molho shoyu'] },
  { nome: 'Carnes e proteínas', icone: 'carne', itens: ['Peito de frango', 'Coxa e sobrecoxa', 'Carne moída', 'Carne para bife', 'Ovos', 'Sardinha enlatada'] },
  { nome: 'Frios e laticínios', icone: 'queijo', itens: ['Queijo mussarela', 'Presunto', 'Requeijão', 'Manteiga', 'Iogurte natural', 'Creme de leite', 'Leite condensado'] },
  { nome: 'Pães e café da manhã', icone: 'pao', itens: ['Pão de forma'] },
  { nome: 'Frutas', icone: 'maca', itens: ['Banana', 'Maçã', 'Uva', 'Manga', 'Laranja', 'Limão', 'Abacaxi', 'Morango', 'Tangerina'] },
  // Cebola já está em Temperos; aparece uma vez só.
  { nome: 'Verduras e legumes', icone: 'folha', itens: ['Tomate', 'Cenoura', 'Batata inglesa', 'Aipim', 'Alface', 'Repolho', 'Couve', 'Coentro', 'Cebolinha', 'Salsa'] },
  { nome: 'Congelados e práticos', icone: 'congelado', itens: ['Polpa de frutas'] },
  { nome: 'Lanches e doces', icone: 'doce', itens: ['Milho para pipoca', 'Gelatina'] },
  { nome: 'Bebidas', icone: 'garrafa', itens: ['Água mineral (galão de 20 L)', 'Refrigerante'] },
  { nome: 'Produtos de limpeza', icone: 'limpeza', itens: ['Detergente', 'Sabão em pó', 'Amaciante', 'Água sanitária', 'Desinfetante', 'Limpador multiuso', 'Álcool 70%', 'Desengordurante (Cif)', 'Sabão em barra', 'Esponja', 'Palha de aço', 'Sacos de lixo'] },
  { nome: 'Higiene pessoal', icone: 'sabonete', itens: ['Papel higiênico', 'Sabonete líquido', 'Shampoo', 'Condicionador', 'Máscara capilar', 'Creme de pentear', 'Creme dental', 'Escova de dentes', 'Fio dental', 'Desodorante', 'Hidratante corporal', 'Protetor solar', 'Absorvente', 'Algodão', 'Cotonetes', 'Espuma de barbear'] },
  { nome: 'Utilidades domésticas', icone: 'casa', itens: ['Papel-toalha', 'Papel-alumínio', 'Papel-filme', 'Papel-manteiga', 'Aromatizador de ambiente'] },
];
