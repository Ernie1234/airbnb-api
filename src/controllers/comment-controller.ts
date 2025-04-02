import { Request, Response } from 'express';

import HTTP_STATUS from '../constants/http-status';
import { noCommentMsg, noListingMsg, noUserMsg, serverErrorMsg, successCommentMsg } from '../constants/messages';
import Logger from '../libs/logger';
import Listing from '../models/listing';
import User from '../models/user';
import Comment from '../models/comment';

export const createComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { listingId, content, rating } = req.body;
    const userId = req.user?.userId;

    // Check if user exists
    const user = await User.findById(userId).select('-password');
    if (!user) {
      Logger.error(noUserMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noUserMsg,
      });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      Logger.error(noListingMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noListingMsg,
      });
    }

    // Create new comment
    const newComment = new Comment({
      userId,
      listingId,
      content,
      rating,
    });

    await newComment.save();

    Logger.info(`Comment created: ${newComment.id}`);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: successCommentMsg,
      data: newComment,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { commentId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user?.userId;

    // Find and update comment
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, userId },
      { content, rating },
      { new: true },
    );

    if (!updatedComment) {
      Logger.error(noCommentMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noCommentMsg,
      });
    }

    Logger.info(`Comment updated: ${commentId}`);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.userId;

    // Find and delete comment
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      userId,
    });

    if (!deletedComment) {
      Logger.error(noCommentMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noCommentMsg,
      });
    }

    Logger.info(`Comment deleted: ${commentId}`);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};

export const getCommentsByListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { listingId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      Logger.error(noListingMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noListingMsg,
      });
    }

    // Get comments with pagination and populate user details
    const comments = await Comment.find({ listingId })
      .populate('userId', 'name imageSrc createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalComments = await Comment.countDocuments({ listingId });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Comments fetched successfully',
      data: {
        comments,
        total: totalComments,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};

export const getCommentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .populate('userId', 'name imageSrc createdAt')
      .populate('listingId');

    if (!comment) {
      Logger.error(noCommentMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noCommentMsg,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Comment fetched successfully',
      data: comment,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};
