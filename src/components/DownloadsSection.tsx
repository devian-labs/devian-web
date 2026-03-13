import { useEffect, useState } from "react";
import { ChevronDown, Download, Terminal, Copy } from "lucide-react";
import pkgData from "../../package.json";

interface Asset {
    name: string;
    browser_download_url: string;
    size: number;
}

interface GithubRelease {
    id: number;
    name: string;
    tag_name: string;
    published_at: string;
    html_url: string;
    assets: Asset[];
}

export function DownloadsSection() {
    const [releases, setReleases] = useState<GithubRelease[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedQuarantine, setCopiedQuarantine] = useState(false);

    useEffect(() => {
        fetch("https://api.github.com/repos/devian-labs/devian-web/releases")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setReleases(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch releases", err);
                setLoading(false);
            });
    }, []);

    const getTargetAssetUrl = (assets: Asset[], extension: string) =>
        assets.find((a) => a.name.endsWith(extension))?.browser_download_url;

    const getTargetAssetSize = (assets: Asset[], extension: string) => {
        const asset = assets.find((a) => a.name.endsWith(extension));
        if (!asset) return null;
        return (asset.size / (1024 * 1024)).toFixed(1) + " MB";
    };

    const latestRelease = releases.length > 0 ? releases[0] : null;
    const oldReleases = releases.length > 1 ? releases.slice(1) : [];

    const macLink = latestRelease
        ? getTargetAssetUrl(latestRelease.assets, ".dmg")
        : `/downloads/v${pkgData.version}/Devian.Desktop_${pkgData.version}_aarch64.dmg`;

    const macSize = latestRelease
        ? getTargetAssetSize(latestRelease.assets, ".dmg")
        : "9.8 MB";

    const handleCopyCommand = () => {
        navigator.clipboard.writeText(
            ["brew tap devian-labs/tap", "brew install --cask devian-desktop"].join("\n")
        );

        setCopied(true);

        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "copy_brew_command", {
                event_category: "engagement",
                event_label: "macOS Terminal",
            });
        }

        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyQuarantine = () => {
        navigator.clipboard.writeText(
            "xattr -dr com.apple.quarantine /Applications/Devian\\ Desktop.app"
        );

        setCopiedQuarantine(true);

        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "copy_quarantine_command", {
                event_category: "engagement",
                event_label: "macOS quarantine fix",
            });
        }

        setTimeout(() => setCopiedQuarantine(false), 2000);
    };

    const trackDownload = (version: string, type: "latest" | "old") => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", `download_mac_dmg_${type}`, {
                event_category: "download",
                event_label: version,
            });
        }
    };

    return (
        <section
            id="download"
            className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto text-center border-t border-white/[0.05]"
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight">
                Ready to take control?
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/50 mb-10 md:mb-16 font-light">
                Download the latest version of Devian Desktop for your platform.
            </p>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">

                    {/* Homebrew Install */}
                    <div className="w-full max-w-2xl bg-[#0A0A0C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-white/50" />
                                <span className="text-xs font-mono text-white/50">
                                    Install with Homebrew
                                </span>
                            </div>

                            <button
                                onClick={handleCopyCommand}
                                className="text-white/40 hover:text-white transition flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
                            >
                                <Copy className="h-3.5 w-3.5" />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>

                        <div className="p-6">
                            <code className="text-sm md:text-base font-mono text-[#4ADE80] whitespace-pre text-left block">
$ brew tap devian-labs/tap
{"\n"}$ brew install --cask devian-desktop
                            </code>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 w-full max-w-2xl">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-xs text-white/40 uppercase tracking-widest">
                            Or Download Directly
                        </span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    {/* macOS Download */}
                    <a
                        href={macLink || "#"}
                        download={!!macLink}
                        onClick={() => {
                            if (macLink)
                                trackDownload(
                                    latestRelease?.tag_name || `v${pkgData.version}`,
                                    "latest"
                                );
                        }}
                        className="bg-white hover:bg-white/90 text-black p-8 rounded-[32px] flex items-center gap-6 transition-all group w-full max-w-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
                    >
                        <div className="h-16 w-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center shadow-inner">
                            <AppleLogo className="h-8 w-8 text-black" />
                        </div>

                        <div className="text-left">
                            <div className="text-xs font-bold uppercase tracking-widest text-black/50 mb-1">
                                macOS (Apple Silicon)
                            </div>
                            <div className="text-2xl font-black">Download .dmg</div>
                            {macSize && (
                                <div className="text-xs text-black/50 mt-1">{macSize}</div>
                            )}
                        </div>
                    </a>

                    {/* Quarantine Fix */}
                    <div className="w-full max-w-2xl bg-[#0A0A0C] border border-yellow-500/20 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="bg-yellow-500/10 px-4 py-3 border-b border-yellow-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-yellow-400" />
                                <span className="text-xs font-mono text-yellow-300">
                                    If macOS blocks Devian Desktop
                                </span>
                            </div>

                            <button
                                onClick={handleCopyQuarantine}
                                className="text-yellow-200/70 hover:text-yellow-100 transition flex items-center gap-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1.5 rounded-lg"
                            >
                                <Copy className="h-3.5 w-3.5" />
                                {copiedQuarantine ? "Copied!" : "Copy"}
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-xs text-white/60 mb-4 text-left">
                                macOS may block the app because it is not yet notarized by Apple.
                                Run the command below to remove the quarantine flag.
                            </p>

                            <code className="text-sm md:text-base font-mono text-[#4ADE80] whitespace-pre text-left block">
$ xattr -dr com.apple.quarantine /Applications/Devian\ Desktop.app
                            </code>
                        </div>
                    </div>

                    <p className="text-xs md:text-sm text-white/40 font-medium">
                        Current Version:{" "}
                        <span className="text-white/80">
                            {latestRelease?.tag_name || `v${pkgData.version}`}
                        </span>{" "}
                        • Requires macOS 12+
                    </p>

                    {/* Version History */}
                    <div className="mt-12 md:mt-16 w-full max-w-2xl">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center justify-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium mx-auto"
                        >
                            View Version History
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                    showHistory ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {showHistory && oldReleases.length > 0 && (
                            <div className="mt-8 md:mt-10 bg-[#0A0A0C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                <table className="min-w-full divide-y divide-white/5">
                                    <thead className="bg-white/5 border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-4 text-white/90">Version</th>
                                            <th className="px-6 py-4 text-white/90">Release Date</th>
                                            <th className="px-6 py-4 text-white/90">macOS</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/5">
                                        {oldReleases.map((release) => {
                                            const mLink = getTargetAssetUrl(
                                                release.assets,
                                                ".dmg"
                                            );

                                            return (
                                                <tr key={release.id}>
                                                    <td className="px-6 py-4 text-white">
                                                        {release.tag_name}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {new Date(
                                                            release.published_at
                                                        ).toLocaleDateString()}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {mLink ? (
                                                            <a
                                                                href={mLink}
                                                                download
                                                                onClick={() =>
                                                                    trackDownload(
                                                                        release.tag_name,
                                                                        "old"
                                                                    )
                                                                }
                                                                className="text-white hover:underline flex items-center gap-1.5"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                                .dmg
                                                            </a>
                                                        ) : (
                                                            <span className="text-white/20">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

function AppleLogo({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="currentColor"
        >
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9z" />
        </svg>
    );
}