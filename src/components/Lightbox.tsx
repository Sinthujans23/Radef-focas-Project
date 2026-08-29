"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) {
  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (src) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [src]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (src) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-maroon-900/80 text-gold-400 border border-gold-500 hover:bg-maroon-950 transition shadow-xl text-xl"
            title="Close"
          >
            ✕
          </button>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full max-w-full rounded-sm border-8 border-gold-600 shadow-[0_0_50px_rgba(201,161,59,0.3)] bg-maroon-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={src} 
              alt="Expanded view" 
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
            <div className="absolute -inset-1 border-2 border-gold-300 pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
