"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type NewsletterSummary = {
  id: string;
  wp_title: string;
  received_at: string;
};

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<NewsletterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/newsletters")
      .then((r) => r.json())
      .then((data) => {
        setNewsletters(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load newsletters.");
        setLoading(false);
      });
  }, []);

  return (
    <main
      className="min-h-screen p-6 py-10"
      style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Diaspora Property Network"
              width={200}
              height={0}
              style={{ height: "auto" }}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "#c9a84c" }}
          >
            Newsletter Archive
          </h1>
          <p className="text-sm" style={{ color: "#9aa3b8" }}>
            Stay informed with the latest property intelligence from DPN-Global.
          </p>
        </div>

        {/* Gold rule */}
        <hr style={{ borderColor: "rgba(201,168,76,0.25)" }} />

        {/* Content */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" style={{ color: "#c9a84c" }} />
          </div>
        )}

        {error && (
          <p className="text-center text-sm" style={{ color: "#9aa3b8" }}>
            {error}
          </p>
        )}

        {!loading && !error && newsletters.length === 0 && (
          <p className="text-center text-sm py-16" style={{ color: "#9aa3b8" }}>
            No newsletters published yet. Check back soon.
          </p>
        )}

        {!loading && !error && newsletters.length > 0 && (
          <ul className="space-y-3">
            {newsletters.map((n) => (
              <li key={n.id}>
                <Link href={`/newsletters/${n.id}`}>
                  <div
                    className="flex items-center justify-between gap-4 rounded-lg px-5 py-4 border transition-colors hover:border-[#c9a84c] cursor-pointer"
                    style={{
                      backgroundColor: "#112050",
                      borderColor: "rgba(201,168,76,0.2)",
                    }}
                  >
                    <div className="space-y-1 min-w-0">
                      <p
                        className="font-semibold text-sm leading-snug truncate"
                        style={{ color: "#f5f0e8" }}
                      >
                        {n.wp_title}
                      </p>
                      <p className="text-xs" style={{ color: "#9aa3b8" }}>
                        {new Date(n.received_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "#c9a84c" }}>
                      Read →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
