
export default class ChallengesController {

  async getChallengeWithLinkedInformation(ctx) {
    const state = ctx.getState(ctx);

    const id = ctx.req.query.get('id');

    if (!id)
      return ctx.res.status(400).send('missing id parameter');

    const m = ctx.app.model;
    const challenges = await m.getDataservice('challenges').read(state, {id});

    if (challenges.length === 0)
      return ctx.res.status(404).send('Not found');

    const challenge = challenges[0];
    const creator = await m.getDataservice('profiles').read(state, {id: challenge.proposed_by});

    return ctx.render({json: {
      proposed_by: creator[0],
      challenge: challenge,
    }})
  }
}
