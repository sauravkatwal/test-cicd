import { CommentInterface, InputCommentInterface, ModelsInterface } from "../interfaces";
import { BaseRepository } from "./baseRepository";

export class CommentRepository extends BaseRepository<
InputCommentInterface,
CommentInterface
> {
  constructor(models: ModelsInterface) {
    super(models.Comment);
  }
}
