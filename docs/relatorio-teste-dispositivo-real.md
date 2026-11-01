# Relatório de teste em dispositivo real (F4-04)

Issue: [#23](https://github.com/PI2-2026-2-equipe-03/pi2-frontend/issues/23)

**Situação:** validação no computador e no celular concluída, com as evidências abaixo.

## Ambiente

| Item | Valor |
| --- | --- |
| Computador | Windows 11, stack via Docker (`pi2-backend` e `pi2-frontend`) |
| Endereço na rede local | `http://192.168.2.14:5173` |
| Backend | `TRUSTED_ORIGINS=http://localhost:5173,http://192.168.2.14:5173` |
| Celular (modelo e sistema) | Samsung Galaxy S24 (SM-S921B/DS), Android 16, One UI 8.5 |
| Navegador do celular | Chrome |
| Data do teste no celular | 01/11/2026, das 16:07 às 16:36 (horário visível nos prints) |

## Como acessar pelo celular

1. Conecte o celular e o computador à mesma rede.
2. Descubra o IP do computador e inclua a origem no `.env` do backend:
   `TRUSTED_ORIGINS=http://localhost:5173,http://SEU_IP:5173`
3. Recrie o container com `docker compose up -d backend`.
4. Abra `http://SEU_IP:5173` no navegador do celular.

Sem o passo 2, o login retorna `403 INVALID_ORIGIN`.

## Telas integradas

| Tela | Rota | Endpoint | Perfil |
| --- | --- | --- | --- |
| Dashboard | `/admin` | `GET /admin/metrics` | ADM |
| Dashboard | `/admin` | `GET /manager/metrics` | CLI |
| Meu perfil | `/app/perfil` | `GET /me` | Todos |
| Solicitar gestão | `/app/solicitar-gestor` | `POST /manager-requests` | USR |

## Validação no computador

Testes com a API real e o banco local. As telas foram abertas em `localhost`, em um iframe de 390 px para aplicar os breakpoints de mobile. **Isso não substitui o teste no aparelho.**

| Verificação | Resultado |
| --- | --- |
| Login pelo IP com origem `http://192.168.2.14:5173` | Aceita: chega à validação de senha (`401` com senha errada); antes da mudança era `403` |
| Login pelo IP com origem não autorizada | Recusada com `403 INVALID_ORIGIN` |
| Tela de login aberta por `http://192.168.2.14:5173` no computador | Carregou sem erros no console |
| Dashboard como ADM | Cards e ranking com dados da API, sem rolagem horizontal |
| Dashboard como CLI | Cards e rankings com dados da API, sem rolagem horizontal |
| `GET /admin/metrics` como CLI | `403` |
| Meu perfil como ADM, CLI e USR | Nome, e-mail e perfil corretos; atalho de solicitação só para USR |
| Menu do USR | Mostra "Solicitar gestão" e não mostra "Gestão" |
| Solicitar gestão como CLI | Tela de acesso não permitido |
| Formulário vazio | Mensagens de validação nos campos obrigatórios |
| Máscaras de CPF, CNPJ, CEP, quantidade e UF | Valores formatados corretamente |
| Envio válido | Confirmação com a mensagem do backend |
| Segundo envio do mesmo usuário | `409`, mensagem na tela e dados mantidos no formulário |

Não testado: modo mock (`VITE_USE_MOCKS=true`) e estado de erro de carregamento das telas.

## Validação no celular

- [x] A aplicação abre pelo IP da rede local
- [x] Login com usuário válido funciona (ADM, CLI e USR)
- [x] Dashboard (ADM e CLI) mostra dados da API, sem conteúdo cortado na largura da tela
- [x] Meu perfil mostra os dados do usuário logado
- [x] Solicitar gestão: teclado numérico nos campos de CPF, CNPJ, CEP e quantidade (confirmado no aparelho; o print mostra o campo de CPF)
- [x] Solicitar gestão: envio mostra a confirmação

## Evidências

Dados fictícios no formulário. Os valores dos dashboards vêm do banco local de teste.

| Tela | Print |
| --- | --- |
| Acesso pelo IP | [1-acesso-ip.jpg](prints/f4-04/1-acesso-ip.jpg) |
| Dashboard ADM, cards | [2-dashboard-adm.1.jpg](prints/f4-04/2-dashboard-adm.1.jpg) |
| Dashboard ADM, ranking | [2-dashboard-adm.2.jpg](prints/f4-04/2-dashboard-adm.2.jpg) |
| Dashboard CLI, cards | [3-dashboard-gestor.1.jpg](prints/f4-04/3-dashboard-gestor.1.jpg) |
| Dashboard CLI, rankings | [3-dashboard-gestor.2.jpg](prints/f4-04/3-dashboard-gestor.2.jpg) |
| Meu perfil (USR) | [4-meu-perfil.jpg](prints/f4-04/4-meu-perfil.jpg) |
| Solicitar gestão, início do formulário | [5-solicitar-gestao.1.jpg](prints/f4-04/5-solicitar-gestao.1.jpg) |
| Solicitar gestão, fim do formulário | [5-solicitar-gestao.2.jpg](prints/f4-04/5-solicitar-gestao.2.jpg) |
| Solicitar gestão, teclado numérico | [5-solicitar-gestao-teclado.3.jpg](prints/f4-04/5-solicitar-gestao-teclado.3.jpg) |
| Solicitação recebida | [6-solicitacao-recebida.jpg](prints/f4-04/6-solicitacao-recebida.jpg) |

## Limitações conhecidas

- O backend não tem `GET` da solicitação de gestão. Ao recarregar a página, o formulário volta, e um novo envio recebe `409`.
- CPF e CNPJ têm só o tamanho validado, como no backend. Os dígitos verificadores não são conferidos.
- "Quadras mais acessadas" e "Horários de pico" ficam vazios até haver downloads de replays.
- Meu perfil é somente leitura: o `GET /me` não devolve telefone e não existe rota de edição.
