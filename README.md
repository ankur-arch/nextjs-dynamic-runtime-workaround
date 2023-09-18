# Switching Next.js runtime during build

When the `/src/app/api/route.ts` contains this code

```ts
export const runtime =
  process.env.NODE_ENV === "production" ? "edge" : "nodejs";
```

let's look at the result of the build commands

```bash
# npm run build

[...]
Route (app)                                Size     First Load JS
┌ ○ /                                      5.34 kB        83.8 kB
├ ○ /api                                   0 B                0 B
```

```bash
# NODE_ENV=production  npm run build

[...]
Route (app)                                Size     First Load JS
┌ ○ /                                      5.34 kB        83.8 kB
├ ○ /api                                   0 B                0 B
```

When the content of the file is

```ts
export const runtime = "edge";
```

the build is always

```bash

# npm run build

[...]
Route (app)                                Size     First Load JS
┌ ○ /                                      5.34 kB        83.8 kB
├ ℇ /api                                   0 B                0 B
```

As you can see the edge function (indicated by `ℇ`) is created only in the latter. A conditional build
will never produce an edge function.

## Workaround

Create a [script](./script.ts) that traverses all the api `route` files and replaces all mentions of 
`export const runtime = "nodejs";` to
`export const runtime = "edge";` that way the Next.js builds the routes as `edge` routes. 

You must call that script in your [`package.json`](./package.json) file by modifying the build command like:

```json
"build": "RUNTIME=edge bun run script.ts && next build && RUNTIME=nodejs bun run script.ts",
```

> Note: I call the script twice to undo the changes made to the file. 

Additionally, incase a route is intended to use the nodejs runtime, add a `// skip` anywhere in the file, that'll indicate the script to ignore compiling that route as an `edge` route.

Such as in this case [this](./src/app/api/skip/route.ts) route is skipped from conversion into using an `edge` runtime rather than a `nodejs` runtime. 
