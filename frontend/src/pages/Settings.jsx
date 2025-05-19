import { THEMES } from "../constants/theme";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <motion.div 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="container sm:mx-auto sm:px-6 sm:pt-8 sm:max-w-4xl">
      <div className="sm:space-y-8">
        {/* Theme Selection Section */}
        <div className="bg-base-100 sm:rounded-xl p-6 shadow-sm border-primary border-b-4 sm:border-base-200 ">
          <div className="flex items-center gap-3 mb-5">
            <Palette size={20} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Theme Preferences</h2>
              <p className="text-sm text-base-content/70">Customize your app interface appearance</p>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-2 p-2 rounded-xl transition-all
                  ${theme === t 
                    ? "ring-2 ring-primary ring-offset-2 bg-base-200" 
                    : "hover:bg-base-200/50 hover:scale-[1.02]"}
                `}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-10 w-full rounded-lg overflow-hidden shadow-inner" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-xs font-medium text-center capitalize">
                  {t.toLowerCase().replace(/-/g, ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-base-100 sm:rounded-xl p-6 shadow-sm border border-base-200">
          <div className="flex items-center gap-3 mb-5">
            <MessageSquare size={20} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Theme Preview</h2>
              <p className="text-sm text-base-content/70">See how your theme looks in a real chat</p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 rounded-t-xl text-base-content ">
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-primary flex items-center gap-3 rounded-t-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                    R
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Rahul</h3>
                  <p className="text-xs text-base-content/60 flex items-center gap-1">
                    
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 min-h-[240px] max-h-[240px] overflow-y-auto bg-base-300">
                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[85%] rounded-2xl p-3 shadow-sm transition-all
                        ${message.isSent 
                          ? "bg-primary text-primary-content rounded-br-none" 
                          : "bg-base-200 rounded-bl-none"}
                      `}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex justify-end mt-1">
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-base-300 bg-base-200">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-11 focus:ring-1 focus:ring-primary/30"
                    placeholder="Type a message..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-11 min-h-0 px-3 rounded-lg hover:scale-105 transition-transform">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;