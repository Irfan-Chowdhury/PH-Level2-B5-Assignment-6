git init

touch .gitignore


git checkout -b development
git checkout -b proejct-setup

npm init -y

npm i -D typescript

tsc --init

```json
    "rootDir": "./src",  
    "outDir": "./dist",
```

### Package- 1

npm i express mongoose zod jsonwebtoken cors dotenv


### Package- 2

npm i -D ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken


### Package- 3

<!-- https://typescript-eslint.io/getting-started -->
npm install --save-dev eslint @eslint/js typescript typescript-eslint
<!-- Step 3: Running ESLint -->
npx eslint .

<!-- good -->
npx eslint ./src 

<!-- package.json -->
  "scripts": {
    "lint" : "npx eslint ./src"
  },


### Package- 4

npm i http-status-codes


### Package- 5

npm i bcryptjs


### Package- 6

npm i jsonwebtoken
npm i -D @types/jsonwebtoken


### Package- 7

npm i cookie-parser
npm i -D @types/cookie-parser


### Package- 8

```bash
npm i passport passport-local passport-google-oauth20
```

```bash
npm i -D @types/passport @types/passport-local @types/passport-google-oauth20
```


> https://www.passportjs.org/packages/
> https://www.passportjs.org/packages/passport-google-oauth20/


### Package- 9
```bash
npm i express-session
npm i --save-dev @types/express-session
```


### Package- 10
```bash
npm i axios
```