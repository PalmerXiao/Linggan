import React, { useEffect, useMemo, useState } from "react";
import { loadQuotes, saveQuotes, type Quote } from "../utils/storage";
import { getNextIndex } from "../utils/rotation";

const DEFAULT_INTERVAL_MS = 30000;

export const App: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);
  const [mode, setMode] = useState<"sequential" | "random">("random");
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    (async () => {
      const stored = await loadQuotes();
      if (stored.length === 0) {
        const builtin: Quote[] = [
          {
            id: "builtin-1",
            content: "写作不是等待灵感，而是为灵感创造到来的条件。",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "builtin-2",
            content: "当你愿意迈出第一步，路就会在脚下慢慢清晰。",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setQuotes(builtin);
        await saveQuotes(builtin);
      } else {
        setQuotes(stored);
      }
    })();
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;
    const id = window.setInterval(() => {
      setCurrentIndex((idx) => getNextIndex(idx, quotes.length, mode));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [quotes.length, intervalMs, mode]);

  const currentQuote = useMemo(
    () => (quotes.length > 0 ? quotes[currentIndex % quotes.length] : null),
    [quotes, currentIndex]
  );

  return (
    <div className="floating-card">
      <div className="quote-text">
        {currentQuote ? currentQuote.content : "暂时还没有语录，去添加几句喜欢的话吧。"}
      </div>
      {isEditing && (
        <div className="editor">
          <textarea
            className="editor-textarea"
            placeholder="在这里输入一条新的语句…"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={3}
          />
          <div className="editor-actions">
            <button
              className="toolbar-btn"
              onClick={() => {
                setIsEditing(false);
                setDraftText("");
              }}
            >
              取消
            </button>
            <button
              className="toolbar-btn"
              onClick={async () => {
                const content = draftText.trim();
                if (!content) {
                  alert("内容不能为空。");
                  return;
                }
                const existing = quotes.find(
                  (q) => q.content.trim() === content
                );
                if (existing) {
                  alert("这句语录已经存在啦。");
                  return;
                }
                const now = new Date().toISOString();
                const updated: Quote[] = [
                  ...quotes,
                  {
                    id: crypto.randomUUID(),
                    content,
                    createdAt: now,
                    updatedAt: now,
                  },
                ];
                setQuotes(updated);
                await saveQuotes(updated);
                setDraftText("");
                setIsEditing(false);
              }}
            >
              保存
            </button>
          </div>
        </div>
      )}
      <div className="toolbar">
        <button
          className="toolbar-btn"
          onClick={() => {
            const next = getNextIndex(currentIndex, quotes.length, mode);
            setCurrentIndex(next);
          }}
        >
          下一句
        </button>
        <button
          className="toolbar-btn"
          onClick={async () => {
            const text = await navigator.clipboard.readText().catch(() => "");
            const content = text.trim();
            if (!content) {
              alert("剪贴板没有检测到文本内容。");
              return;
            }
            const existing = quotes.find(
              (q) => q.content.trim() === content
            );
            if (existing) {
              alert("这句语录已经存在啦。");
              return;
            }
            const now = new Date().toISOString();
            const updated: Quote[] = [
              ...quotes,
              { id: crypto.randomUUID(), content, createdAt: now, updatedAt: now },
            ];
            setQuotes(updated);
            await saveQuotes(updated);
            alert("已从剪贴板导入新语录。");
          }}
        >
          导入剪贴板
        </button>
        <button
          className="toolbar-btn"
          onClick={() => {
            setIsEditing(true);
            setDraftText("");
          }}
        >
          手动添加
        </button>
        <button
          className="toolbar-btn"
          onClick={async () => {
            if (!currentQuote) {
              return;
            }
            const ok = window.confirm("确定要删除这条语句吗？");
            if (!ok) return;
            const idx = quotes.findIndex((q) => q.id === currentQuote.id);
            if (idx === -1) return;
            const updated = quotes.filter((q) => q.id !== currentQuote.id);
            setQuotes(updated);
            await saveQuotes(updated);
            if (updated.length === 0) {
              setCurrentIndex(0);
            } else if (idx >= updated.length) {
              setCurrentIndex(updated.length - 1);
            }
          }}
        >
          删除当前
        </button>
        <select
          className="toolbar-select"
          value={mode}
          onChange={(e) =>
            setMode(e.target.value === "random" ? "random" : "sequential")
          }
        >
          <option value="random">随机</option>
          <option value="sequential">顺序</option>
        </select>
        <select
          className="toolbar-select"
          value={intervalMs}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
        >
          <option value={15000}>15 秒</option>
          <option value={30000}>30 秒</option>
          <option value={60000}>1 分钟</option>
          <option value={300000}>5 分钟</option>
        </select>
      </div>
    </div>
  );
};

