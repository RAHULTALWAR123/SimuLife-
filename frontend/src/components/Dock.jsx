/* eslint-disable react/prop-types */
"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Children, cloneElement, useEffect, useState, useRef } from "react";

function DockItem({
    children,
    className = "",
    onClick,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
  }) {
    const ref = useRef(null);
    const isHovered = useMotionValue(0);
  
    const mouseDistance = useTransform(mouseX, (val) => {
      const rect = ref.current?.getBoundingClientRect() ?? {
        x: 0,
        width: baseItemSize,
      };
      return val - rect.x - baseItemSize / 2;
    });
  
    const targetSize = useTransform(
      mouseDistance,
      [-distance, 0, distance],
      [baseItemSize, magnification, baseItemSize]
    );
    const size = useSpring(targetSize, spring);
  
    const handleTouchStart = () => {
      isHovered.set(1);
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(rect.x + rect.width / 2);
      }
    };
  
    return (
      <motion.div
        ref={ref}
        style={{
          width: size,
          height: size,
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onTouchStart={handleTouchStart}
        onTouchEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center sm:rounded-2xl rounded-xl bg-base-100 border-primary border-2 sm:shadow-md shadow-sm shadow-primary ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
      >
        {Children.map(children, (child) =>
          cloneElement(child, { isHovered })
        )}
      </motion.div>
    );
  }

  function DockLabel({ children, className = "", ...rest }) {
    const { isHovered } = rest;
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const unsubscribe = isHovered.on("change", (latest) => {
        setIsVisible(latest === 1);
      });
      return () => unsubscribe();
    }, [isHovered]);
  
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-lg bg-base-300 px-2 py-0.5 text-xs text-base-content`}
            role="tooltip"
            style={{ x: "-50%" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  function DockIcon({ children, className = "" }) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {children}
      </div>
    );
  }

// Update the Dock component props and styles
export default function Dock({
    items,
    className = "",
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelHeight = 64,
    dockHeight = 256,
    baseItemSize = 50,
    smPanelHeight = 64,
    smBaseItemSize = 44,
    smMagnification = 60,
  }) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 640);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const heightRow = useTransform(
      isHovered,
      [0, 1],
      [
        isMobile ? smPanelHeight : panelHeight,
        isMobile ? smMagnification + smMagnification / 2 : magnification + magnification / 2,
      ]
    );
    const height = useSpring(heightRow, spring);
  
    const handleMouseMove = (event) => {
      isHovered.set(1);
      mouseX.set(event.pageX);
    };
  
    const handleTouchMove = (event) => {
      isHovered.set(1);
      mouseX.set(event.touches[0].pageX);
    };
  
    return (
      <motion.div
        style={{ height }}
        className="mx-2 flex max-w-full items-center overflow-visible"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={() => {
            isHovered.set(0);
            mouseX.set(Infinity);
          }}
          onTouchEnd={() => {
            isHovered.set(0);
            mouseX.set(Infinity);
          }}
          className={`${className} absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-full sm:w-fit sm:gap-4 gap-2 rounded-2xl border-base-100 bg-base-300 border-2 pb-2 px-2 overflow-visible`}
          style={{ 
            height: isMobile ? smPanelHeight : panelHeight,
            maxWidth: isMobile ? '95vw' : 'auto',
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'visible',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          role="toolbar"
          aria-label="Application dock"
        >
          {items.map((item, index) => (
            <DockItem
              key={index}
              onClick={item.onClick}
              className={item.className}
              mouseX={mouseX}
              spring={spring}
              distance={isMobile ? distance / 1.5 : distance}
              magnification={isMobile ? smMagnification : magnification}
              baseItemSize={isMobile ? smBaseItemSize : baseItemSize}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel className="sm:text-sm text-xs">{item.label}</DockLabel>
            </DockItem>
          ))}
        </motion.div>
      </motion.div>
    );
  }