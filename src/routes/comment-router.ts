import express, { Router } from 'express';
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByListing,
  getCommentById,
} from '../controllers/comment-controller';
import { authenticationJWT } from '../middlewares/auth-middleware';
import {
  validateCreateComment,
  validateUpdateComment,
  validateCommentId,
  validateListingComments,
} from '../middlewares/comment-middleware';

const commentId = '/:commentId';

const commentRoutes: Router = express.Router();

commentRoutes.post('/', authenticationJWT, validateCreateComment, createComment);
// eslint-disable-next-line max-len
commentRoutes.put(commentId, authenticationJWT, validateCommentId, validateUpdateComment, updateComment);
commentRoutes.delete(commentId, authenticationJWT, validateCommentId, deleteComment);
commentRoutes.get('/listing/:listingId', validateListingComments, getCommentsByListing);
commentRoutes.get(commentId, validateCommentId, getCommentById);

export default commentRoutes;
