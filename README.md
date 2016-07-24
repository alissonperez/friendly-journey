Cadastro de carros
===================

Desenvolvido com base no desafio https://github.com/vivadecora/backend-teste.

Instalação
-----------

Requerimentos: Virtualenv com versão 3.4 do Python e SQLite3.

Após criar o virtualenv:

```
$ pip install -r requirements.txt
```

Populando o banco
------------------

Para inicializar o banco (executar migrações e popular a base):

```
$ make initdb
```

Executando a aplicação
------------------------

Inicialize o servidor local:

```
$ make serve
```

Acesse http://localhost:8000/

Executando tests backend
-------------------------

Execute:

```
$ make test
```

### Verificando cobertura dos testes

Execute:

```
$ make coverage
```

Em seguida, abra o arquivo `.htmlcov/index.html` em seu navegador.

Observações gerais
-------------------

- Conforme a especificação do desafio, não me preocupei com UX/UI (feedbacks de ações do usuário, organização da tela, loadings, etc...).
- Não trabalhei i18n.
- Modelei o motor do veículo como um inteiro para armazenar o valor em cilindradas (CC), servindo tanto para motos quando para carros. Normalizei a API para aceitar apenas cilindradas, desta forma o frontend fica responsavel por exibir e manipular corretamente as siglas (X.X para motores acima 1000 CC).
- Na modelagem a especificação do motor foi incluída no veículo ao invés do modelo apenas para dar mais flexibilidade no momento da inclusão.
- O front foi testado nos navegadores Chrome e Firefox apenas.
- Mantive o idioma portugues para os commits e a documentação apenas por praticidade e devido à propria especificação do desafio ser em português.
- Utilizei o CSS Bootstrap 3 do Twitter por já ter trabalhado com ele, o que agilizaria o meu desenvolvimento.

Melhorias
-----------

- Incluir testes no frontend.
- As chamadas AJAX podem ser otimizadas utilizando um cache nos respectivos providers para evitar chamadas desnecessárias à API.
- Não permitir a inclusão de montadoras com o mesmo nome.
- Verificar compatibilidade com Internet Explorer =/.
- Incluir i18n.
- A lista de cores e de tipos de veículos deve passar a vir da API e não estar "hardcoded" no Javascript.