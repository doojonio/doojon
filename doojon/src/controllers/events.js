import { EVENT_POST_CREATED } from '../model/dataservices/events.js';
import { ID_STATUS_AUTHORIZED } from '../model/state.js';

const SHOWABLE_EVENTS = [
  EVENT_POST_CREATED,
];

export default class EventsController {
  async getEventsFromFollowing(ctx) {
    const state = await ctx.getState(ctx);

    if (state.uinfo.status !== ID_STATUS_AUTHORIZED)
      return ctx.res.status(401).send('user is not authorized');

    const limit = ctx.req.query.get('limit');
    const sinceEvent = ctx.req.query.get('sinceEvent') ?? undefined;
    const beforeEvent = ctx.req.query.get('beforeEvent') ?? undefined;

    if (limit > 50)
      return ctx.res
        .status(400)
        .send('can not fetch more then 50 events per time');

    const events = await ctx.app.model
      .getDataservice('events')
      .getEventsFromFollowing(state, {
        types: SHOWABLE_EVENTS,
        limit,
        sinceEvent,
        beforeEvent,
      });

    const dataserviceQueries = [];
    const posts = ctx.app.model.getDataservice('posts');

    const post_events = events.filter(e => e.type === EVENT_POST_CREATED);
    if (post_events.length !== 0) {
      dataserviceQueries.push(posts.linkPostsToPostCreatedEvents(state, post_events));
    }

    await Promise.all(dataserviceQueries);

    return ctx.render({
      json: events,
    });
  }
}
