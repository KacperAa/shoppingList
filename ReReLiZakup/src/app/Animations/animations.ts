import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const markAsBuyAnimation = trigger('isBuyAnimation', [
  state(
    'open',
    style({
      backgroundColor: '#76b076',
      opacity: 0.5,
      boxShadow: '1px 6px 30px -10px rgba(66, 68, 90, 1)',
      borderBottom: '1px solid gray',
    })
  ),
  transition('* => open', [animate('0.2s')]),
]);

export const navigationSlideOut = trigger('navigationSlideOut', [
  state('open', style({ transform: 'translateX(-100%)' })),
  state('closed', style({ transform: 'translateX(-20%)' })),
  transition('closed <=> open', [
    animate(
      '0.3s',
      keyframes([
        style({ transform: 'translateX(-100%)', offset: 0 }),
        style({ transform: 'translateX(-25%)', opacity: 0.3, offset: 0.7 }),
        style({ transform: 'translateX(-20%)', opacity: 0.8, offset: 1.0 }),
      ])
    ),
  ]),
]);
