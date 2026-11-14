import { useState, useRef } from 'react';
import { Mic, Play, Sparkles, AlertCircle, Headphones } from 'lucide-react';
import { generatePodcast } from '@/lib/podcast';

type Status = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setStatus('error');
      setStatusMessage('Please type a podcast topic first!');
      setAudioUrl(null);
      return;
    }

    setStatus('loading');
    setStatusMessage('Creating podcast... please wait!');
    setAudioUrl(null);

    try {
      const audioFile = await generatePodcast(topic.trim());

      setAudioUrl(audioFile);
      setStatus('success');
      setStatusMessage('Podcast is ready! Click play to listen');
      setTopic('');
    } catch {
      setStatus('error');
      setStatusMessage('Oops! Something went wrong. Please try again');
      setAudioUrl(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-sky-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 shadow-lg mb-4">
            <Mic className="w-10 h-10 text-rose-500" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-700 tracking-tight">
            Podcast Generator
          </h1>
          <p className="text-slate-500 mt-2 text-base sm:text-lg">
            Turn any topic into a podcast
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-white">
          {/* Input */}
          <label
            htmlFor="topic-input"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            What would you like to hear about?
          </label>
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type podcast topic here..."
            disabled={status === 'loading'}
            className="w-full px-5 py-4 rounded-2xl border-2 border-rose-100 bg-rose-50/50 text-slate-700 placeholder-rose-300 focus:outline-none focus:border-rose-300 focus:bg-white transition-all duration-200 text-base disabled:opacity-60"
          />

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            className="w-full mt-4 py-4 px-6 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-rose-400 to-amber-400 hover:from-rose-500 hover:to-amber-500 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🔊</span>
            <span>Generate Podcast</span>
          </button>

          {/* Loading Animation */}
          {status === 'loading' && (
            <div className="mt-6 flex flex-col items-center gap-3 animate-fadeIn">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 animate-pulse-dot [animation-delay:0ms]"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse-dot [animation-delay:200ms]"></span>
                <span className="w-3 h-3 rounded-full bg-sky-400 animate-pulse-dot [animation-delay:400ms]"></span>
              </div>
              <p className="text-slate-500 font-medium text-sm">
                {statusMessage}
              </p>
            </div>
          )}

          {/* Audio Player Area */}
          {status !== 'loading' && (
            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-5 animate-fadeIn">
              {status === 'idle' && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Headphones className="w-8 h-8 text-slate-300" />
                  <p className="text-slate-400 text-center font-medium">
                    Podcast will appear here.
                  </p>
                </div>
              )}

              {status === 'success' && audioUrl && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Sparkles className="w-5 h-5" />
                    <p className="font-semibold text-sm">{statusMessage}</p>
                  </div>
                  <audio
                    ref={audioRef}
                    controls
                    src={audioUrl}
                    className="w-full"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-rose-500 justify-center py-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium text-sm text-center">
                    {statusMessage}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-6">
          Made with care for podcast lovers
        </p>
      </div>
    </div>
  );
}

export default App;
