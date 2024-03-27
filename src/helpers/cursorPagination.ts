import { SortEnum } from "../enums";
import { defaultCursor, pgMaxLimit, pgMinLimit } from "../config";
import {
  CursorInputInterface,
  CursorInterface,
  CursorPaginationOrderSearchExtend,
  PageInfoInterface,
} from "../interfaces";
import { Base64 } from "./base64";

class CursorPagination {
  private static instance: CursorPagination;

  private constructor() {}

  static get(): CursorPagination {
    if (!CursorPagination.instance) {
      CursorPagination.instance = new CursorPagination();
    }
    return CursorPagination.instance;
  }

  cursor({ cursorCount, count, rows, cursor, limit }: CursorInputInterface): {
    data: CursorInterface[];
    pageInfo: PageInfoInterface;
  } {
    return {
      data: this.addCursor(rows),
      pageInfo: this.getPageInfo({
        rows,
        count,
        cursorCount,
        cursor,
        limit,
      }),
    };
  }

  addCursor(rows: any[]): CursorInterface[] {
    return rows.map((row: any, i: any) => ({
      cursor: Base64.encodeCursor(row[defaultCursor]),
      node: row,
    }));
  }

  getPageInfo({
    cursorCount,
    cursor,
    count,
    rows,
  }: CursorInputInterface): PageInfoInterface {
    const edges = this.addCursor(rows);
    const [start] = edges;
    const end = edges[edges.length - 1];
    const remaining = cursorCount - edges.length;

    const hasNextPage =
      (!cursor && remaining > 0) ||
      (Boolean(cursor) && count - cursorCount > 0 && remaining > 0);

    const hasPreviousPage =
      (Boolean(cursor) && remaining >= 0) ||
      (!cursor && count - cursorCount > 0);

    return {
      count: count,
      endCursor: end?.cursor,
      hasNextPage: hasNextPage,
      hasPreviousPage: hasPreviousPage,
      startCursor: start?.cursor,
    };
  }

  getCursorQuery({
    before,
    last,
    after,
    first,
    query,
    sort,
    order,
  }: CursorPaginationOrderSearchExtend): CursorPaginationOrderSearchExtend{
    let cursor: string | undefined,
      limit: number,
      cursorSort: SortEnum,
      cursorOrder: string;
    cursor = before
      ? Base64.decodeString(before)
      : after
      ? Base64.decodeString(after)
      : last
      ? undefined
      : first
      ? undefined
      : undefined;
    limit = last
      ? Math.min(last, pgMaxLimit)
      : first
      ? Math.min(first, pgMaxLimit)
      : pgMinLimit;
    cursorOrder = defaultCursor;
    cursorSort =
      before || last
        ? SortEnum.asc
        : after || first
        ? SortEnum.desc
        : SortEnum.desc;
    sort = sort ? sort : undefined;
    order = order ? order : undefined;
    query = query ? query : undefined;

    return { cursor, limit, order, sort, cursorOrder, cursorSort, query };
  }
}

const cursorPagination = CursorPagination.get();

export { cursorPagination as CursorPagination };