# SoftExpert Test
Este projeto foi feito apenas para fins de teste.

## Installation
Use o composer para instalar as dependencias

```bash
composer install
```

Iporte a base de dados
```psql
psql -U postgres -d other -1 -f softexpertstore.sql
```

## Como usar
Após a instalação, dentro da pasta raíz do projeto, execute o seguinte comando (Importante usar a porta 8080 pois as urls já estão a olhar para esta porta)

``` php
php -S localhost:8080
```
<a href="http:/localhost:8080/front" target="_blank">Acesse localhost:8080/front</a>

## License
[MIT](https://choosealicense.com/licenses/mit/)
