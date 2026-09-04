import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./challenge.module.css";

export const metadata: Metadata = {
  title: "嗷嗚計劃：青蛙誰在怕",
  description: "模擬聊天室配對，完成 #青蛙偏見挑戰",
};

export default function ChallengePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← 凍乾目錄
        </Link>
        <p className={styles.stamp}>挑戰</p>
      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.kicker}>嗷嗚計劃</p>
          <h1 className={styles.title}>青蛙誰在怕</h1>
          <p className={styles.lead}>
            模擬聊天室配對，完成 #青蛙偏見挑戰。把選擇還給牠——不是還給你的成見。
          </p>
          <div className={styles.actions}>
            <a
              className={styles.primary}
              href="https://furmosa.com/collections/all"
              target="_blank"
              rel="noopener noreferrer"
            >
              商店↗
            </a>
            <Link className={styles.secondary} href="/">
              回目錄
            </Link>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.glow} />
          <Image
            src="/mock/frog-closeup.png"
            alt=""
            width={664}
            height={918}
            className={styles.frog}
            priority
          />
        </div>
      </section>

      <section className={styles.hands} aria-hidden="true">
        <Image
          src="/mock/frog-hands-scene.png"
          alt=""
          width={1024}
          height={460}
          className={styles.handsImg}
        />
      </section>
    </main>
  );
}
