import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as styles from './social-footer.css'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

library.add(fab, faCoffee);

export default function SocialFooterComponent () {
    return (
        <div className={styles.socialContainer}>
            <Carousel
                autoPlay={true}
                interval={10000}
                infiniteLoop={true}
                showArrows={false}
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                width={"20rem"}
            >
                <div>
                    <FontAwesomeIcon className={styles.socialIcon} icon={['fab', 'github']} />/ukmadlz
                </div>
                <div>
                    <FontAwesomeIcon className={styles.socialIcon} icon={['fab', 'twitter']} />/ukmadlz
                </div>
                <div>
                    <FontAwesomeIcon className={styles.socialIcon} icon={['fab', 'twitch']} />/ukmadlz
                </div>
                <div>
                    <span>elsmore.me</span>
                </div>
            </Carousel>
        </div>
    );
}