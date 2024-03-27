import { defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { SortEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsCommentInterface, CommentInterface, InputCommentInterface, ModelsInterface } from '../interfaces';
import { CommentRepository, UserWorkspaceRepository } from '../repositories';
import { User } from '../core/models';
export class CommentService {
  private models: ModelsInterface; 
  private repository: CommentRepository;
  private userWorkspaceRepository: UserWorkspaceRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new CommentRepository(this.models);
    this.userWorkspaceRepository = new UserWorkspaceRepository();
  }

  async create(input: InputCommentInterface): Promise<CommentInterface> {
    return this.repository.create(input);
  }

  async findByPk(id: number): Promise<CommentInterface> {
    return this.repository.findByPk(id);
  }

  async findAndCountAll({     
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query, 
    campaignId, 
    emailTemplateId 
  }: ArgsCommentInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: CommentInterface[];
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

    if (cursor) {
      if (cursorSort === SortEnum.desc) {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.lt]: cursor },
        };
      } else {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.gt]: cursor },
        };
      }
    }
    if (query) {
      where = {
        ...where,
        [Sequelize.Op.or]: [
          SequlizeQueryGenerator.searchRegex({
            query,
            columns: ['name', 'slug'],
          }),
        ],
      };
    }
    if(campaignId) {
      where = {
        ...where,
        campaignId
      }
    }
    if(emailTemplateId) {
      where = {
        ...where,
        emailTemplateId
      }
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    
    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    const [count, cursorCount, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({ where: { ...cursorWhere, ...where },
         limit, 
         order: orderItem,
      }),
    ]);
    const response = rows.map(async comment => {
      const userWorkspace = await this.userWorkspaceRepository.findOne({
        where: {
          id: comment.createdById
        },
        include: [
          {
            model: User,
            as: 'user'
          }
        ]
      })
      comment.userWorkspace = userWorkspace;
    })
    await Promise.all(response);
    return { rows, count, cursorCount };
  }
}
