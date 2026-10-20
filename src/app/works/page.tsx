import type { Metadata } from "next";

import WorksPage from "@/components/WorksPage";

export const metadata: Metadata = {
  title: "DROP 檔案庫｜匠寵 FURMOSA",
  description:
    "歷年企劃的編號清單：嚎大大雞霸、浪浪交易所中秋限定盤、chill 嗨嗨ㄟ貓、再來一包、背景很硬的碗、店家合作。",
};

/**
 * 這一份原本掛在首頁。首頁改成可操作的餐桌之後，企劃列表搬到這裡，
 * 餐桌最下面那張「DROP 檔案庫」就是連到這一頁。內容一行都沒有改。
 */
export default function Works() {
  return <WorksPage />;
}
