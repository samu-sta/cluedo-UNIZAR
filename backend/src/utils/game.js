export const getGame = async () => {
  return await GameModel.findOne({
    attributes: {
      exclude: ['id']
    },
    include: [
      {
        model: CardModel,
        as: 'cards',
        attributes: {
          exclude: ['id', 'gameId']
        }
      },
      {
        model: BoardModel,
        as: 'board',
        attributes: {
          exclude: ['id', 'gameId']
        },
        include: [{
          model: RoomModel,
          as: 'rooms',
          attributes: {
            exclude: ['id', 'boardId']
          },
          include: [
            {
              model: WallModel,
              as: 'walls',
              attributes: {
                exclude: ['id', 'roomId']
              }
            },
            {
              model: DoorModel,
              as: 'doors',
              attributes: {
                exclude: ['id', 'roomId']
              }
            }
          ]
        }]
      }]
  });
}