/**
 * MeetAlgo — embedded YouTube video.
 * Maps to Figma frame 43:126. Uses lite-loader pattern: a poster
 * image is shown until the user clicks play, only then is the YouTube
 * iframe injected. This avoids loading YouTube cookies before the
 * user has actually engaged with the video.
 */
import { useState } from "react";
import styles from "./MeetAlgo.module.css";

const VIDEO_ID = "ZvkefWVxMgE";

export default function MeetAlgo() {
  const [playing, setPlaying] = useState(false);
  return (
    <section id="meet-algo" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          Meet Algo
          <span className={styles.sub}>
            And find out why Strong Data is important
          </span>
        </h2>
        <div className={styles.frame}>
          {playing ? (
            <iframe
              className={styles.iframe}
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title="Meet Algo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={styles.poster}
              onClick={() => setPlaying(true)}
              aria-label="Play Meet Algo video"
              style={{
                backgroundImage: `url(https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg)`,
              }}
            >
              <span className={styles.playBtn} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
