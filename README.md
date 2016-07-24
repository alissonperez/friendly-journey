Cadastro de carros
===================

Populando o banco
------------------

Para inicializar o banco (executar migracoes e popular a base):

```
$ make initdb
```

Executando a aplicacao
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

Observacoes gerais
-------------------

- Utilizando a versao 3.4.3 do python.
- Ha um bug no highligh da navegacao quando dentro de paginas de adicao (nested states).
- Conforme a instrucao do teste, nao me preocupei com UX/UI (feedbacks de acoes para o usuario, organizacao da tela, loadings, etc...).
- Nao trabalhei i18n.
- Modelei o motor do veiculo como um inteiro para armazenar o valor em CC (centrimetros cubicos), servindo tanto para motos quando para carros.
