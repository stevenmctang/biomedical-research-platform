import {
  ArrowRight,
  Atom,
  BookOpen,
  Brain,
  Dna,
  FolderKanban,
  FlaskConical,
  Network,
  Orbit,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  Navbar,
} from '../components/Navbar'

export function Home() {
  return (
    <div className="site-shell helix-home-page">
      <style>
        {`
          .helix-home-page {
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            background:
              radial-gradient(circle at 12% 6%, rgba(74, 101, 219, 0.16), transparent 32%),
              radial-gradient(circle at 88% 14%, rgba(45, 98, 130, 0.12), transparent 30%),
              #f8f7f1;
            color: #232822;
          }

          .helix-home-page::before {
            content: "";
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background:
              radial-gradient(circle at var(--x, 20%) var(--y, 20%), rgba(73, 104, 220, 0.12), transparent 28%),
              radial-gradient(circle at 70% 80%, rgba(45, 100, 130, 0.08), transparent 30%);
            animation: helixAmbientShift 12s ease-in-out infinite alternate;
          }

          .helix-home-page > * {
            position: relative;
            z-index: 1;
          }

          .helix-home-page main {
            width: min(1220px, calc(100% - 40px));
            margin: 0 auto;
          }

          .helix-hero {
            display: grid;
            grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
            gap: 32px;
            align-items: center;
            min-height: calc(100vh - 84px);
            padding: 58px 0 70px;
          }

          .helix-hero-copy {
            position: relative;
            z-index: 2;
            animation: helixFadeUp 780ms ease both;
          }

          .helix-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            width: fit-content;
            margin: 0 0 18px;
            color: #3655a5;
            font-size: 12px;
            font-weight: 850;
            letter-spacing: 0.75px;
            text-transform: uppercase;
          }

          .helix-eyebrow svg {
            animation: helixSparklePulse 1.8s ease-in-out infinite;
          }

          .helix-hero h1 {
            max-width: 760px;
            margin: 0;
            color: #20251f;
            font-size: clamp(48px, 8vw, 92px);
            line-height: 0.93;
            letter-spacing: -4.6px;
          }

          .helix-hero h1 span {
            display: block;
            color: #3655a5;
            background: linear-gradient(90deg, #3655a5, #5a7cff, #3655a5);
            background-size: 220% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: helixTextShimmer 4.5s ease-in-out infinite;
          }

          .helix-hero-description {
            max-width: 680px;
            margin: 24px 0 0;
            color: #657062;
            font-size: 18px;
            line-height: 1.72;
            animation: helixFadeUp 780ms ease 120ms both;
          }

          .helix-hero-search {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 720px;
            min-height: 64px;
            margin-top: 30px;
            padding: 8px 8px 8px 18px;
            overflow: hidden;
            border: 1px solid #dfe4dc;
            border-radius: 20px;
            background: rgba(255, 254, 249, 0.92);
            box-shadow: 0 24px 70px rgba(29, 36, 27, 0.08);
            animation: helixFadeUp 780ms ease 230ms both;
          }

          .helix-hero-search::after {
            content: "";
            position: absolute;
            top: 0;
            left: -40%;
            width: 30%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(86, 120, 220, 0.16), transparent);
            transform: skewX(-18deg);
            animation: helixScan 3.6s ease-in-out infinite;
          }

          .helix-hero-search svg {
            flex: none;
            color: #3655a5;
          }

          .helix-hero-search span {
            flex: 1;
            min-width: 0;
            color: #5f685d;
            font-size: 15px;
            font-weight: 650;
          }

          .helix-hero-search a {
            position: relative;
            z-index: 2;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            min-height: 48px;
            padding: 0 18px;
            border-radius: 15px;
            background: #253b75;
            color: #ffffff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 800;
            white-space: nowrap;
            transition:
              transform 180ms ease,
              box-shadow 180ms ease,
              background 180ms ease;
          }

          .helix-hero-search a:hover {
            transform: translateY(-2px);
            background: #1e3267;
            box-shadow: 0 18px 34px rgba(37, 59, 117, 0.24);
          }

          .helix-hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
            animation: helixFadeUp 780ms ease 330ms both;
          }

          .helix-primary-button,
          .helix-secondary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            min-height: 46px;
            padding: 0 16px;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none;
            transition:
              transform 180ms ease,
              box-shadow 180ms ease,
              border-color 180ms ease;
          }

          .helix-primary-button {
            border: 1px solid #253b75;
            background: #253b75;
            color: white;
          }

          .helix-secondary-button {
            border: 1px solid #dbe0d7;
            background: rgba(255, 254, 249, 0.86);
            color: #242923;
          }

          .helix-primary-button:hover,
          .helix-secondary-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 34px rgba(29, 36, 27, 0.1);
          }

          .helix-hero-visual {
            position: relative;
            min-height: 610px;
            overflow: hidden;
            border: 1px solid #dfe4dc;
            border-radius: 34px;
            background:
              radial-gradient(circle at 50% 50%, rgba(71, 99, 180, 0.19), transparent 27%),
              radial-gradient(circle at 25% 25%, rgba(50, 100, 130, 0.12), transparent 24%),
              linear-gradient(145deg, rgba(255, 254, 249, 0.98), rgba(242, 244, 238, 0.96));
            box-shadow: 0 34px 90px rgba(29, 36, 27, 0.1);
            animation: helixVisualEntrance 900ms cubic-bezier(.2,.8,.2,1) 180ms both;
          }

          .helix-hero-visual::after {
            content: "";
            position: absolute;
            inset: -40%;
            background:
              conic-gradient(from 0deg, transparent, rgba(70, 100, 200, 0.1), transparent, rgba(50, 120, 150, 0.08), transparent);
            animation: helixAuroraSpin 16s linear infinite;
            opacity: 0.8;
          }

          .helix-visual-grid {
            position: absolute;
            inset: 0;
            z-index: 1;
            background-image:
              linear-gradient(rgba(93, 102, 90, 0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(93, 102, 90, 0.07) 1px, transparent 1px);
            background-size: 34px 34px;
            transform: rotateX(60deg) scale(1.25);
            transform-origin: center bottom;
            animation: helixGridDrift 10s ease-in-out infinite alternate;
          }

          .helix-particle {
            position: absolute;
            z-index: 3;
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: rgba(54, 85, 165, 0.42);
            box-shadow: 0 0 22px rgba(54, 85, 165, 0.25);
            animation: helixParticleFloat 6s ease-in-out infinite;
          }

          .particle-one {
            left: 18%;
            top: 30%;
          }

          .particle-two {
            right: 21%;
            top: 42%;
            animation-delay: 1.1s;
          }

          .particle-three {
            left: 48%;
            bottom: 16%;
            animation-delay: 2s;
          }

          .particle-four {
            right: 34%;
            top: 16%;
            animation-delay: 2.8s;
          }

          .helix-orbit {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 2;
            border: 1px solid rgba(63, 82, 140, 0.22);
            border-radius: 50%;
            transform-style: preserve-3d;
          }

          .helix-orbit-one {
            width: 500px;
            height: 260px;
            margin-left: -250px;
            margin-top: -130px;
            transform: rotateX(66deg) rotateZ(5deg);
            animation: helixOrbitOne 15s linear infinite;
          }

          .helix-orbit-two {
            width: 380px;
            height: 380px;
            margin-left: -190px;
            margin-top: -190px;
            transform: rotateY(62deg) rotateZ(-18deg);
            animation: helixOrbitTwo 20s linear infinite reverse;
          }

          .helix-orbit-three {
            width: 300px;
            height: 170px;
            margin-left: -150px;
            margin-top: -85px;
            transform: rotateX(72deg) rotateZ(-30deg);
            animation: helixOrbitThree 18s linear infinite;
          }

          .helix-core {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 5;
            display: grid;
            place-items: center;
            width: 116px;
            height: 116px;
            border: 1px solid #d8dfd4;
            border-radius: 34px;
            background:
              linear-gradient(145deg, rgba(255, 254, 249, 0.99), rgba(238, 242, 255, 0.95));
            color: #253b75;
            box-shadow: 0 28px 80px rgba(35, 52, 95, 0.22);
            transform: translate(-50%, -50%);
            animation: helixCorePulse 2.8s ease-in-out infinite;
          }

          .helix-core::before {
            content: "";
            position: absolute;
            inset: -26px;
            border-radius: 42px;
            background: radial-gradient(circle, rgba(70, 100, 200, 0.2), transparent 67%);
            z-index: -1;
            animation: helixGlowPulse 2.8s ease-in-out infinite;
          }

          .helix-core svg {
            width: 46px;
            height: 46px;
          }

          .helix-network-card {
            position: absolute;
            z-index: 6;
            width: 158px;
            padding: 14px;
            border: 1px solid #dfe4dc;
            border-radius: 22px;
            background: rgba(255, 254, 249, 0.94);
            box-shadow: 0 20px 55px rgba(29, 36, 27, 0.12);
            animation: helixCardFloat 4.8s ease-in-out infinite;
          }

          .helix-network-card span {
            display: block;
            color: #3655a5;
            font-size: 10px;
            font-weight: 850;
            letter-spacing: 0.45px;
            text-transform: uppercase;
          }

          .helix-network-card strong {
            display: block;
            margin-top: 5px;
            color: #232822;
            font-size: 15px;
            line-height: 1.18;
          }

          .helix-network-card p {
            margin: 7px 0 0;
            color: #6b7468;
            font-size: 11px;
            line-height: 1.4;
          }

          .card-one {
            left: 9%;
            top: 15%;
          }

          .card-two {
            right: 8%;
            top: 18%;
            animation-delay: 0.8s;
          }

          .card-three {
            left: 8%;
            bottom: 18%;
            animation-delay: 1.4s;
          }

          .card-four {
            right: 10%;
            bottom: 16%;
            animation-delay: 2s;
          }

          .helix-visual-lines {
            position: absolute;
            inset: 0;
            z-index: 4;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .helix-visual-lines line {
            stroke: rgba(95, 104, 92, 0.33);
            stroke-width: 1.4;
            stroke-dasharray: 7 8;
            animation: helixLineFlow 2.8s linear infinite;
          }

          .helix-section {
            padding: 72px 0;
          }

          .helix-section-heading {
            display: grid;
            grid-template-columns: minmax(0, 0.85fr) minmax(300px, 0.55fr);
            gap: 28px;
            align-items: end;
            margin-bottom: 24px;
          }

          .helix-section-heading h2 {
            margin: 0;
            color: #232822;
            font-size: clamp(36px, 6vw, 66px);
            line-height: 0.98;
            letter-spacing: -2.4px;
          }

          .helix-section-heading p {
            margin: 0;
            color: #657062;
            font-size: 16px;
            line-height: 1.7;
          }

          .helix-feature-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }

          .helix-feature-card {
            position: relative;
            min-height: 250px;
            overflow: hidden;
            padding: 22px;
            border: 1px solid #dfe4dc;
            border-radius: 26px;
            background: rgba(255, 254, 249, 0.88);
            box-shadow: 0 20px 60px rgba(29, 36, 27, 0.06);
            transition:
              transform 200ms ease,
              box-shadow 200ms ease,
              border-color 200ms ease;
          }

          .helix-feature-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(74, 101, 219, 0.1), transparent 38%);
            opacity: 0;
            transition: opacity 200ms ease;
          }

          .helix-feature-card:hover {
            transform: translateY(-6px);
            border-color: #cbd5ff;
            box-shadow: 0 30px 80px rgba(29, 36, 27, 0.1);
          }

          .helix-feature-card:hover::before {
            opacity: 1;
          }

          .helix-feature-icon {
            position: relative;
            z-index: 1;
            display: grid;
            place-items: center;
            width: 44px;
            height: 44px;
            border-radius: 16px;
            background: #edf1ff;
            color: #3655a5;
          }

          .helix-feature-card small,
          .helix-feature-card h3,
          .helix-feature-card p {
            position: relative;
            z-index: 1;
          }

          .helix-feature-card small {
            display: block;
            margin-top: 22px;
            color: #3655a5;
            font-size: 11px;
            font-weight: 850;
            letter-spacing: 0.45px;
          }

          .helix-feature-card h3 {
            margin: 10px 0 8px;
            color: #232822;
            font-size: 21px;
            letter-spacing: -0.45px;
          }

          .helix-feature-card p {
            margin: 0;
            color: #657062;
            font-size: 13px;
            line-height: 1.62;
          }

          .helix-flow-section {
            padding: 72px 0;
          }

          .helix-flow-panel {
            display: grid;
            grid-template-columns: minmax(0, 0.75fr) minmax(0, 1fr);
            gap: 28px;
            align-items: center;
            padding: 30px;
            border: 1px solid #dfe4dc;
            border-radius: 34px;
            background:
              radial-gradient(circle at 100% 0%, rgba(74, 101, 219, 0.12), transparent 34%),
              rgba(255, 254, 249, 0.88);
            box-shadow: 0 26px 75px rgba(29, 36, 27, 0.08);
          }

          .helix-flow-panel h2 {
            margin: 0;
            color: #232822;
            font-size: clamp(34px, 5vw, 58px);
            line-height: 1;
            letter-spacing: -2px;
          }

          .helix-flow-panel p {
            margin: 16px 0 0;
            color: #657062;
            font-size: 15px;
            line-height: 1.7;
          }

          .helix-steps {
            display: grid;
            gap: 12px;
          }

          .helix-step {
            display: grid;
            grid-template-columns: 52px 1fr;
            gap: 14px;
            align-items: start;
            padding: 16px;
            border: 1px solid #e5e9e1;
            border-radius: 20px;
            background: #fbfbf6;
            transition:
              transform 180ms ease,
              border-color 180ms ease,
              box-shadow 180ms ease;
          }

          .helix-step:hover {
            transform: translateX(5px);
            border-color: #cbd5ff;
            box-shadow: 0 16px 34px rgba(29, 36, 27, 0.08);
          }

          .helix-step-number {
            display: grid;
            place-items: center;
            width: 44px;
            height: 44px;
            border-radius: 16px;
            background: #253b75;
            color: white;
            font-weight: 850;
            font-size: 13px;
          }

          .helix-step h3 {
            margin: 0;
            color: #232822;
            font-size: 17px;
          }

          .helix-step p {
            margin: 5px 0 0;
            color: #657062;
            font-size: 13px;
            line-height: 1.5;
          }

          .helix-demo-section {
            padding: 72px 0 92px;
          }

          .helix-demo-card {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 330px;
            gap: 24px;
            align-items: center;
            padding: 32px;
            border: 1px solid #dfe4dc;
            border-radius: 34px;
            background:
              radial-gradient(circle at 18% 15%, rgba(85, 110, 220, 0.24), transparent 30%),
              #232822;
            color: white;
            box-shadow: 0 30px 85px rgba(29, 36, 27, 0.14);
          }

          .helix-demo-card .helix-eyebrow {
            color: #cfd9ff;
          }

          .helix-demo-card h2 {
            max-width: 760px;
            margin: 0;
            font-size: clamp(34px, 6vw, 64px);
            line-height: 0.98;
            letter-spacing: -2.4px;
          }

          .helix-demo-card p {
            max-width: 710px;
            margin: 16px 0 0;
            color: rgba(255, 255, 255, 0.72);
            font-size: 15px;
            line-height: 1.68;
          }

          .helix-demo-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .helix-demo-actions a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            min-height: 48px;
            padding: 0 16px;
            border-radius: 15px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 850;
            transition:
              transform 180ms ease,
              box-shadow 180ms ease;
          }

          .helix-demo-actions a:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 38px rgba(0, 0, 0, 0.18);
          }

          .helix-demo-actions a:first-child {
            background: white;
            color: #232822;
          }

          .helix-demo-actions a:last-child {
            border: 1px solid rgba(255, 255, 255, 0.22);
            color: white;
          }

          .helix-home-footer {
            width: min(1220px, calc(100% - 40px));
            margin: 0 auto;
            padding: 28px 0 40px;
            border-top: 1px solid #dfe4dc;
            display: flex;
            justify-content: space-between;
            gap: 20px;
            color: #657062;
          }

          .helix-home-footer strong {
            display: block;
            color: #232822;
            font-size: 17px;
          }

          .helix-home-footer p {
            margin: 5px 0 0;
            font-size: 13px;
            line-height: 1.5;
          }

          .helix-footer-note {
            max-width: 560px;
            text-align: right;
          }

          @keyframes helixAmbientShift {
            0% {
              --x: 16%;
              --y: 18%;
              opacity: 0.8;
            }

            100% {
              --x: 78%;
              --y: 32%;
              opacity: 1;
            }
          }

          @keyframes helixFadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes helixVisualEntrance {
            from {
              opacity: 0;
              transform: translateY(24px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes helixTextShimmer {
            0%,
            100% {
              background-position: 0% 50%;
            }

            50% {
              background-position: 100% 50%;
            }
          }

          @keyframes helixSparklePulse {
            0%,
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }

            50% {
              transform: scale(1.15) rotate(8deg);
              opacity: 0.78;
            }
          }

          @keyframes helixScan {
            0%,
            45% {
              left: -40%;
            }

            75%,
            100% {
              left: 115%;
            }
          }

          @keyframes helixAuroraSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes helixGridDrift {
            from {
              background-position: 0 0;
            }

            to {
              background-position: 34px 28px;
            }
          }

          @keyframes helixParticleFloat {
            0%,
            100% {
              transform: translateY(0) scale(1);
              opacity: 0.55;
            }

            50% {
              transform: translateY(-18px) scale(1.25);
              opacity: 1;
            }
          }

          @keyframes helixOrbitOne {
            from {
              transform: rotateX(66deg) rotateZ(5deg);
            }

            to {
              transform: rotateX(66deg) rotateZ(365deg);
            }
          }

          @keyframes helixOrbitTwo {
            from {
              transform: rotateY(62deg) rotateZ(-18deg);
            }

            to {
              transform: rotateY(62deg) rotateZ(342deg);
            }
          }

          @keyframes helixOrbitThree {
            from {
              transform: rotateX(72deg) rotateZ(-30deg);
            }

            to {
              transform: rotateX(72deg) rotateZ(330deg);
            }
          }

          @keyframes helixCorePulse {
            0%,
            100% {
              transform: translate(-50%, -50%) scale(1);
            }

            50% {
              transform: translate(-50%, -50%) scale(1.035);
            }
          }

          @keyframes helixGlowPulse {
            0%,
            100% {
              opacity: 0.45;
              transform: scale(0.92);
            }

            50% {
              opacity: 1;
              transform: scale(1.08);
            }
          }

          @keyframes helixCardFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes helixLineFlow {
            from {
              stroke-dashoffset: 0;
            }

            to {
              stroke-dashoffset: -30;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.001ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: 0.001ms !important;
            }
          }

          @media (max-width: 980px) {
            .helix-hero,
            .helix-section-heading,
            .helix-flow-panel,
            .helix-demo-card {
              grid-template-columns: 1fr;
            }

            .helix-hero {
              min-height: auto;
              padding-top: 42px;
            }

            .helix-feature-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .helix-hero-visual {
              min-height: 560px;
            }
          }

          @media (max-width: 650px) {
            .helix-home-page main,
            .helix-home-footer {
              width: min(100% - 28px, 1220px);
            }

            .helix-hero h1 {
              letter-spacing: -2.6px;
            }

            .helix-hero-search {
              align-items: stretch;
              flex-direction: column;
              padding: 16px;
            }

            .helix-hero-search a {
              width: 100%;
            }

            .helix-feature-grid {
              grid-template-columns: 1fr;
            }

            .helix-flow-panel,
            .helix-demo-card {
              padding: 22px;
            }

            .helix-home-footer {
              flex-direction: column;
            }

            .helix-footer-note {
              text-align: left;
            }

            .helix-hero-visual {
              min-height: 610px;
            }

            .helix-network-card {
              width: 138px;
            }

            .card-one,
            .card-three {
              left: 4%;
            }

            .card-two,
            .card-four {
              right: 4%;
            }
          }
        `}
      </style>

      <Navbar />

      <main>
        <section className="helix-hero">
          <div className="helix-hero-copy">
            <p className="helix-eyebrow">
              <Sparkles size={15} />

              AI-powered scientific research explorer
            </p>

            <h1>
              Ask a question.
              <span>
                Explore the evidence.
              </span>
            </h1>

            <p className="helix-hero-description">
              Helix helps students, builders, and early researchers turn
              complex scientific questions into interactive research maps,
              3D-style concept visuals, and evidence workspaces.
            </p>

            <div className="helix-hero-search">
              <Search size={22} />

              <span>
                What evidence connects SOD1 to ALS?
              </span>

              <Link to="/explore">
                Start researching

                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="helix-hero-actions">
              <Link
                to="/projects"
                className="helix-secondary-button"
              >
                <FolderKanban size={18} />

                View saved projects
              </Link>

              <a
                href="#how-it-works"
                className="helix-secondary-button"
              >
                See how it works
              </a>
            </div>
          </div>

          <div
            className="helix-hero-visual"
            aria-label="Helix research visualization preview"
          >
            <div className="helix-visual-grid" />

            <div className="helix-particle particle-one" />
            <div className="helix-particle particle-two" />
            <div className="helix-particle particle-three" />
            <div className="helix-particle particle-four" />

            <div className="helix-orbit helix-orbit-one" />
            <div className="helix-orbit helix-orbit-two" />
            <div className="helix-orbit helix-orbit-three" />

            <svg
              className="helix-visual-lines"
              viewBox="0 0 600 600"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line x1="300" y1="300" x2="120" y2="120" />
              <line x1="300" y1="300" x2="480" y2="135" />
              <line x1="300" y1="300" x2="115" y2="470" />
              <line x1="300" y1="300" x2="480" y2="465" />
            </svg>

            <div className="helix-core">
              <Brain />
            </div>

            <article className="helix-network-card card-one">
              <span>
                Research question
              </span>

              <strong>
                SOD1 and ALS
              </strong>

              <p>
                Start with a real scientific question.
              </p>
            </article>

            <article className="helix-network-card card-two">
              <span>
                Concept map
              </span>

              <strong>
                Genes, pathways, mechanisms
              </strong>

              <p>
                See how ideas connect.
              </p>
            </article>

            <article className="helix-network-card card-three">
              <span>
                Visualization
              </span>

              <strong>
                3D-style model
              </strong>

              <p>
                Explain the structure visually.
              </p>
            </article>

            <article className="helix-network-card card-four">
              <span>
                Evidence
              </span>

              <strong>
                Verify and review
              </strong>

              <p>
                Separate strong claims from uncertain ones.
              </p>
            </article>
          </div>
        </section>

        <section
          className="helix-section"
          id="platform"
        >
          <div className="helix-section-heading">
            <div>
              <p className="helix-eyebrow">
                <Atom size={15} />

                The platform
              </p>

              <h2>
                A research workflow built for understanding.
              </h2>
            </div>

            <p>
              Scientific information is often spread across papers,
              databases, diagrams, and search results. Helix organizes
              a question into connected concepts, visual models, and
              evidence levels so the user can investigate more clearly.
            </p>
          </div>

          <div className="helix-feature-grid">
            <article className="helix-feature-card">
              <div className="helix-feature-icon">
                <Network size={22} />
              </div>

              <small>
                01 / MAP
              </small>

              <h3>
                Interactive research maps
              </h3>

              <p>
                Turn a question into a network of concepts, mechanisms,
                relationships, and research directions.
              </p>
            </article>

            <article className="helix-feature-card">
              <div className="helix-feature-icon">
                <Orbit size={22} />
              </div>

              <small>
                02 / VISUALIZE
              </small>

              <h3>
                3D-style concept models
              </h3>

              <p>
                Show a spatial explanation of the research focus and its
                surrounding scientific concepts.
              </p>
            </article>

            <article className="helix-feature-card">
              <div className="helix-feature-icon">
                <ShieldCheck size={22} />
              </div>

              <small>
                03 / EVIDENCE
              </small>

              <h3>
                Evidence workspace
              </h3>

              <p>
                Sort claims by support level and identify concepts that
                need stronger verification.
              </p>
            </article>

            <article className="helix-feature-card">
              <div className="helix-feature-icon">
                <FolderKanban size={22} />
              </div>

              <small>
                04 / PROJECTS
              </small>

              <h3>
                Saved investigations
              </h3>

              <p>
                Save research questions locally, reopen projects, and
                continue exploring later.
              </p>
            </article>
          </div>
        </section>

        <section
          className="helix-flow-section"
          id="how-it-works"
        >
          <div className="helix-flow-panel">
            <div>
              <p className="helix-eyebrow">
                <Dna size={15} />

                How it works
              </p>

              <h2>
                From question to investigation.
              </h2>

              <p>
                Helix is designed to make research feel less like
                searching through scattered sources and more like moving
                through a structured scientific workspace.
              </p>
            </div>

            <div className="helix-steps">
              <article className="helix-step">
                <span className="helix-step-number">
                  01
                </span>

                <div>
                  <h3>
                    Ask
                  </h3>

                  <p>
                    Start with any scientific or biomedical research
                    question.
                  </p>
                </div>
              </article>

              <article className="helix-step">
                <span className="helix-step-number">
                  02
                </span>

                <div>
                  <h3>
                    Map
                  </h3>

                  <p>
                    Generate an interactive network of concepts and
                    relationships.
                  </p>
                </div>
              </article>

              <article className="helix-step">
                <span className="helix-step-number">
                  03
                </span>

                <div>
                  <h3>
                    Visualize
                  </h3>

                  <p>
                    Use the 3D-style view to explain the main idea and
                    surrounding mechanisms.
                  </p>
                </div>
              </article>

              <article className="helix-step">
                <span className="helix-step-number">
                  04
                </span>

                <div>
                  <h3>
                    Review evidence
                  </h3>

                  <p>
                    Sort claims into stronger, limited, and uncertain
                    evidence areas.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="helix-section">
          <div className="helix-section-heading">
            <div>
              <p className="helix-eyebrow">
                <FlaskConical size={15} />

                Built for demos
              </p>

              <h2>
                Clear enough for students. Structured enough for research.
              </h2>
            </div>

            <p>
              Helix is for research and education. It does not diagnose,
              treat, or prove scientific claims. It helps users organize
              questions, explore connections, and decide what needs to be
              verified next.
            </p>
          </div>
        </section>

        <section className="helix-demo-section">
          <div className="helix-demo-card">
            <div>
              <p className="helix-eyebrow">
                <BookOpen size={15} />

                Try the full workflow
              </p>

              <h2>
                Start a research question and build your investigation.
              </h2>

              <p>
                Create a map, open the visualization, review the evidence,
                and save the project to return later.
              </p>
            </div>

            <div className="helix-demo-actions">
              <Link to="/explore">
                Launch Research Explorer

                <ArrowRight size={18} />
              </Link>

              <Link to="/projects">
                View Projects

                <FolderKanban size={18} />
              </Link>

              <Link to="/graph">
                View Knowledge Graph

                <Network size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="helix-home-footer">
        <div>
          <strong>
            Helix
          </strong>

          <p>
            Scientific research intelligence for learning, exploration,
            and evidence organization.
          </p>
        </div>

        <p className="helix-footer-note">
          For research and educational purposes only. Computational
          findings and generated relationships require independent
          scientific validation.
        </p>
      </footer>
    </div>
  )
}
