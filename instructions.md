[Versão: 1]
[Modificações: Estruturação do requisito, eliminação de ambiguidades, definição clara de escopo para ESLint, Jest e testes unitários sem introduzir especulação.]

# Qualidade de Código e Padronização

## ESLint

Adicionar **ESLint atualizado** ao projeto com objetivo de:

- padronizar o estilo de código
- reduzir inconsistências
- manter legibilidade e previsibilidade do código
- aplicar formatação automática sempre que possível

Requisitos:

- utilizar uma configuração **moderna e compatível com a stack atual**
- evitar regras excessivamente restritivas que gerem fricção desnecessária
- priorizar regras relacionadas a:
  - qualidade de código
  - legibilidade
  - boas práticas
  - prevenção de erros comuns

Se necessário, integrar ESLint com **formatação automática** para manter consistência entre arquivos.

---

# Testes

## Jest

Adicionar **Jest** como framework de testes.

Escopo dos testes:

- **somente testes unitários**
- **não implementar testes de integração**

Os testes devem focar em:

- módulos
- utilitários
- funções puras
- regras de negócio isoladas

Evitar testes em:

- camadas de UI
- componentes visuais
- fluxos completos da aplicação.

---

## Boas práticas de testes

Os testes devem seguir boas práticas de engenharia:

- testes pequenos e focados
- isolamento entre casos de teste
- nomes descritivos
- cobertura de cenários principais e edge cases relevantes

Quando necessário:

- utilizar **mocks**
- simular dependências externas
- evitar dependência de estado global.

---

# Organização dos testes

Os testes devem respeitar a organização do projeto.

Diretrizes:

- manter testes próximos aos módulos testados **ou**
- seguir a estrutura de pastas existente no projeto

Caso exista necessidade de compartilhamento de utilidades de teste:

- utilizar a pasta **shared**, respeitando o padrão estrutural atual.

---

# Critério obrigatório

Antes de criar ou ajustar testes:

- **analise cuidadosamente o projeto**
- entenda a responsabilidade de cada módulo
- identifique quais partes realmente fazem sentido testar unitariamente.

Os testes **devem passar com sucesso** após implementação.

---

# Regra crítica

Não faça suposições.

Caso alguma informação necessária não esteja clara no projeto:

- **interrompa**
- **pergunte antes de prosseguir**

Evite qualquer tipo de implementação baseada em especulação.
