# Projeto: LogiStream - Serviço `orders-api` v1.0.0

## Objetivo

Atuar como o dono do domínio de pedidos, responsável por gerenciar o ciclo de vida (CRUD) dos pedidos no MongoDB e orquestrar a comunicação de mudanças de estado com o ecossistema via Kafka, operando de forma isolada e orientada a eventos.

## MoSCoW

### 🟢 Must Have
- **Configuração do Ecossistema**: Setup do projeto NestJS integrado com Mongoose (MongoDB) e o microserviço nativo do NestJS para o Kafka (`ClientKafka`).
- **Modelagem de Dados**: Criação do Schema/Model no Mongoose (`Order` e `OrderItem`), estabelecendo o contrato de dados e validação de status (`PENDING`, `IN_TRANSIT`, `DELIVERED`, `DELAYED`, `CANCELED`).
- **Criação de Pedidos (REST)**: Endpoint `POST /orders` que recebe o payload inicial do usuário (com `productId` e quantidades).
- **Integração com Catálogo (Síncrona)**: Uso do `HttpModule` (Axios) para buscar em tempo real o preço atualizado e o nome do produto no serviço de Catálogo durante a criação do pedido. Catálogo mockado inicialmente.
- **Leitura de Pedidos (REST)**: Endpoints `GET /orders` e `GET /orders/:id` para consulta por parte dos usuários.
- **Emissão de Eventos (Producer)**: Publicar o evento `logistream.orders.status-changed ` no Kafka sempre que houver alteração de status consolidada no banco.
- **Consumo de Eventos (Consumer)**: Assinar e processar os eventos `logistics.route.delayed` e `logistics.order.delivered` vindos do Kafka para atualizar o banco de dados. Logistics mockado inicialmente.
- **Testabilidade**: Configuração inicial de testes unitários com Jest/Vitest, focando em atingir a meta de 80% de cobertura nas regras de negócio e validações de status.

### 🟡 Should Have
- **Validação de Entrada**: Uso de `class-validator` e `class-transformer` nos DTOs para garantir que requisições malformadas sejam barradas antes de chegar ao controller.
- **Cancelamento Seguro**: Endpoint `PATCH /orders/:id/cancel` implementando *Soft Delete* (mudando o status para **CANCELED** e gravando a data de cancelamento), preservando o histórico em vez de deletar o documento.
- **Documentação Viva**: Configuração do `@nestjs/swagger` para gerar automaticamente a documentação das rotas HTTP, facilitando testes e futuras integrações com front-ends.

### 🔵 Could Have
- **Resiliência Básica de Rede**: Implementação de um mecanismo simples de Retry (retentativas) na chamada HTTP do Axios, caso o serviço de Catálogo apresente instabilidade momentânea.
- **Testes de Mutação**: Configuração do Stryker para rodar sobre a suíte de testes unitários, garantindo que os 80% de cobertura representam códigos verdadeiramente testados contra falhas lógicas.
- **Tratamento Centralizado de Erros**: Criação de Exception Filters no NestJS para padronizar as respostas de erro (ex: transformar erros de validação do Mongoose em HTTP 400 consistentes).

### 🔴 Won't Have
- **Padrão Transactional Outbox**: O risco de inconsistência em caso de falha de rede exatamente entre o save do MongoDB e o emit do Kafka será aceito no MVP.
- **Replicação de Dados/Cache Local**: Não haverá consumo de tópicos para salvar um cache de produtos no banco do `orders-api`. A dependência do Catálogo será estritamente via rede.
- **Gestão de Identidade**: O banco não terá coleções de `Users`. A segurança e dados do usuário serão representados apenas pela string de referência `customerId`.