# create-nuxt-typescript-component

create a nuxt typescript component

install **Create nuxt typescript component** by npm :

```
npm install -g create-nuxt-typescript-component
```

## it's you first time ?

This script allows you to create a new Typescript component (page / component / layout) based on [nuxt-property-decorator](https://www.npmjs.com/package/nuxt-property-decorator) in the style of an Angular component

The following syntaxe is by default to create a new component :

```
create-ntc component-name
```

you can also use it to create a new page this following syntaxe :

```
create-ntc page page-name parent-folder-path(optional)
```

or layout :

```
create-ntc layout layout-name parent-folder-path(optional)
```

## Source Code

### Vue
```vue  sample.vue
<template lang="html" src="./SampleFileName.html"></template>
<script lang="ts" src="./SampleFileName.ts" name="sample-name" />
<style lang="scss" src="./SampleFileName.scss" />
```

### Typescript
```ts sample.ts
import { Vue, Component } from 'nuxt-property-decorator'
@Component({
  name: 'sample-name'
})
export default class SampleName extends Vue {}
```

### Template
```html sample.html
<div>
    I create my new  <span class="name">{{ $options.name }}</span>
</div>
```

### Style
This is an empty file

### index for typescript component import
```ts index.ts
import SampleName from './SampleFileName'

export default SampleName
```


## License
WTFPL (auteur initial : Aurélien Duriez)