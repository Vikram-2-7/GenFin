const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

/**
 * GET /api/chat/history
 * Get chat history for the authenticated user
 */
router.get('/history', async (req, res) => {
  try {
    // For now, use a simple user ID. In production, this would come from authentication
    const userId = req.user?.id || 'default-user';
    
    const messages = await ChatMessage.find({ userId })
      .sort({ timestamp: 1 })
      .limit(50)
      .lean();
    
    return res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Chat History Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch chat history'
    });
  }
});

/**
 * POST /api/chat/message
 * Save a new message to the database
 */
router.post('/message', async (req, res) => {
  try {
    const { role, content } = req.body;
    
    if (!role || !content) {
      return res.status(400).json({
        success: false,
        error: 'Role and content are required'
      });
    }
    
    if (!['user', 'assistant'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be either "user" or "assistant"'
      });
    }
    
    // For now, use a simple user ID. In production, this would come from authentication
    const userId = req.user?.id || 'default-user';
    
    const message = new ChatMessage({
      userId,
      role,
      content
    });
    
    await message.save();
    
    return res.status(201).json({
      success: true,
      message: {
        _id: message._id,
        userId: message.userId,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp
      }
    });
  } catch (error) {
    console.error('Save Message Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to save message'
    });
  }
});

/**
 * DELETE /api/chat/history
 * Clear all chat messages for the user
 */
router.delete('/history', async (req, res) => {
  try {
    // For now, use a simple user ID. In production, this would come from authentication
    const userId = req.user?.id || 'default-user';
    
    const result = await ChatMessage.deleteMany({ userId });
    
    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to clear chat history'
    });
  }
});

module.exports = router;
