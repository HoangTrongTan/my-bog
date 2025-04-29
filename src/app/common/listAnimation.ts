import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        stagger(
          `60ms ease-out`,
          animate('1000ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ),
      ],
      { optional: true }
    ),
  ]),
]);

export { listAnimation };
