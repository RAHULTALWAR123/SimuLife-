import { motion } from "framer-motion";

const Loading = () => {

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-[300px] space-y-4"
      >
        {/* Animated spinner */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            },
            scale: {
              repeat: Infinity,
              duration: 1.2,
              repeatType: "reverse"
            }
          }}
          className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary border-r-primary"
        />
        
        {/* Loading text with fading animation */}
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity 
          }}
          className="text-lg font-medium text-primary/80"
        >
          Loading content...
        </motion.p>
        
        {/* Optional progress indicator */}
        <div className="w-48 h-1.5 bg-base-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </motion.div>
    );
  };

  export default Loading