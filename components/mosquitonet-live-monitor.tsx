"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  AudioWaveform,
  Battery,
  Bell,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Download,
  Filter,
  Globe2,
  HardDrive,
  Layers,
  Mic,
  Minus,
  Navigation,
  Pause,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sliders,
  Sparkles,
  Terminal,
  User,
  Volume2,
  VolumeX,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { KERALA_ALERTS, KERALA_NODES } from "./kerala-sample-data";

// Types
export interface NodeData {
  id: string;
  species: string;
  commonName: string;
  freq: number; // in Hz
  risk: "Critical" | "High" | "Elevated" | "Moderate";
  time: string;
  coord: string;
  confidence: number;
  latPct: number;
  lonPct: number;
  tone: "red" | "orange" | "cyan" | "green";
  status: "ONLINE" | "STANDBY" | "CALIBRATING";
  battery: number;
  signalDbm: number;
  firmware: string;
  harmonics: number[];
  waveformPath: string;
}

export interface VectorAlert {
  id: string;
  timestamp: string;
  region: string;
  nodeId: string;
  species: string;
  severity: "CRITICAL" | "HIGH" | "ELEVATED" | "INFO";
  frequency: string;
  detectedCount: number;
  recommendation: string;
  acknowledged: boolean;
}

const INITIAL_NODES: NodeData[] = [
  {
    id: "KER-540",
    species: "Aedes albopictus",
    commonName: "Asian Tiger Mosquito",
    freq: 540,
    risk: "Critical",
    time: "14:25:10 UTC",
    coord: "Kochi · Ernakulam",
    confidence: 96.8,
    latPct: 53,
    lonPct: 70,
    tone: "red",
    status: "ONLINE",
    battery: 92,
    signalDbm: -64,
    firmware: "v4.2.1-PROD",
    harmonics: [540, 1080, 1620, 2160],
    waveformPath: "M0,35 L15,35 L28,30 L40,35 L55,20 L62,5 L70,38 L80,12 L92,35 L110,25 L125,35 L140,18 L155,35 L175,32 L200,35",
  },
  {
    id: "KIN-480",
    species: "Anopheles gambiae",
    commonName: "African Malaria Vector",
    freq: 480,
    risk: "High",
    time: "14:21:08 UTC",
    coord: "Thiruvananthapuram · Kazhakkoottam",
    confidence: 94.2,
    latPct: 56,
    lonPct: 51,
    tone: "red",
    status: "ONLINE",
    battery: 87,
    signalDbm: -72,
    firmware: "v4.2.1-PROD",
    harmonics: [480, 960, 1440, 1920],
    waveformPath: "M0,35 L20,35 L30,34 L40,35 L55,33 L65,30 L75,35 L85,25 L92,5 L97,38 L104,18 L110,35 L125,32 L140,35 L160,34 L180,35 L200,35",
  },
  {
    id: "SGP-620",
    species: "Aedes aegypti",
    commonName: "Yellow Fever / Dengue Mosquito",
    freq: 620,
    risk: "Elevated",
    time: "14:22:45 UTC",
    coord: "Alappuzha · Ambalappuzha",
    confidence: 88.4,
    latPct: 61,
    lonPct: 76,
    tone: "orange",
    status: "ONLINE",
    battery: 95,
    signalDbm: -58,
    firmware: "v4.2.2-STABLE",
    harmonics: [620, 1240, 1860, 2480],
    waveformPath: "M0,35 L25,35 L35,32 L48,35 L60,26 L70,10 L78,38 L88,14 L100,35 L115,28 L130,35 L145,22 L160,35 L180,34 L200,35",
  },
  {
    id: "AMZ-390",
    species: "Culex quinquefasciatus",
    commonName: "Southern House Mosquito",
    freq: 390,
    risk: "Moderate",
    time: "14:19:12 UTC",
    coord: "Kollam · Kottarakkara",
    confidence: 76.4,
    latPct: 64,
    lonPct: 29,
    tone: "cyan",
    status: "STANDBY",
    battery: 79,
    signalDbm: -81,
    firmware: "v4.1.9-LTS",
    harmonics: [390, 780, 1170, 1560],
    waveformPath: "M0,35 L20,35 L35,33 L50,35 L68,28 L80,18 L90,36 L102,24 L115,35 L135,30 L150,35 L170,32 L185,35 L200,35",
  },
  {
    id: "CTG-515",
    species: "Anopheles stephensi",
    commonName: "Urban Malaria Mosquito",
    freq: 515,
    risk: "High",
    time: "14:24:02 UTC",
    coord: "Malappuram · Manjeri",
    confidence: 91.4,
    latPct: 49,
    lonPct: 73,
    tone: "red",
    status: "ONLINE",
    battery: 84,
    signalDbm: -68,
    firmware: "v4.2.1-PROD",
    harmonics: [515, 1030, 1545, 2060],
    waveformPath: "M0,35 L18,35 L32,31 L45,35 L58,22 L68,8 L76,37 L86,16 L98,35 L112,26 L128,35 L142,20 L158,35 L180,33 L200,35",
  },
  {
    id: "BKK-580",
    species: "Aedes albopictus",
    commonName: "Asian Tiger (SE Asia Corridor)",
    freq: 580,
    risk: "Elevated",
    time: "14:27:00 UTC",
    coord: "Kannur · Thalassery",
    confidence: 89.2,
    latPct: 50,
    lonPct: 75,
    tone: "orange",
    status: "ONLINE",
    battery: 91,
    signalDbm: -62,
    firmware: "v4.2.2-STABLE",
    harmonics: [580, 1160, 1740, 2320],
    waveformPath: "M0,35 L20,35 L35,28 L50,35 L65,18 L75,6 L85,36 L95,14 L110,35 L130,24 L150,35 L175,30 L200,35",
  },
];

const INITIAL_ALERTS: VectorAlert[] = [
  {
    id: "ALT-904",
    timestamp: "2 mins ago",
    region: "Kochi & Ernakulam Corridor (India)",
    nodeId: "KER-540",
    species: "Aedes albopictus",
    severity: "CRITICAL",
    frequency: "540 Hz",
    detectedCount: 486,
    recommendation: "Deploy biological larvicide misting along coastal residential cells.",
    acknowledged: false,
  },
  {
    id: "ALT-903",
    timestamp: "6 mins ago",
    region: "Kinshasa River Basin (DRC)",
    nodeId: "KIN-480",
    species: "Anopheles gambiae",
    severity: "HIGH",
    frequency: "480 Hz",
    detectedCount: 312,
    recommendation: "Notify municipal vector prevention teams. Heightened nocturnal feeding window.",
    acknowledged: false,
  },
  {
    id: "ALT-902",
    timestamp: "18 mins ago",
    region: "Singapore Straits Industrial Zone",
    nodeId: "SGP-620",
    species: "Aedes aegypti",
    severity: "ELEVATED",
    frequency: "620 Hz",
    detectedCount: 198,
    recommendation: "Inspect maritime drainage sumps and roof gutters in Sector 4.",
    acknowledged: true,
  },
  {
    id: "ALT-901",
    timestamp: "44 mins ago",
    region: "Chittagong Port Perimeter (Bangladesh)",
    nodeId: "CTG-515",
    species: "Anopheles stephensi",
    severity: "HIGH",
    frequency: "515 Hz",
    detectedCount: 265,
    recommendation: "Flag container storage yard for overhead UV trap density boost.",
    acknowledged: true,
  },
];

export default function MosquitoNetLiveMonitor() {
  const [activeTab, setActiveTab] = useState<
    "live-surveillance-map" | "acoustic-spectrogram-vault" | "sensor-node-telemetry" | "vector-alert-stream"
  >("live-surveillance-map");

  const [nodes, setNodes] = useState<NodeData[]>([...INITIAL_NODES, ...KERALA_NODES]);
  const [alerts, setAlerts] = useState<VectorAlert[]>([...INITIAL_ALERTS, ...KERALA_ALERTS]);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(INITIAL_NODES[0]);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [projection, setProjection] = useState<"2d" | "3d">("2d");
  const [zoomScale, setZoomScale] = useState(1);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [liveCoords, setLiveCoords] = useState("AREA: Kochi · Ernakulam");
  const [reportCoords, setReportCoords] = useState("Kochi · Ernakulam");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Audio tone playback state (Web Audio API)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioFreq, setAudioFreq] = useState(540);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Search & Filter state
  const [nodeSearch, setNodeSearch] = useState("");
  const [nodeRiskFilter, setNodeRiskFilter] = useState("ALL");
  const [alertSeverityFilter, setAlertSeverityFilter] = useState("ALL");

  // Mouse move live coordinate tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth) * 360 - 180;
      const yPercent = 90 - (e.clientY / window.innerHeight) * 180;
      const latDeg = Math.abs(Math.floor(yPercent)).toString().padStart(2, "0");
      const latMin = Math.abs(Math.floor((yPercent % 1) * 60)).toString().padStart(2, "0");
      const latDir = yPercent >= 0 ? "N" : "S";
      const lonDeg = Math.abs(Math.floor(xPercent)).toString().padStart(3, "0");
      const lonMin = Math.abs(Math.floor((xPercent % 1) * 60)).toString().padStart(2, "0");
      const lonDir = xPercent >= 0 ? "E" : "W";
      setLiveCoords("AREA: " + ["Kasaragod", "Kannur", "Kozhikode", "Malappuram", "Palakkad", "Thrissur", "Ernakulam", "Kottayam", "Alappuzha", "Kollam", "Thiruvananthapuram"][Math.min(10, Math.floor((e.clientX / window.innerWidth) * 11))] + " district");
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Play / Stop synthetic bio-acoustic wingbeat frequency using Web Audio API
  const togglePlayAudio = (freq: number) => {
    if (isPlayingAudio) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtxClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtxClass();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = "sawtooth"; // Rich insect wingbeat harmonic profile
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

        // Low volume to be comfortable
        gain.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setAudioFreq(freq);
        setIsPlayingAudio(true);
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
    };
  }, []);

  const handleZoom = (factor: number) => {
    setZoomScale((prev) => Math.min(Math.max(prev * factor, 0.8), 2.5));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
  };

  const handleInspect = (node: NodeData) => {
    setSelectedNode(node);
    setInspectorOpen(true);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === alertId ? { ...alt, acknowledged: true } : alt)),
    );
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setReportModalOpen(false);
      const userNode: NodeData = {
        id: "SUB-USR",
        species: "Aedes albopictus",
        commonName: "Field Capture (Acoustic Verified)",
        freq: 610,
        risk: "Critical",
        time: "Just now",
        coord: reportCoords,
        confidence: 98.4,
        latPct: 52,
        lonPct: 68,
        tone: "red",
        status: "ONLINE",
        battery: 99,
        signalDbm: -55,
        firmware: "v4.2.2-USER",
        harmonics: [610, 1220, 1830, 2440],
        waveformPath: "M0,35 L12,35 L24,30 L38,35 L50,15 L58,4 L66,38 L76,10 L88,35 L105,22 L120,35 L135,16 L150,35 L170,30 L200,35",
      };
      setNodes((prev) => [userNode, ...prev]);
      setSelectedNode(userNode);
      setInspectorOpen(true);
      setActiveTab("live-surveillance-map");
    }, 750);
  };

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchSearch =
        n.id.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        n.species.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        n.coord.toLowerCase().includes(nodeSearch.toLowerCase());
      const matchRisk = nodeRiskFilter === "ALL" || n.risk.toUpperCase() === nodeRiskFilter.toUpperCase();
      return matchSearch && matchRisk;
    });
  }, [nodes, nodeSearch, nodeRiskFilter]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (alertSeverityFilter === "ALL") return true;
      return a.severity === alertSeverityFilter;
    });
  }, [alerts, alertSeverityFilter]);

  return (
    <div className="min-h-screen bg-[#0c141e] font-sans text-[#dbe3f2] antialiased select-none">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0c0e]/95 backdrop-blur-md border-b border-[#1e232a]">
        <div className="h-14 w-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/monitor" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-[#ff553e] to-[#ffb4a7] flex items-center justify-center shadow-lg shadow-[#ff553e]/25">
                <Radio size={18} className="text-[#400100] stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[13px] font-semibold uppercase tracking-wider text-[#dbe3f2] leading-none">
                  MosquitoNet
                </span>
                <span className="font-mono text-[10px] text-[#ac8983] tracking-widest uppercase mt-0.5">
                  Bio-Acoustic Recon
                </span>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#18202b] border border-[#1e232a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4a7] animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#ffb4a7]">
                LIVE BIO-ACOUSTIC FEED
              </span>
            </div>
          </div>

          {/* Interactive Button Navigation Tabs */}
          <nav className="flex items-center gap-1 font-mono text-[11px] uppercase overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab("live-surveillance-map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors rounded cursor-pointer whitespace-nowrap ${
                activeTab === "live-surveillance-map"
                  ? "bg-[#2d3541] text-[#dbe3f2] font-semibold shadow"
                  : "text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#232a36]"
              }`}
            >
              <Globe2 size={13} className={activeTab === "live-surveillance-map" ? "text-[#ff553e]" : "text-[#ac8983]"} />
              <span>Surveillance Map</span>
            </button>

            <button
              onClick={() => setActiveTab("acoustic-spectrogram-vault")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors rounded cursor-pointer whitespace-nowrap ${
                activeTab === "acoustic-spectrogram-vault"
                  ? "bg-[#2d3541] text-[#dbe3f2] font-semibold shadow"
                  : "text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#232a36]"
              }`}
            >
              <AudioWaveform size={13} className={activeTab === "acoustic-spectrogram-vault" ? "text-[#63d5f2]" : "text-[#ac8983]"} />
              <span>Spectrogram Vault</span>
            </button>

            <button
              onClick={() => setActiveTab("sensor-node-telemetry")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors rounded cursor-pointer whitespace-nowrap ${
                activeTab === "sensor-node-telemetry"
                  ? "bg-[#2d3541] text-[#dbe3f2] font-semibold shadow"
                  : "text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#232a36]"
              }`}
            >
              <HardDrive size={13} className={activeTab === "sensor-node-telemetry" ? "text-[#2edb91]" : "text-[#ac8983]"} />
              <span>Node Network ({nodes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("vector-alert-stream")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors rounded cursor-pointer whitespace-nowrap ${
                activeTab === "vector-alert-stream"
                  ? "bg-[#2d3541] text-[#dbe3f2] font-semibold shadow"
                  : "text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#232a36]"
              }`}
            >
              <Bell size={13} className={activeTab === "vector-alert-stream" ? "text-[#ff553e]" : "text-[#ac8983]"} />
              <span>Vector Alerts</span>
              {alerts.filter((a) => !a.acknowledged).length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#ff553e] text-[#5b0300] text-[9px] font-bold">
                  {alerts.filter((a) => !a.acknowledged).length}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-[#ac8983] font-mono text-[10px]">
              <Wifi size={14} className="text-[#63d5f2]" />
              <span>GRID: SYNCED</span>
            </div>
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#ff553e] text-[#5b0300] font-mono text-[11px] font-bold uppercase px-3 py-1.5 rounded shadow hover:bg-[#ff7b68] transition-colors cursor-pointer"
            >
              <Send size={13} />
              <span className="hidden sm:inline">Report</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#ffb4a7] flex items-center justify-center text-[#680300] shadow-md">
              <User size={15} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-14 bg-[#0c141e]">
        {/* ========================================================================= */}
        {/* TAB 1: SURVEILLANCE MAP VIEW */}
        {/* ========================================================================= */}
        {activeTab === "live-surveillance-map" && (
          <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0c141e]">
            {/* Coordinate Graticule Grid */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#63d5f2" strokeOpacity="0.15" strokeWidth="0.5" />
                  <circle cx="0" cy="0" r="1" fill="#63d5f2" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              <line x1="0" y1="48%" x2="100%" y2="48%" stroke="#63d5f2" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.25" />
              <line x1="0" y1="28%" x2="100%" y2="28%" stroke="#ac8983" strokeWidth="0.5" strokeDasharray="2 8" opacity="0.15" />
              <line x1="0" y1="68%" x2="100%" y2="68%" stroke="#ac8983" strokeWidth="0.5" strokeDasharray="2 8" opacity="0.15" />
            </svg>

            {/* World Vector Map Canvas */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                id="geo-canvas"
                viewBox="0 0 1000 480"
                className="w-[96%] max-w-[1400px] h-auto opacity-75 transition-all duration-700 ease-out"
                style={{
                  transform: `scale(${zoomScale})`,
                  filter:
                    projection === "3d"
                      ? "drop-shadow(0px 10px 40px rgba(99,213,242,0.15)) perspective(700px) rotateX(20deg)"
                      : "none",
                }}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hotspot glows */}
                <circle cx="280" cy="270" r="60" fill="#ff553e" className="blur-2xl opacity-15 animate-pulse" />
                <circle cx="530" cy="245" r="75" fill="#ff553e" className="blur-3xl opacity-20" />
                <circle cx="700" cy="255" r="50" fill="#ff553e" className="blur-2xl opacity-25 animate-pulse" />
                <circle cx="780" cy="285" r="70" fill="#ffb59a" className="blur-2xl opacity-15" />

                <g fill="#141c27" opacity="0.9">
                  <path d="M140,85 L180,80 L235,90 L260,120 L275,155 L245,175 L215,200 L195,215 L175,190 L160,175 L130,135 Z" />
                  <path d="M225,50 L270,45 L290,75 L245,80 Z" />
                  <path d="M205,225 L230,245 L250,265 L240,270 L220,250 Z" />
                  <path d="M260,275 L310,285 L350,320 L330,380 L300,430 L285,445 L275,395 L250,330 L245,295 Z" />
                  <path d="M470,85 L525,80 L545,115 L520,145 L480,150 L460,130 L455,100 Z" />
                  <path d="M440,95 L460,95 L450,120 L435,115 Z" />
                  <path d="M465,165 L540,165 L570,225 L580,265 L550,335 L525,370 L495,350 L460,260 L450,205 Z" />
                  <path d="M575,310 L590,325 L580,360 L570,345 Z" />
                  <path d="M555,80 L650,70 L780,85 L845,110 L870,160 L830,205 L770,220 L730,255 L690,240 L650,210 L585,170 L560,125 Z" />
                  <path d="M685,250 L720,265 L705,310 L675,280 Z" stroke="#ff553e" strokeWidth="1" strokeOpacity="0.4" />
                  <path d="M745,265 L785,280 L805,305 L785,325 L755,300 Z" />
                  <path d="M780,330 L830,340 L810,360 L765,350 Z" />
                  <path d="M790,360 L860,350 L895,390 L880,430 L820,440 L780,405 Z" />
                </g>
              </svg>
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,#070f19_100%)]"></div>

            {/* Active Nodes on Map */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isRed = node.tone === "red";
              const isOrange = node.tone === "orange";

              return (
                <div
                  key={node.id}
                  onClick={() => handleInspect(node)}
                  style={{ top: `${node.latPct}%`, left: `${node.lonPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute rounded-full animate-ping ${
                        isRed ? "w-8 h-8 bg-[#ff553e]/25" : isOrange ? "w-9 h-9 bg-[#ffb59a]/20" : "w-7 h-7 bg-[#63d5f2]/25"
                      }`}
                    />
                    <span
                      className={`absolute rounded-full ${
                        isRed ? "w-4 h-4 bg-[#ff553e]/40" : isOrange ? "w-3.5 h-3.5 bg-[#ffb59a]/30" : "w-3.5 h-3.5 bg-[#63d5f2]/30"
                      }`}
                    />
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isRed
                          ? "bg-[#ff553e] shadow-[0_0_10px_#ff553e]"
                          : isOrange
                            ? "bg-[#ffb59a] shadow-[0_0_10px_#ffb59a]"
                            : "bg-[#63d5f2] shadow-[0_0_8px_#63d5f2]"
                      } ${isSelected ? "ring-2 ring-white scale-125" : ""}`}
                    />

                    {/* Micro Hover Flag */}
                    <div className="absolute left-5 -top-3 hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#18202b]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-[#2d3541]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isRed ? "bg-[#ff553e] animate-pulse" : isOrange ? "bg-[#ffb59a]" : "bg-[#63d5f2]"
                        }`}
                      />
                      <span className="font-mono text-[10px] text-[#dbe3f2] tracking-wide whitespace-nowrap">
                        {node.freq} Hz · {node.species}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Top-Left Hero Overlay */}
            <div className="absolute top-6 left-6 max-w-lg z-20 pointer-events-auto">
              <div className="bg-[#070f19]/85 backdrop-blur-xl p-6 rounded-xl border border-[#232a36] shadow-2xl flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#ff553e] animate-pulse"></span>
                  <span className="font-mono text-[10px] tracking-widest text-[#ac8983] uppercase">
                    Global Sensor Grid Active
                  </span>
                  <span className="font-mono text-[10px] text-[#2d3541] font-semibold">/</span>
                  <span className="font-mono text-[10px] text-[#63d5f2]">{nodes.length * 802} ACOUSTIC NODES</span>
                </div>

                <p className="text-[16px] text-[#dbe3f2] font-light leading-relaxed">
                  Autonomous bio-acoustic surveillance &amp; real-time vector activity tracking.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="group flex items-center gap-2 bg-[#ff553e] text-[#5b0300] font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded shadow-lg shadow-[#ff553e]/25 hover:bg-[#ff7b68] transition-colors cursor-pointer"
                  >
                    <Send size={15} className="transition-transform group-hover:rotate-45" />
                    <span>Report a mosquito</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("acoustic-spectrogram-vault")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded border border-[#2d3541] bg-[#141c27] text-[#dbe3f2] font-mono text-[10px] hover:bg-[#232a36] transition-colors cursor-pointer"
                  >
                    <AudioWaveform size={13} className="text-[#63d5f2]" />
                    <span>Launch Vault</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slide-Over Floating Telemetry HUD */}
            {selectedNode && inspectorOpen && (
              <div className="absolute top-6 right-6 w-80 max-w-[calc(100vw-3rem)] z-30 transition-all duration-300 ease-out">
                <div className="bg-[#070f19]/92 backdrop-blur-xl rounded-xl p-5 border border-[#232a36] shadow-2xl flex flex-col gap-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff553e] animate-ping" />
                      <span className="font-mono text-[11px] tracking-widest text-[#ff553e] font-semibold uppercase">
                        {selectedNode.id}
                      </span>
                    </div>
                    <button
                      onClick={() => setInspectorOpen(false)}
                      className="text-[#e5beb7] hover:text-[#dbe3f2] p-1 rounded hover:bg-[#232a36] transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Species Details */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] text-[#ac8983] uppercase tracking-wider">
                      Target Species Identification
                    </span>
                    <h4 className="text-[19px] text-[#dbe3f2] italic font-medium">
                      {selectedNode.species}
                    </h4>
                    <span className="text-[12px] text-[#ac8983]">{selectedNode.commonName}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#232a36] text-[#63d5f2]">
                        {selectedNode.freq} Hz
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#ff553e]/20 text-[#ffb4a7]">
                        {selectedNode.risk}
                      </span>
                    </div>
                  </div>

                  {/* Spectrogram Mini Visualizer */}
                  <div className="flex flex-col gap-1 bg-[#141c27] p-3 rounded border border-[#1e232a]">
                    <div className="flex items-center justify-between text-[#e5beb7] font-mono text-[10px]">
                      <span>SPECTROGRAM SWEEP</span>
                      <span className="text-[#ff553e] font-mono">CONF: {selectedNode.confidence}%</span>
                    </div>

                    <svg className="w-full h-12 text-[#ff553e] overflow-visible" fill="none" viewBox="0 0 200 40">
                      <defs>
                        <linearGradient id="spectro-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ff553e" />
                          <stop offset="100%" stopColor="#ff553e" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={selectedNode.waveformPath}
                        stroke="#ff553e"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d={`${selectedNode.waveformPath} L200,40 L0,40 Z`} fill="url(#spectro-grad)" opacity="0.15" />
                    </svg>

                    <div className="flex justify-between font-mono text-[9px] text-[#ac8983] opacity-70">
                      <span>200 Hz</span>
                      <span>500 Hz</span>
                      <span>800 Hz</span>
                    </div>
                  </div>

                  {/* Tone Audio Player Action Button */}
                  <button
                    onClick={() => togglePlayAudio(selectedNode.freq)}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#18202b] hover:bg-[#232a36] border border-[#2d3541] text-[#dbe3f2] font-mono text-[11px] transition-colors cursor-pointer"
                  >
                    {isPlayingAudio && audioFreq === selectedNode.freq ? (
                      <>
                        <Pause size={14} className="text-[#ff553e]" />
                        <span>Mute Flight Tone ({selectedNode.freq} Hz)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} className="text-[#63d5f2]" />
                        <span>Play Flight Tone ({selectedNode.freq} Hz)</span>
                      </>
                    )}
                  </button>

                  {/* Place & Timestamp */}
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#e5beb7] pt-1 border-t border-[#1e232a]">
                    <span>{selectedNode.coord}</span>
                    <span className="text-[#ac8983]">{selectedNode.time}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tactical Micro Controls */}
            <div className="absolute bottom-12 right-6 flex flex-col items-end gap-2.5 z-20 pointer-events-auto">
              <div className="flex items-center bg-[#070f19]/85 backdrop-blur-md p-1 rounded border border-[#232a36] shadow-lg">
                <button
                  onClick={() => setProjection("2d")}
                  className={`font-mono text-[10px] uppercase px-3 py-1 rounded transition-colors cursor-pointer ${
                    projection === "2d" ? "bg-[#232a36] text-[#dbe3f2] font-semibold" : "text-[#e5beb7] hover:text-[#dbe3f2]"
                  }`}
                >
                  2D Flat
                </button>
                <button
                  onClick={() => setProjection("3d")}
                  className={`font-mono text-[10px] uppercase px-3 py-1 rounded transition-colors cursor-pointer ${
                    projection === "3d" ? "bg-[#232a36] text-[#dbe3f2] font-semibold" : "text-[#e5beb7] hover:text-[#dbe3f2]"
                  }`}
                >
                  3D Sphere
                </button>
              </div>

              <div className="flex flex-col bg-[#070f19]/85 backdrop-blur-md rounded border border-[#232a36] shadow-lg overflow-hidden">
                <button
                  onClick={() => handleZoom(1.15)}
                  className="w-8 h-8 flex items-center justify-center text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#232a36] transition-colors cursor-pointer"
                  title="Magnify Viewport"
                >
                  <Plus size={16} />
                </button>
                <div className="h-[1px] w-full bg-[#2d3541]/40" />
                <button
                  onClick={() => handleZoom(0.87)}
                  className="w-8 h-8 flex items-center justify-center text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#232a36] transition-colors cursor-pointer"
                  title="Demagnify Viewport"
                >
                  <Minus size={16} />
                </button>
              </div>

              <button
                onClick={handleResetZoom}
                className="w-8 h-8 flex items-center justify-center bg-[#070f19]/85 backdrop-blur-md text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#232a36] rounded border border-[#232a36] shadow-lg transition-colors cursor-pointer"
                title="Recenter Grid"
              >
                <Crosshair size={15} />
              </button>
            </div>

            {/* Bottom Global Ticker Strip */}
            <div className="absolute bottom-0 left-0 right-0 h-9 bg-[#070f19]/92 backdrop-blur-md flex items-center justify-between px-6 z-20 border-t border-[#1e232a] text-[#ac8983] font-mono text-[10px]">
              <div className="flex items-center gap-4 truncate">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#63d5f2]"></span>
                  <span className="text-[#dbe3f2] font-medium">SENSOR GRID: CALIBRATED</span>
                </div>
                <span className="hidden md:inline text-[#2d3541]">/</span>
                <span className="hidden md:inline">BANDWIDTH: 350-750 HZ</span>
                <span className="hidden sm:inline text-[#2d3541]">/</span>
                <span className="hidden sm:inline">SAMPLE RATE: 96 KHZ 24-BIT</span>
                <span className="hidden lg:inline text-[#2d3541]">/</span>
                <span className="hidden lg:inline text-[#ff553e]">VECTOR SURGE DETECTED: EQUATORIAL BELT</span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[#dbe3f2] font-mono">{liveCoords}</span>
                <span className="w-1 h-3 bg-[#2d3541]" />
                <span className="text-[#63d5f2]">SYNC: 99.98%</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ACOUSTIC SPECTROGRAM VAULT */}
        {/* ========================================================================= */}
        {activeTab === "acoustic-spectrogram-vault" && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e232a] pb-6">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#63d5f2] uppercase tracking-wider">
                  <AudioWaveform size={14} />
                  <span>Bio-Acoustic Spectrogram Repository</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#dbe3f2] mt-1">
                  Wingbeat Frequency Analysis &amp; Harmonics
                </h1>
                <p className="text-[14px] text-[#ac8983] mt-1">
                  Real-time FFT audio spectrum identification of mosquito flight signatures.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePlayAudio(audioFreq)}
                  className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer shadow-lg ${
                    isPlayingAudio
                      ? "bg-[#ff553e] text-[#5b0300] shadow-[#ff553e]/30"
                      : "bg-[#63d5f2] text-[#003641] shadow-[#63d5f2]/30 hover:bg-[#85e1f7]"
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX size={15} />
                      <span>Stop Frequency ({audioFreq} Hz)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={15} />
                      <span>Synthesize Wingbeat Tone</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Spectrogram Frequency Spectrum Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isTonePlaying = isPlayingAudio && audioFreq === node.freq;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`rounded-xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? "bg-[#141c27] border-[#63d5f2] shadow-[0_0_20px_rgba(99,213,242,0.15)] ring-1 ring-[#63d5f2]/40"
                        : "bg-[#0f1722] border-[#232a36] hover:border-[#384556] hover:bg-[#141c27]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#232a36] text-[#63d5f2]">
                          {node.id}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                            node.risk === "Critical"
                              ? "bg-[#ff553e]/20 text-[#ffb4a7]"
                              : node.risk === "High"
                                ? "bg-[#ffb59a]/20 text-[#ffb59a]"
                                : "bg-[#63d5f2]/20 text-[#63d5f2]"
                          }`}
                        >
                          {node.risk}
                        </span>
                      </div>

                      <h3 className="text-[17px] font-semibold text-[#dbe3f2] italic">{node.species}</h3>
                      <p className="text-[12px] text-[#ac8983]">{node.commonName}</p>
                    </div>

                    {/* Waveform Visualization Canvas */}
                    <div className="bg-[#070f19] p-3 rounded-lg border border-[#1e232a]">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#ac8983] mb-1">
                        <span>DOMINANT PEAK</span>
                        <span className="text-[#63d5f2] font-bold">{node.freq} Hz</span>
                      </div>
                      <svg className="w-full h-14 overflow-visible" fill="none" viewBox="0 0 200 40">
                        <path d={node.waveformPath} stroke="#63d5f2" strokeWidth="2" strokeLinecap="round" />
                        <path d={`${node.waveformPath} L200,40 L0,40 Z`} fill="#63d5f2" opacity="0.12" />
                      </svg>
                      <div className="flex justify-between font-mono text-[9px] text-[#ac8983] mt-1 opacity-70">
                        <span>Harmonics: {node.harmonics.slice(0, 3).join(" · ")} Hz</span>
                        <span>Conf: {node.confidence}%</span>
                      </div>
                    </div>

                    {/* Audio Preview Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1e232a]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayAudio(node.freq);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                          isTonePlaying
                            ? "bg-[#ff553e] text-[#5b0300]"
                            : "bg-[#1f2835] text-[#dbe3f2] hover:bg-[#2d3848]"
                        }`}
                      >
                        {isTonePlaying ? <Pause size={12} /> : <Play size={12} />}
                        <span>{isTonePlaying ? "Mute Tone" : "Play Tone"}</span>
                      </button>

                      <span className="font-mono text-[10px] text-[#ac8983]">{node.coord}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SENSOR NODE TELEMETRY */}
        {/* ========================================================================= */}
        {activeTab === "sensor-node-telemetry" && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e232a] pb-6">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#2edb91] uppercase tracking-wider">
                  <HardDrive size={14} />
                  <span>Bio-Acoustic Hardware Grid Status</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#dbe3f2] mt-1">
                  Autonomous Sensor Nodes Network
                </h1>
                <p className="text-[14px] text-[#ac8983] mt-1">
                  Active field microphones with embedded DSP neural frequency classifiers.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-[#141c27] px-3 py-1.5 rounded border border-[#2d3541] text-xs">
                  <Search size={14} className="text-[#ac8983] mr-2" />
                  <input
                    type="text"
                    placeholder="Search node or species..."
                    value={nodeSearch}
                    onChange={(e) => setNodeSearch(e.target.value)}
                    className="bg-transparent text-[#dbe3f2] font-mono text-xs focus:outline-none w-36 sm:w-48"
                  />
                </div>

                <div className="flex overflow-hidden rounded border border-[#2d3541] bg-[#141c27] font-mono text-[10px]">
                  {["ALL", "CRITICAL", "HIGH", "MODERATE"].map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setNodeRiskFilter(risk)}
                      className={`px-3 py-1.5 transition-colors cursor-pointer ${
                        nodeRiskFilter === risk ? "bg-[#2d3541] text-[#dbe3f2] font-bold" : "text-[#ac8983] hover:text-white"
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nodes Table List */}
            <div className="overflow-x-auto rounded-xl border border-[#232a36] bg-[#0f1722]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#141c27] text-[#ac8983] uppercase tracking-wider border-b border-[#232a36] text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Node ID</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Target Species</th>
                    <th className="py-3.5 px-4">Freq Peak</th>
                    <th className="py-3.5 px-4">Place / area</th>
                    <th className="py-3.5 px-4">Battery</th>
                    <th className="py-3.5 px-4">Signal</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e232a]">
                  {filteredNodes.map((node) => (
                    <tr
                      key={node.id}
                      onClick={() => {
                        setSelectedNode(node);
                        setActiveTab("live-surveillance-map");
                        setInspectorOpen(true);
                      }}
                      className="hover:bg-[#182330] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-[#63d5f2]">{node.id}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2edb91]/15 text-[#2edb91] text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2edb91] animate-pulse" />
                          {node.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#dbe3f2]">
                        <div className="font-sans italic">{node.species}</div>
                        <div className="text-[10px] text-[#ac8983]">{node.commonName}</div>
                      </td>
                      <td className="py-3 px-4 text-[#ff553e] font-semibold">{node.freq} Hz</td>
                      <td className="py-3 px-4 text-[#ac8983]">{node.coord}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[#dbe3f2]">
                          <Battery size={13} className="text-[#2edb91]" />
                          <span>{node.battery}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#ac8983]">{node.signalDbm} dBm</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(node);
                            setActiveTab("live-surveillance-map");
                            setInspectorOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-[#63d5f2] hover:underline"
                        >
                          <span>Inspect</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: VECTOR ALERT STREAM */}
        {/* ========================================================================= */}
        {activeTab === "vector-alert-stream" && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e232a] pb-6">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#ff553e] uppercase tracking-wider">
                  <ShieldAlert size={14} />
                  <span>Real-Time Biosecurity Intelligence Feed</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#dbe3f2] mt-1">
                  Vector Density &amp; Outbreak Surges
                </h1>
                <p className="text-[14px] text-[#ac8983] mt-1">
                  High-frequency alerts flagged automatically when wingbeat acoustic thresholds are breached.
                </p>
              </div>

              {/* Severity filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#ac8983] font-mono">Severity:</span>
                <div className="flex overflow-hidden rounded border border-[#2d3541] bg-[#141c27] font-mono text-[10px]">
                  {["ALL", "CRITICAL", "HIGH", "ELEVATED"].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setAlertSeverityFilter(sev)}
                      className={`px-3 py-1.5 transition-colors cursor-pointer ${
                        alertSeverityFilter === sev ? "bg-[#2d3541] text-[#dbe3f2] font-bold" : "text-[#ac8983] hover:text-white"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alert Cards Feed */}
            <div className="flex flex-col gap-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl border p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    alert.severity === "CRITICAL"
                      ? "bg-[#181112] border-[#ff553e]/40 shadow-[0_0_20px_rgba(255,85,62,0.12)]"
                      : "bg-[#141c27] border-[#232a36]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${
                        alert.severity === "CRITICAL" ? "bg-[#ff553e]/20 text-[#ff553e]" : "bg-[#ffb59a]/20 text-[#ffb59a]"
                      }`}
                    >
                      <AlertTriangle size={20} />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] font-bold text-[#ff553e]">{alert.id}</span>
                        <span className="text-[#2d3541]">·</span>
                        <span className="font-mono text-[10px] text-[#ac8983]">{alert.timestamp}</span>
                        <span className="text-[#2d3541]">·</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#232a36] text-[#63d5f2]">
                          {alert.nodeId}
                        </span>
                      </div>

                      <h3 className="text-[17px] font-semibold text-[#dbe3f2] mt-1">{alert.region}</h3>
                      <div className="text-[13px] text-[#e5beb7] italic mt-0.5">
                        Vector: <span className="font-semibold">{alert.species}</span> ({alert.frequency}) · {alert.detectedCount} catches / 24h
                      </div>
                      <p className="text-[12px] text-[#ac8983] mt-2 bg-[#0c141e] p-2.5 rounded border border-[#1e232a]">
                        <span className="text-[#dbe3f2] font-semibold">Action:</span> {alert.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {alert.acknowledged ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#2edb91] font-mono">
                        <CheckCircle2 size={14} />
                        <span>Acknowledged</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-4 py-2 rounded bg-[#ff553e] hover:bg-[#ff7b68] text-[#5b0300] font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer shadow"
                      >
                        Acknowledge Alert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Report a Mosquito */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070f19]/85 backdrop-blur-md transition-opacity">
            <div className="bg-[#141c27] max-w-md w-full mx-4 p-6 rounded-xl border border-[#2d3541] shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#ff553e]">
                  <Mic size={20} />
                  <h3 className="text-[18px] font-semibold text-[#dbe3f2]">Report Acoustic Incident</h3>
                </div>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="text-[#e5beb7] hover:text-[#dbe3f2] p-1 rounded hover:bg-[#232a36] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-[13px] text-[#e5beb7] leading-relaxed">
                Upload an audio recording or specify a Kerala place to flag suspected malaria or dengue vector frequencies
                directly to the surveillance telemetry grid.
              </p>

              <form onSubmit={handleSubmitReport} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-[#ac8983] uppercase tracking-wider">
                    Kerala Observation Place
                  </label>
                  <div className="flex items-center bg-[#0c141e] rounded px-3 py-2 gap-2 border border-[#2d3541]">
                    <Navigation size={15} className="text-[#ac8983]" />
                    <input
                      className="bg-transparent text-[#dbe3f2] font-mono text-[12px] w-full focus:outline-none"
                      type="text"
                      value={reportCoords}
                      onChange={(e) => setReportCoords(e.target.value)}
                      placeholder="Kochi · Ernakulam"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-[#ac8983] uppercase tracking-wider">
                    Acoustic Audio Capture (.wav, .flac, .mp3)
                  </label>
                  <div className="flex flex-col items-center justify-center p-6 rounded bg-[#0c141e]/60 border border-dashed border-[#2d3541] hover:bg-[#0c141e] transition-colors cursor-pointer group">
                    <Mic size={28} className="text-[#ac8983] group-hover:text-[#ff553e] transition-colors mb-1.5" />
                    <span className="font-mono text-[11px] text-[#dbe3f2]">Drop flight tone sample or tap to record</span>
                    <span className="text-[10px] text-[#ac8983] mt-0.5">Target frequency threshold: 300 - 800 Hz</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="font-mono text-[11px] uppercase px-4 py-2 rounded text-[#e5beb7] hover:text-[#dbe3f2] hover:bg-[#18202b] transition-colors cursor-pointer"
                    onClick={() => setReportModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittedMessage}
                    className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase px-4 py-2 rounded bg-[#ff553e] text-[#5b0300] hover:bg-[#ff7b68] transition-colors shadow-lg shadow-[#ff553e]/20 cursor-pointer"
                  >
                    {submittedMessage ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Submitted!</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Submit Observation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
