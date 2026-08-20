import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getPublicExhibition,
  type CreateExhibitionResponse,
} from "../api/exhibitionApi";

type ChatMessage = {
  id: string;
  exhibitionId: string;
  userName: string;
  message: string;
  timestamp: number;
};

type ConnectedMessage = {
  type: "connected";
  userName: string;
};

export default function ExhibitionScreenChat() {
  const { t, i18n } = useTranslation("display");
  const { id } = useParams<{ id: string }>();

  const [exhibition, setExhibition] = useState<CreateExhibitionResponse | null>(
    null
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadExhibition = async () => {
      try {
        setLoading(true);
        setError(false);

        const foundExhibition = await getPublicExhibition(id, languageCode);

        setExhibition(foundExhibition);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadExhibition();
  }, [id, languageCode]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const socketHost =
      window.location.hostname === "localhost"
        ? "localhost:3000"
        : window.location.host;

    const socket = new WebSocket(
      `${protocol}://${socketHost}/ws/chat/exhibition/${id}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket opened");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "connected") {
          const connectedMessage = data as ConnectedMessage;

          setUserName(connectedMessage.userName);
          setIsConnected(true);

          return;
        }

        if (data.id && data.exhibitionId && data.userName && data.message) {
          setMessages((currentMessages) => [
            ...currentMessages,
            data as ChatMessage,
          ]);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!socketRef.current) {
      return;
    }

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "message",
        message: trimmedMessage,
      })
    );

    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-2xl font-light">{t("loading")}</p>
      </main>
    );
  }

  if (error || !exhibition) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-2xl font-light">{t("error")}</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Exhibition image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: exhibition.fileUrl
            ? `url(${exhibition.fileUrl})`
            : undefined,
        }}
      />

      {/* Very subtle overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Exhibition title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-light tracking-wide md:text-6xl">
            {exhibition.title}
          </h1>

          <p className="mt-3 text-sm tracking-wide text-white/60">
            {t("chat.subtitle")}
          </p>
        </div>

        {/* Chat */}
        <div className="flex h-[70vh] w-full max-w-2xl flex-col overflow-hidden border border-white/20 bg-black/20 shadow-2xl backdrop-blur-[2px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-5">
              {messages.map((chatMessage) => {
                const isOwnMessage = chatMessage.userName === userName;

                return (
                  <div
                    key={chatMessage.id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] border px-4 py-3 ${"border-white/15 bg-black/25 text-white"}`}
                    >
                      <p className={`mb-1 text-xs ${"text-white/45"}`}>
                        {chatMessage.userName}
                      </p>

                      <p className="text-sm leading-relaxed">
                        {chatMessage.message}
                      </p>
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 && (
                <div className="flex h-full min-h-75 items-center justify-center text-center text-white/40">
                  <p>{t("chat.empty")}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-4 bg-black/40">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={300}
                disabled={!isConnected}
                placeholder={t("chat.placeholder")}
                aria-label={t("chat.inputLabel")}
                className="min-w-0 flex-1 border border-white/20 bg-black/50 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/50 disabled:opacity-40"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!isConnected || !message.trim()}
                className="border border-white/60 px-5 py-3 text-sm uppercase tracking-[0.15em] bg-black/50 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={t("chat.send")}
              >
                {t("chat.send")}
              </button>
            </div>

            {/* Connection status */}
            <div className="mt-3 flex items-center justify-end gap-2 text-[10px] uppercase tracking-[0.15em] text-white/40">
              <span
                className={`h-1.5 w-1.5 ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />

              <span>
                {isConnected ? t("chat.connected") : t("chat.disconnected")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
