# Teste Técnico para Desenvolvedores Ruby on Rails

Url para acesso ao site em produção: https://espresso-rails-test-6b9ca6b10623.herokuapp.com

# Versões utilizadas

- Ruby 2.7.8
- Rails 5.2.8
- Node 20.9.0
- npm 10.1.0
- MySQL 8.0.9

# Para instalar a app:

Configurar o database.yml com os dados do seu mysql tanto de username como de password, exemplo:

```
default: &default
  adapter: mysql2
  encoding: utf8
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: seu_username
  password: sua_password
  socket: /var/run/mysqld/mysqld.sock
```
Rodar os comandos:
- `rake db:setup` para criar banco de dados e tabelas
- `bundle install` para instalar as gems
- `npm install` para instalar os pacotes do front end
- `./bin/shakapacker` para compilar os pacotes do front end
- `rails s` para subir o servidor

# Para rodar os testes

Rodar os seguintes comandos:
- `rake db:setup RAILS_ENV=test` para criar o banco de dados utilizado nos testes
- `rspec` para rodar os testes
