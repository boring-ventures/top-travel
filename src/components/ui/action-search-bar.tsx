"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  PlaneTakeoff,
  MapPin,
  Calendar,
  Users,
  Heart,
  Star,
  Globe,
  Camera,
} from "lucide-react";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  href?: string;
}

interface SearchResult {
  actions: Action[];
}

const allActions = [
  {
    id: "1",
    label: "Buscar Destinos",
    icon: <MapPin className="h-4 w-4 text-blue-500" />,
    description: "Explorar lugares",
    href: "/destinations",
  },
  {
    id: "2",
    label: "Paquetes de Viaje",
    icon: <PlaneTakeoff className="h-4 w-4 text-green-500" />,
    description: "Ofertas especiales",
    href: "/packages",
  },
  {
    id: "3",
    label: "Eventos Especiales",
    icon: <Calendar className="h-4 w-4 text-purple-500" />,
    description: "Quinceañeras y bodas",
    href: "/events",
  },
  {
    id: "4",
    label: "Salidas Fijas",
    icon: <Users className="h-4 w-4 text-orange-500" />,
    description: "Grupos organizados",
    href: "/fixed-departures",
  },
];

function ActionSearchBar({
  actions = allActions,
  onActionSelect,
  placeholder = "¿A dónde vas?",
  className = "",
}: {
  actions?: Action[];
  onActionSelect?: (action: Action) => void;
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!isFocused) {
      setResult(null);
      return;
    }

    if (!debouncedQuery) {
      setResult({ actions: actions });
      return;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const filteredActions = actions.filter((action) => {
      const searchableText =
        `${action.label} ${action.description || ""}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    setResult({ actions: filteredActions });
  }, [debouncedQuery, isFocused, actions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
    if (onActionSelect) {
      onActionSelect(action);
    }
    if (action.href) {
      window.location.href = action.href;
    }
    setQuery("");
    setIsFocused(false);
  };

  const container = {
    hidden: { opacity: 0, blockSize: 0 },
    show: {
      opacity: 1,
      blockSize: "auto",
      transition: {
        blockSize: {
          duration: 0.4,
        },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      blockSize: 0,
      transition: {
        blockSize: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Reset selectedAction when focusing the input
  const handleFocus = () => {
    setSelectedAction(null);
    setIsFocused(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to packages page with search query
      window.location.href = `/packages?search=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className={`!w-full ${className}`}>
      <div className="relative flex flex-col justify-start items-center">
        <div
          className="!w-full sticky top-0 z-30 bg-white/55 border border-gray-200/30 rounded-[3rem] shadow-2xl"
          style={{
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            isolation: "isolate",
          }}
        >
          <div className="relative">
            <form onSubmit={handleSubmit} className="!w-full relative z-10">
              <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className="!w-full pl-8 pr-16 py-4 h-16 text-xl rounded-[3rem] focus-visible:ring-offset-0 bg-transparent border-0 text-gray-900 placeholder:text-gray-600 focus:border-corporate-blue focus:ring-2 focus:ring-corporate-blue/20 transition-all duration-300"
                style={{ inlineSize: "100%" }}
              />
            </form>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 z-20">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="w-6 h-6 text-corporate-blue" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="w-6 h-6 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full">
          <AnimatePresence>
            {isFocused && result && !selectedAction && (
              <motion.div
                className="w-full border rounded-[3rem] shadow-2xl overflow-hidden bg-white/90 border-gray-200/30 mt-2 relative z-30"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                }}
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul>
                  {result.actions.map((action) => (
                    <motion.li
                      key={action.id}
                      className="px-6 py-4 flex items-center hover:bg-corporate-blue/10 cursor-pointer transition-all duration-300 rounded-2xl mx-2 my-1"
                      variants={item}
                      layout
                      onClick={() => handleActionClick(action)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700">{action.icon}</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {action.label}
                        </span>
                        <span className="text-base text-gray-600">
                          {action.description}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="px-6 py-4 border-t border-gray-200/30 bg-gray-50/50">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Presiona Enter para buscar</span>
                    <span>ESC para cancelar</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export { ActionSearchBar };
