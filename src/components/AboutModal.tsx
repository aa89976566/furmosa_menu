"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ABOUT_CARDS,
  CREW_MEMBERS,
  DOGMA_RULES,
  SERVICE_LINES,
  SWAP_REGIONS,
  type AboutPanelId,
} from "@/data/about";

type AboutModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AboutModal({ open, onClose }: AboutModalProps) {
  const [panel, setPanel] = useState<AboutPanelId | null>(null);
  const [regionId, setRegionId] = useState<(typeof SWAP_REGIONS)[number]["id"]>(
    "north",
  );

  const handleClose = () => {
    setPanel(null);
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (panel) setPanel(null);
        else onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, panel]);

  if (!open) return null;

  const activeRegion =
    SWAP_REGIONS.find((region) => region.id === regionId) ?? SWAP_REGIONS[0];

  return (
    <div className="furmosa-about">
      <div
        className={`furmosa-about__hub${panel ? " furmosa-about__hub--dimmed" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="關於匠寵"
      >
        <div className="furmosa-about__hub-panel">
          <div className="furmosa-about__hub-masthead">
            <span className="furmosa-about__hub-word">探索</span>
            <button
              type="button"
              className="furmosa-about__close"
              aria-label="關閉"
              onClick={handleClose}
            >
              ×
            </button>
            <span className="furmosa-about__hub-word">匠寵</span>
          </div>
          <h2 className="furmosa-about__hub-title visually-hidden">關於匠寵</h2>
          <div className="furmosa-about__grid">
            {ABOUT_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                className={`furmosa-about__card ${card.className}`}
                onClick={() => setPanel(card.id)}
              >
                <span className="furmosa-about__card-label">{card.label}</span>
                <span className="furmosa-about__card-tag">{card.tag}</span>
                <span className="furmosa-about__card-value">{card.value}</span>
                <span className="furmosa-about__card-line">{card.line}</span>
                <span className="furmosa-about__card-hook">{card.hook}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {panel === "crew" && (
        <DetailShell stamp="內部文件" onBack={() => setPanel(null)}>
          <p className="furmosa-about__detail-kicker">團隊介紹</p>
          <h3 className="furmosa-about__detail-title">現役人員</h3>
          <p className="about-detail__lead">五個怪胎。零廣告話術。</p>
          <ul className="about-detail__crew-list">
            {CREW_MEMBERS.map((member) => (
              <li key={member.code} className="about-detail__crew-item">
                <div className="about-detail__crew-top">
                  <span className="about-detail__crew-code">{member.code}</span>
                  <a
                    className="about-detail__ig"
                    href={member.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    追蹤↗
                  </a>
                </div>
                <p className="about-detail__crew-name">{member.name}</p>
                <p className="about-detail__crew-role">{member.role}</p>
                <p className="about-detail__crew-note">{member.note}</p>
              </li>
            ))}
          </ul>
          <p className="about-detail__footer">我們不賣愛。我們賣證據。</p>
        </DetailShell>
      )}

      {panel === "swap" && (
        <DetailShell stamp="現場地圖" onBack={() => setPanel(null)}>
          <p className="furmosa-about__detail-kicker">
            換罐計畫參與店家
          </p>
          <h3 className="furmosa-about__detail-title">換罐網絡</h3>
          <p className="about-detail__lead">帶罐來。別帶藉口。</p>
          <p className="about-detail__live">
            <span className="about-detail__live-dot" aria-hidden="true" />
            47 個據點
          </p>
          <div className="about-detail__map" aria-hidden="true">
            <div className="about-detail__map-grid" />
            {SWAP_REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                className={`about-detail__map-pin${
                  region.id === regionId ? " is-active" : ""
                }`}
                style={{ top: region.position.top, left: region.position.left }}
                onClick={() => setRegionId(region.id)}
              >
                {region.count}
              </button>
            ))}
          </div>
          <div className="about-detail__map-panel">
            <p className="about-detail__map-region">{activeRegion.label}</p>
            <ul className="about-detail__map-spots">
              {activeRegion.spots.map((spot) => (
                <li key={spot}>{spot}</li>
              ))}
            </ul>
          </div>
          <p className="about-detail__footer">
            不用預約。不用填表。不用聽推銷。
          </p>
        </DetailShell>
      )}

      {panel === "dogma" && (
        <DetailShell stamp="機密檔" onBack={() => setPanel(null)}>
          <p className="furmosa-about__detail-kicker">理念</p>
          <h3 className="furmosa-about__detail-title">宣言 01</h3>
          <p className="about-detail__lead">
            不是教你怎麼養狗。是教你怎麼讀標籤。
          </p>
          <ol className="about-detail__rules">
            {DOGMA_RULES.map((rule, index) => (
              <li key={rule}>
                <span className="about-detail__rule-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
          <p className="about-detail__redacted">
            「天然」、「風味」、「佐」—— ████ 不會出現在我們的標籤上。
          </p>
          <p className="about-detail__footer">
            300 億市場很會說故事。我們只負責撕掉它。
          </p>
        </DetailShell>
      )}

      {panel === "services" && (
        <DetailShell stamp="作業中" onBack={() => setPanel(null)}>
          <p className="furmosa-about__detail-kicker">服務範圍</p>
          <h3 className="furmosa-about__detail-title">業務範圍</h3>
          <p className="about-detail__lead">我們不做寵物店。我們做證據。</p>
          <ul className="about-detail__services">
            {SERVICE_LINES.map((service) => (
              <li key={service.code} className="about-detail__service">
                <span className="about-detail__service-code">
                  {service.code}
                </span>
                <div>
                  <p className="about-detail__service-name">{service.name}</p>
                  <p className="about-detail__service-tagline">
                    {service.tagline}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="about-detail__footer">
            沒有「全新配方」。沒有「風味系列」。
          </p>
        </DetailShell>
      )}

      {panel === "returned" && (
        <DetailShell stamp="即時計數" onBack={() => setPanel(null)}>
          <p className="furmosa-about__detail-kicker">
            換罐計畫參與人數
          </p>
          <h3 className="furmosa-about__detail-title">參與紀錄</h3>
          <p className="about-detail__lead">你換了。我們數了。</p>
          <p className="about-detail__mega-count">333</p>
          <p className="about-detail__mega-label">換罐人數</p>
          <div className="about-detail__stats">
            <div className="about-detail__stat">
              <span className="about-detail__stat-val">即時</span>
              <span className="about-detail__stat-label">資料來源</span>
            </div>
            <div className="about-detail__stat">
              <span className="about-detail__stat-val">333</span>
              <span className="about-detail__stat-label">基準</span>
            </div>
          </div>
          <p className="about-detail__footer">還在漲。你換了沒？</p>
        </DetailShell>
      )}
    </div>
  );
}

function DetailShell({
  stamp,
  onBack,
  children,
}: {
  stamp: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="furmosa-about__detail" role="dialog" aria-modal="true">
      <div className="furmosa-about__detail-header">
        <button type="button" className="furmosa-about__back" onClick={onBack}>
          ← 返回
        </button>
        <span className="furmosa-about__detail-stamp">{stamp}</span>
      </div>
      <div className="furmosa-about__detail-body">{children}</div>
    </div>
  );
}
