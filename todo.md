# GCALHAS - Sistema de Orçamento de Calhas e Rufos

## Arquitetura e Banco de Dados
- [x] Definir schema de banco de dados (produtos, materiais, preços, orçamentos, itens)
- [x] Criar migrations e seed data com produtos e materiais padrão

## Backend - Procedures tRPC
- [x] Criar procedure para listar produtos e materiais disponíveis
- [x] Criar procedure para calcular orçamento (validar dimensões e preços)
- [x] Criar procedure para salvar orçamento no banco de dados
- [x] Criar procedure para listar orçamentos do usuário autenticado
- [x] Criar procedure para gerar descrição de produtos via LLM
- [x] Criar procedure para gerar PDF do orçamento
- [x] Criar procedure para notificar proprietário sobre novo orçamento
- [x] Criar procedures administrativas para gerenciar preços e materiais

## Frontend - Página Inicial e Formulário
- [x] Criar layout elegante com navegação e branding GCALHAS
- [x] Desenvolver formulário interativo para seleção de produtos
- [x] Implementar seleção de tipos (calhas, rufos, pingadeiras)
- [x] Implementar seleção de materiais
- [x] Criar calculadora de medidas (comprimento, largura, altura)
- [x] Implementar cálculo automático de m² (largura x comprimento)

## Frontend - Calculadora e Orçamento
- [x] Integrar cálculo de preço baseado em material e dimensões
- [x] Implementar sistema de quantidade de itens
- [x] Criar visualização de resumo do orçamento em tempo real
- [x] Implementar lista de itens selecionados com valores individuais
- [x] Calcular e exibir valor total do orçamento

## Frontend - Geração de PDF
- [x] Integrar geração de PDF com descrições por LLM
- [x] Implementar botão de download do orçamento em PDF
- [x] Implementar botão de impressão do orçamento
- [x] Validar formatação e qualidade do PDF

## Frontend - Histórico e Autenticação
- [x] Implementar página de histórico de orçamentos
- [x] Criar listagem com filtros e busca
- [x] Implementar visualização detalhada de orçamentos anteriores
- [x] Integrar autenticação (login/logout)
- [x] Proteger rotas de usuário autenticado

## Painel Administrativo
- [x] Criar layout do painel administrativo
- [x] Implementar gerenciamento de produtos
- [x] Implementar gerenciamento de materiais
- [x] Implementar gerenciamento de preços (R$ 130, R$ 140, R$ 150)
- [x] Criar interface para visualizar orçamentos criados
- [x] Implementar controle de acesso (apenas admin)

## Notificações
- [x] Integrar sistema de notificação ao proprietário
- [x] Enviar notificação ao criar novo orçamento
- [ ] Enviar notificação ao solicitar orçamento por cliente

## Design e UX
- [x] Aplicar estilo elegante e perfeito em todas as páginas
- [x] Implementar design responsivo (mobile, tablet, desktop)
- [x] Criar paleta de cores profissional
- [x] Adicionar animações e transições suaves
- [x] Testar usabilidade em diferentes dispositivos

## Testes
- [x] Escrever testes unitários para procedures tRPC
- [x] Testar cálculos de preço e m²
- [x] Testar geração de PDF
- [x] Testar fluxo completo de orçamento
- [x] Validar notificações ao proprietário

## Deploy e Finalização
- [x] Revisar todas as funcionalidades
- [x] Criar checkpoint final
- [x] Entregar site ao usuário


## Integração WhatsApp/Telefone (Nova Funcionalidade)
- [x] Adicionar campo de telefone na tabela de orçamentos
- [x] Validar formato de telefone no formulário
- [x] Adicionar campo de telefone no formulário de orçamento
- [x] Exibir telefone no histórico de orçamentos
- [x] Exibir telefone nos detalhes do orçamento
- [x] Adicionar link WhatsApp direto no painel administrativo
- [x] Integrar telefone nas notificações ao proprietário
- [x] Testar validação e funcionamento do WhatsApp
