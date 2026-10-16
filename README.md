# 不用登入的預覽鏡像（自動產生，不要改這個分支）

這個分支不是程式碼，是 `cursor/furmosa-real-food-poster-site-0dea` 那一版的
**靜態輸出**，只為了一件事存在：Vercel 的預覽網址開了 Deployment Protection，
手機上沒登入就會被擋，所以把同一版輸出成純靜態檔，放在這個公開 repo 上，
由公開 CDN 直接服務，任何人不用登入就能打開。

預覽網址（手機直接開）：

- 報紙 `/real-food` — https://raw.githack.com/aa89976566/furmosa_menu/cursor/static-mobile-preview-0dea/real-food/index.html
- 市場報 `/paper` — https://raw.githack.com/aa89976566/furmosa_menu/cursor/static-mobile-preview-0dea/paper/index.html
- 中秋公益海報 `/mooncake` — https://raw.githack.com/aa89976566/furmosa_menu/cursor/static-mobile-preview-0dea/mooncake/index.html

## 和 Vercel 預覽的差別

| | Vercel 預覽 | 這個鏡像 |
| --- | --- | --- |
| 要登入 | 要 | **不用** |
| 照片 | Next.js 即時最佳化（WebP／AVIF、依裝置給尺寸） | 原檔直出（`images.unoptimized`），所以比較吃流量 |
| `/haodada` 改寫 | 有（`next.config.ts` 的 rewrites） | 沒有，`output: export` 不支援 rewrites |
| 更新 | 每次 push 自動 | 要重新產生 |

版面、CSS 與文案和 Vercel 預覽完全一樣。

## 怎麼重新產生

在那個分支上把 `next.config.ts` 換成 `output: "export"`、
`images.unoptimized: true`、`assetPrefix` 指到這個分支在 CDN 上的位置，
`npm run build`，再把 `out/` 的內容覆蓋到這個分支的根目錄。

Vercel 那邊關掉 Deployment Protection 之後，這個分支就可以刪了。
