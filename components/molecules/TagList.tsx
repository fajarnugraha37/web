"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tag, ChevronDown } from "lucide-react";

interface TagListProps {
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  isMobile: boolean;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export function TagList({
  allTags,
  selectedTags,
  toggleTag,
  clearTags,
  isMobile,
  isExpanded,
  toggleExpanded,
}: TagListProps) {
  const shouldExpand = isMobile ? isExpanded : true;

  return (
    <div className="bg-card border border-border cyber-chamfer relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
        <Tag className="w-8 h-8" />
      </div>

      <div className="flex flex-col">
        <button
          type="button"
          onClick={toggleExpanded}
          className={`flex justify-between items-center px-4 py-4 md:pt-4 md:pb-2 md:mb-2 md:border-b md:border-border w-full text-left ${
            isMobile ? "cursor-pointer" : "cursor-default"
          } group/header`}
        >
          <h3 className="text-sm font-sans font-bold text-foreground uppercase tracking-widest flex items-center gap-2 group-hover/header:text-accent md:group-hover/header:text-foreground transition-colors">
            / TAGS
            {selectedTags.length > 0 && (
              <span className="text-[10px] font-mono text-accent">
                ({selectedTags.length})
              </span>
            )}
          </h3>

          <div className="flex items-center gap-3">
            {selectedTags.length > 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  clearTags();
                }}
                className="text-[10px] font-mono text-destructive hover:text-white transition-colors flex items-center gap-1 border border-destructive/30 px-2 py-0.5 cyber-chamfer-sm bg-destructive/5"
              >
                CLEAR
              </div>
            )}
            <ChevronDown
              className={`w-4 h-4 text-accent transition-transform md:hidden ${
                shouldExpand ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {shouldExpand && (
            <motion.div
              key="tags-content"
              initial={isMobile ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden md:!h-auto md:!opacity-100"
            >
              <div className="px-4 pb-4 md:px-4 md:pb-4 flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs font-mono uppercase px-2 py-1 cyber-chamfer-sm transition-all border ${
                        isSelected
                          ? "bg-accent text-black border-accent shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                          : "bg-transparent border-border text-muted-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
