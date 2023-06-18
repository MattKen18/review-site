import React from 'react'
import { motion } from 'framer-motion'

const ReplyingChatEntry = () => {
  return (
    <div>
      <motion.div
        className="w-20 h-6 bg-white"
        initial={{ scale: 0 }}
        animate={{ rotate: 180, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
      }}
      >

      </motion.div>
    </div>
  )
}

export default ReplyingChatEntry