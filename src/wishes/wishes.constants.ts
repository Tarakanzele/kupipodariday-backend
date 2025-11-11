export const WishesLimits = {
  latest: 40,
  mostCopied: 20,
} as const;

export const WishErrors = {
  NotFound: 'Подарок не найден',
  NotOwner: 'Вы не можете изменять чужие подарки',
  CannotChangePrice: 'Нельзя изменить цену подарка, если уже есть взносы',
  OwnWishCopy: 'Вы не можете копировать собственный подарок',
} as const;
