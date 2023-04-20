import {
  GraphQLNonNull,
  GraphQLString,
  type GraphQLFieldConfig
} from 'graphql';
import { connectionFromArray } from 'graphql-relay';

import { NotFoundError } from '@/errors';
import type { Context } from '@/types';

import { UserLoader } from '../../UserLoader';
import { UserConnection } from '../../UserType';
import type { UserQueryArgs } from './UserQuery.types';

export const UserQuery: GraphQLFieldConfig<any, Context, UserQueryArgs> = {
  description: 'Get user by credentials',
  type: new GraphQLNonNull(UserConnection),
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args) => {
    const userLoader = UserLoader.getInstance();

    const userData = await userLoader.loadByCredentials(args);
    if (!userData)
      throw new NotFoundError('User not found with given credentials');

    return connectionFromArray([userData], args);
  }
};
