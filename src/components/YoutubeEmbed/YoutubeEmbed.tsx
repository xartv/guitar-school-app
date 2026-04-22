"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import styles from "./YoutubeEmbed.module.css"

interface YoutubeEmbedProps {
  url: string
  onDelete?: () => void
}

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    // youtu.be/VIDEO_ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null
    }
    // youtube.com/watch?v=VIDEO_ID
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v")
    }
  } catch {
    // not a valid URL
  }
  return null
}

export function YoutubeEmbed({ url, onDelete }: YoutubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = extractVideoId(url)

  if (!videoId) {
    return (
      <div className={styles.invalidLink}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors min-w-0"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0 text-red-500">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="truncate hover:underline underline-offset-2">{url}</span>
        </a>
        {onDelete && (
          <button
            className={styles.invalidLinkDeleteBtn}
            onClick={onDelete}
            aria-label="Remove video"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={styles.embedWrapper}
      onClick={() => setIsPlaying(true)}
      role="button"
      aria-label="Play video"
    >
      {isPlaying ? (
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            className={styles.thumbnail}
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
          />
          <div className={styles.playBtn}>
            <div className={styles.playCircle}>
              <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}
      {onDelete && (
        <button
          className={styles.deleteBtn}
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          aria-label="Remove video"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

interface YoutubeEmbedListProps {
  links: { id: string; url: string }[]
  onDelete?: (id: string) => void
}

export function YoutubeEmbedList({ links, onDelete }: YoutubeEmbedListProps) {
  if (links.length === 0) return null
  return (
    <div className={styles.videoList}>
      {links.map((link) => (
        <YoutubeEmbed
          key={link.id}
          url={link.url}
          onDelete={onDelete ? () => onDelete(link.id) : undefined}
        />
      ))}
    </div>
  )
}
