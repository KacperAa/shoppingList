import { ShopFromDatabase } from './product.interface';

export const SHOPS: ShopFromDatabase[] = [
  {
    id: 1,
    name: 'Biedronka',
    icon: 'https://seeklogo.com/images/B/Biedronka-logo-765A780020-seeklogo.com.png',
  },
  {
    id: 2,
    name: 'Żabka',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Zabka_logo_2020.svg/1200px-Zabka_logo_2020.svg.png',
  },
  {
    id: 3,
    name: 'Kaufland',
    icon: 'data:image/png;base64,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',
  },
  {
    id: 4,
    name: 'Auchan',
    icon: 'https://www.nicepng.com/png/detail/190-1904947_auchan-logo-auchan-log.png',
  },
];