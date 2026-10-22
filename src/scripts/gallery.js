import Isotope from 'isotope-layout';
import 'isotope-masonry-horizontal';

const media = document.querySelector('.media');

if (media && media.querySelectorAll('li').length > 1) {
  new Isotope(media, {
    itemSelector: 'li',
    layoutMode: 'masonryHorizontal',
    containerStyle: { position: 'absolute' },
    resizeContainer: false,
    transitionDuration: 0,
  });
}
