# kobo_counter

## Folder setup

### public

Contains image, style, manifest.json and index.html files.

### src/components

Contains vue components used in one/more pages. They are not standalone pages but are consumed by other vue components.

### src/views

Contains vue components which are full pages and have their own routes

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

create caprover tar file
`tar -cvf ./deploy.tar --exclude="*.map" ./captain-definition ./dist/*`
