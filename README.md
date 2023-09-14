How to test.

When the `/src/app/api/route.ts` contains this code

```ts
export const runtime =
  process.env.NODE_ENV === "production" ? "edge" : "nodejs";
```

let's look at the result of the build commands

```
# npm run build

[...]
Route (app)                                Size     First Load JS
┌ ○ /                                      5.34 kB        83.8 kB
├ ○ /api                                   0 B                0 B
```

```
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

```
# npm run build

[...]
Route (app)                                Size     First Load JS
┌ ○ /                                      5.34 kB        83.8 kB
├ ℇ /api                                   0 B                0 B
```

As you can see the edge function (indicated by ℇ) is created only in the latter. A conditional build
will never produce an edge function.
