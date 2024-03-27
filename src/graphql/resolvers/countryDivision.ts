import { InformationEvent } from 'http';
import { defaultOrder, defaultSort, pgMaxLimit, pgMinLimit } from '../../config';
import { SuccessResponse } from '../../helpers';
import {
  ArgsCountryDivisionInterface,
  ContextInterface,
  } from '../../interfaces';
import { Guard,  } from '../../middlewares';
import { CountryDivisionService } from '../../services';


export const  countryDivisionResolvers = {
  Mutation: { },
  Query: {
    countryDivisions: async (
      parent: ParentNode,
      args: ArgsCountryDivisionInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      
      let { offset, limit, query, sort, order, type, state, country} = args;
      offset = offset && offset > 0 ? offset - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      query = query ? query : undefined;
      order = order ? order : defaultOrder;
      sort = sort ? sort : defaultSort;
      type = type ? type : undefined;
      state = state ? state : undefined;
      country = country ? country : undefined;

      const { count, rows } = await new CountryDivisionService().findAndCountAll({
        offset,
        limit,
        query,
        sort,
        order,
        type,
        state,
        country,   
        });
      return SuccessResponse.send({
        message: 'Country Division list is successfully fetched.',
        data: rows,
        count: count,
      });
    },
    countryDivision: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const data = await new CountryDivisionService().findByPk(args.id);
      return SuccessResponse.send({
        message: 'Country Division details is successfully fetched.',
        data: data,
      });
    },
  },
};
