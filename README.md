# Blog CRUD

This is the CRUD task of blogs developed by Aqeel Malik.

## Usage

This CRUD project uses Laravel for backend and React for the frontend.

### Install Dependencies
```bash
Node v22 and PHP 8.4.5 
```

```bash
npm install
```

```bash
composer install
```


### Database Credentials

```bash
cp .env.example .env

APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite

OR

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog_crud
DB_USERNAME=root
# DB_PASSWORD=
```
Run cmd for key generate and migration
```bash
php artisan key:gen
php artisan migrate
```

### Run Vite Frontend

Vite will run on http://localhost:5173

```bash
npm run dev
```

### Run Laravel Artisan CMD for Backend

Open any browser with URL: http://127.0.0.1:8000

```bash
php artisan serve
```



_Note:_ For email verification can use ID of user with this route

```bash
http://127.0.0.1:8000/verify-email/{id}
```
